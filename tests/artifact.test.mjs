import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PREBUILD_AXES, STAGE_OUTPUTS } from "../src/agent/constants.mjs";
import { completeStage, createAgentContext, createProject, runStage } from "../src/agent/orchestrator.mjs";

function scores(value = 8.5) {
  return Object.fromEntries(PREBUILD_AXES.map((axis) => [axis, value]));
}

function projectInput(projectId, accessed = true) {
  return {
    project_id: projectId,
    name: `Artifact Test ${projectId}`,
    classification: "greenfield",
    owner: "Bambu",
    sources: [{
      source_id: "brief",
      type: "brief",
      location: "confirmed-brief",
      trust_level: "primary",
      accessed,
      conflicts: []
    }],
    readiness: { scores: scores() }
  };
}

async function writeIntakeArtifacts(context, projectId) {
  const root = context.store.projectDirectory(projectId);
  for (const relative of STAGE_OUTPUTS.intake) {
    const target = path.join(root, relative);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `${relative}\n`, "utf8");
  }
}

test("rejects a caller-supplied artifact hash mismatch", async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "brand-kit-hash-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const context = await createAgentContext(workspace);
  await createProject(context, projectInput("hash-test"));
  await runStage(context, { project_id: "hash-test", stage: "intake", idempotency_key: "hash-intake" });
  await writeIntakeArtifacts(context, "hash-test");

  await assert.rejects(
    completeStage(context, {
      project_id: "hash-test",
      stage: "intake",
      idempotency_key: "hash-intake",
      artifacts: STAGE_OUTPUTS.intake.map((artifactPath, index) => ({
        path: artifactPath,
        ...(index === 0 ? { sha256: "0".repeat(64) } : {})
      }))
    }),
    (error) => error?.code === "ARTIFACT_HASH_MISMATCH"
  );
});

test("rejects symlink artifacts", { skip: process.platform === "win32" }, async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "brand-kit-symlink-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const context = await createAgentContext(workspace);
  await createProject(context, projectInput("symlink-test"));
  await runStage(context, { project_id: "symlink-test", stage: "intake", idempotency_key: "symlink-intake" });

  const root = context.store.projectDirectory("symlink-test");
  const first = path.join(root, STAGE_OUTPUTS.intake[0]);
  const second = path.join(root, STAGE_OUTPUTS.intake[1]);
  await mkdir(path.dirname(first), { recursive: true });
  await writeFile(first, "regular\n", "utf8");
  await mkdir(path.dirname(second), { recursive: true });
  await symlink(first, second);

  await assert.rejects(
    completeStage(context, {
      project_id: "symlink-test",
      stage: "intake",
      idempotency_key: "symlink-intake",
      artifacts: STAGE_OUTPUTS.intake.map((artifactPath) => ({ path: artifactPath }))
    }),
    (error) => error?.code === "ARTIFACT_TYPE_GUARD"
  );
});

test("blocks readiness while a primary source is unread", async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "brand-kit-source-gate-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const context = await createAgentContext(workspace);
  await createProject(context, projectInput("source-gate-test", false));
  const project = await context.store.loadProject("source-gate-test");
  project.stages.intake = { status: "completed" };
  project.stages.sources = { status: "completed" };
  await context.store.saveProject(project);

  await assert.rejects(
    runStage(context, { project_id: "source-gate-test", stage: "readiness", idempotency_key: "source-gate-readiness" }),
    (error) => error?.code === "SOURCE_GATE_FAILED"
  );
});
