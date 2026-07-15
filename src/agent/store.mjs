import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { AgentError } from "./errors.mjs";
import { assertNoSymlinkSegments, assertSafeIdentifier, resolveInside } from "./security.mjs";

async function readJson(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    if (error instanceof SyntaxError) {
      throw new AgentError("CORRUPT_STATE", "Stored JSON state is invalid.", { path: filePath });
    }
    throw error;
  }
}

async function atomicWriteJson(filePath, value) {
  const directory = path.dirname(filePath);
  await mkdir(directory, { recursive: true, mode: 0o750 });
  const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, { encoding: "utf8", mode: 0o640 });
  await rename(tempPath, filePath);
}

export class WorkspaceStore {
  constructor(workspaceRoot) {
    this.workspaceRoot = path.resolve(workspaceRoot);
    this.stateRoot = resolveInside(this.workspaceRoot, ".brand-kit-builder");
  }

  projectDirectory(projectId) {
    assertSafeIdentifier(projectId, "project_id");
    return resolveInside(this.workspaceRoot, path.join("projects", projectId));
  }

  projectFile(projectId) {
    return path.join(this.projectDirectory(projectId), "project.json");
  }

  ledgerFile(projectId) {
    return path.join(this.projectDirectory(projectId), "source-ledger.json");
  }

  jobFile(idempotencyKey) {
    assertSafeIdentifier(idempotencyKey, "idempotency_key");
    return resolveInside(this.stateRoot, path.join("jobs", `${idempotencyKey}.json`));
  }

  async loadProject(projectId) {
    return readJson(this.projectFile(projectId));
  }

  async saveProject(project) {
    const projectId = assertSafeIdentifier(project.project_id, "project_id");
    const projectFile = this.projectFile(projectId);
    await assertNoSymlinkSegments(this.workspaceRoot, projectFile);
    await atomicWriteJson(projectFile, project);
    return projectFile;
  }

  async saveSourceLedger(projectId, ledger) {
    const ledgerFile = this.ledgerFile(projectId);
    await assertNoSymlinkSegments(this.workspaceRoot, ledgerFile);
    await atomicWriteJson(ledgerFile, ledger);
    return ledgerFile;
  }

  async loadJob(idempotencyKey) {
    return readJson(this.jobFile(idempotencyKey));
  }

  async saveJob(idempotencyKey, job) {
    const jobFile = this.jobFile(idempotencyKey);
    await assertNoSymlinkSegments(this.workspaceRoot, jobFile);
    await atomicWriteJson(jobFile, job);
    return jobFile;
  }
}
