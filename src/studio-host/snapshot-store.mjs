import { appendFile, mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { assertNoSecretLikeData, assertSafeIdentifier, resolveInside } from '../agent/security.mjs';

function now() { return new Date().toISOString(); }
function clone(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }

function stripApprovalState(snapshot) {
  const clean = clone(snapshot);
  delete clean.approvals;
  delete clean.export_approval;
  delete clean.export_package;
  if (clean.release_summary) delete clean.release_summary.approval;
  return clean;
}

export class StudioSnapshotStore {
  constructor(workspaceRoot) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.root = resolveInside(this.workspaceRoot, '.brand-kit-builder/studio');
    this.stateFile = resolveInside(this.root, 'state.json');
    this.eventsFile = resolveInside(this.root, 'events.ndjson');
  }

  async load() {
    try {
      const parsed = JSON.parse(await readFile(this.stateFile, 'utf8'));
      if (parsed?.version === 1 && parsed.projects) return parsed;
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
    return { version: 1, current_project_id: null, projects: {}, updated_at: null };
  }

  async save(state) {
    await mkdir(this.root, { recursive: true, mode: 0o750 });
    const temporary = `${this.stateFile}.${process.pid}.${Date.now()}.tmp`;
    const next = { ...state, version: 1, updated_at: now() };
    await writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, { mode: 0o640 });
    await rename(temporary, this.stateFile);
    return next;
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
    await mkdir(this.root, { recursive: true, mode: 0o750 });
    const record = { timestamp: now(), command, project_id: projectId, payload: safePayload };
    await appendFile(this.eventsFile, `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o640 });
    return record;
  }
}
