import { constants } from 'node:fs';
import { mkdir, open, realpath, rename } from 'node:fs/promises';
import path from 'node:path';
import { AgentError } from '../agent/errors.mjs';
import { assertNoSecretLikeData, assertNoSymlinkSegments, assertSafeIdentifier, resolveInside } from '../agent/security.mjs';

const DIRECTORY_FLAGS = constants.O_RDONLY | (constants.O_DIRECTORY ?? 0) | (constants.O_NOFOLLOW ?? 0);
const NOFOLLOW = constants.O_NOFOLLOW ?? 0;

function now() { return new Date().toISOString(); }
function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
function descriptorPath(handle) { return `/proc/self/fd/${handle.fd}`; }
function isInside(root, candidate) {
  const relation = path.relative(root, candidate);
  return relation === '' || (!relation.startsWith('..') && !path.isAbsolute(relation));
}

function stripApprovalState(snapshot) {
  const clean = clone(snapshot);
  delete clean.approvals;
  delete clean.export_approval;
  delete clean.export_package;
  if (clean.release_summary) delete clean.release_summary.approval;
  return clean;
}

async function createDirectoryEntry(parentPath, name) {
  try {
    await mkdir(path.join(parentPath, name), { mode: 0o750 });
  } catch (error) {
    if (error?.code !== 'EEXIST') throw error;
  }
}

async function openLinuxBoundRoot(workspaceRoot) {
  const expectedRoot = await realpath(workspaceRoot);
  const workspaceHandle = await open(expectedRoot, DIRECTORY_FLAGS);
  try {
    const workspacePath = descriptorPath(workspaceHandle);
    if (await realpath(workspacePath) !== expectedRoot) {
      throw new AgentError('WORKSPACE_GUARD', 'The workspace directory handle does not match the configured root.');
    }

    await createDirectoryEntry(workspacePath, '.brand-kit-builder');
    const stateHandle = await open(path.join(workspacePath, '.brand-kit-builder'), DIRECTORY_FLAGS);
    try {
      const statePath = descriptorPath(stateHandle);
      await createDirectoryEntry(statePath, 'studio');
      const studioHandle = await open(path.join(statePath, 'studio'), DIRECTORY_FLAGS);
      const actualStudio = await realpath(descriptorPath(studioHandle));
      if (!isInside(expectedRoot, actualStudio)) {
        await studioHandle.close();
        throw new AgentError('PATH_GUARD', 'The Studio state directory escapes the workspace root.');
      }
      return { basePath: descriptorPath(studioHandle), close: () => studioHandle.close(), descriptorBound: true };
    } finally {
      await stateHandle.close();
    }
  } finally {
    await workspaceHandle.close();
  }
}

async function openPortableRoot(workspaceRoot, root) {
  await assertNoSymlinkSegments(workspaceRoot, root);
  await mkdir(root, { recursive: true, mode: 0o750 });
  await assertNoSymlinkSegments(workspaceRoot, root);
  const actualRoot = await realpath(root);
  const expectedRoot = await realpath(workspaceRoot);
  if (!isInside(expectedRoot, actualRoot)) throw new AgentError('PATH_GUARD', 'The Studio state directory escapes the workspace root.');
  return { basePath: actualRoot, close: async () => {}, descriptorBound: false };
}

async function openBoundRoot(workspaceRoot, root) {
  if (process.platform === 'linux') return openLinuxBoundRoot(workspaceRoot);
  return openPortableRoot(workspaceRoot, root);
}

async function withBoundRoot(workspaceRoot, root, operation) {
  const bound = await openBoundRoot(workspaceRoot, root);
  try {
    return await operation(bound.basePath, bound.descriptorBound);
  } finally {
    await bound.close();
  }
}

async function readUtf8NoFollow(filePath) {
  const handle = await open(filePath, constants.O_RDONLY | NOFOLLOW);
  try {
    return await handle.readFile('utf8');
  } finally {
    await handle.close();
  }
}

async function writeUtf8Exclusive(filePath, content) {
  const handle = await open(filePath, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | NOFOLLOW, 0o640);
  try {
    await handle.writeFile(content, 'utf8');
    await handle.sync();
  } finally {
    await handle.close();
  }
}

async function appendUtf8NoFollow(filePath, content) {
  const handle = await open(filePath, constants.O_WRONLY | constants.O_CREAT | constants.O_APPEND | NOFOLLOW, 0o640);
  try {
    await handle.writeFile(content, 'utf8');
    await handle.sync();
  } finally {
    await handle.close();
  }
}

export class StudioSnapshotStore {
  constructor(workspaceRoot) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.root = resolveInside(this.workspaceRoot, '.brand-kit-builder/studio');
  }

  async load() {
    return withBoundRoot(this.workspaceRoot, this.root, async (rootPath) => {
      try {
        const parsed = JSON.parse(await readUtf8NoFollow(path.join(rootPath, 'state.json')));
        if (parsed?.version === 1 && parsed.projects) return parsed;
      } catch (error) {
        if (error?.code !== 'ENOENT') throw error;
      }
      return { version: 1, current_project_id: null, projects: {}, updated_at: null };
    });
  }

  async save(state) {
    return withBoundRoot(this.workspaceRoot, this.root, async (rootPath) => {
      const stateFile = path.join(rootPath, 'state.json');
      const temporary = path.join(rootPath, `state.json.${process.pid}.${Date.now()}.tmp`);
      const next = { ...state, version: 1, updated_at: now() };
      try {
        await writeUtf8Exclusive(temporary, `${JSON.stringify(next, null, 2)}\n`);
        await rename(temporary, stateFile);
      } catch (error) {
        try { await import('node:fs/promises').then(({ rm }) => rm(temporary, { force: true })); } catch {}
        throw error;
      }
      return next;
    });
  }

  async upsertSnapshot(snapshot) {
    assertNoSecretLikeData(snapshot);
    const projectId = assertSafeIdentifier(snapshot?.project_id, 'project_id');
    const clean = stripApprovalState(snapshot);
    clean.project_id = projectId;
    const state = await this.load();
    state.projects[projectId] = clean;
    state.current_project_id = projectId;
    await this.save(state);
    return clean;
  }

  async appendEvent(command, payload = {}) {
    const projectId = payload?.project_id || payload?.project_snapshot?.project_id || null;
    if (projectId) assertSafeIdentifier(projectId, 'project_id');
    const safePayload = clone(payload);
    delete safePayload.project_snapshot;
    delete safePayload.approvals;
    delete safePayload.export_approval;
    assertNoSecretLikeData(safePayload);
    const record = { timestamp: now(), command, project_id: projectId, payload: safePayload };
    await withBoundRoot(this.workspaceRoot, this.root, (rootPath) => appendUtf8NoFollow(path.join(rootPath, 'events.ndjson'), `${JSON.stringify(record)}\n`));
    return record;
  }
}
