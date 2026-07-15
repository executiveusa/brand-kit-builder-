import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PREBUILD_AXES, STAGES, STAGE_OUTPUTS } from "../src/agent/constants.mjs";
import { completeStage, createAgentContext, createProject, runStage } from "../src/agent/orchestrator.mjs";

function scores(value = 8.5) {
  return Object.fromEntries(PREBUILD_AXES.map((axis) => [axis, value]));
}

function input() {
  return {
    project_id: "test-brand",
    name: "Test Brand",
    classification: "greenfield",
    owner: "Bambu",
    sources: [{
      source_id: "brief",
      type: "brief",
      location: "user-confirmed-brief",
      trust_level: "primary",
      accessed: true
    }],
    readiness: { scores: scores() }
  };
}

async function writeStageArtifacts(context, projectId, stage) {
  const root = context.store.projectDirectory(projectId);
  for (const relative of STAGE_OUTPUTS[stage]) {
    const target = path.join(root, relative);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, "test evidence\n", "utf8");
  }
}

test("creates idempotent work orders and enforces stage order", async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "brand-kit-builder-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const context = await createAgentContext(workspace);
  await createProject(context, input());

  const request = {
    project_id: "test-brand",
    stage: "intake",
    idempotency_key: "test-intake-v1",
    estimated_cost_cents: 0
  };
  const first = await runStage(context, request);
  const second = await runStage(context, request);
  assert.equal(first.reused, false);
  assert.equal(second.reused, true);
  assert.equal(second.job.job_id, first.job.job_id);

  await assert.rejects(
    runStage(context, { ...request, stage: "sources", idempotency_key: "test-sources-early" }),
    (error) => error?.code === "STAGE_ORDER_GUARD"
  );

  await writeStageArtifacts(context, "test-brand", "intake");
  await completeStage(context, {
    project_id: "test-brand",
    stage: "intake",
    artifacts: STAGE_OUTPUTS.intake.map((artifactPath) => ({ path: artifactPath }))
  });
  const sources = await runStage(context, {
    project_id: "test-brand",
    stage: "sources",
    idempotency_key: "test-sources-v1"
  });
  assert.equal(sources.job.status, "ready");
});

test("requires owner approval and passed guardians before export", async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "brand-kit-builder-export-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const context = await createAgentContext(workspace);
  await createProject(context, input());
  const project = await context.store.loadProject("test-brand");
  for (const stage of STAGES.slice(0, -1)) project.stages[stage] = { status: "completed" };
  project.guardians = {
    brand: { status: "passed", findings: [] },
    design: { status: "passed", findings: [] },
    voice: { status: "passed", findings: [] },
    rights: { status: "passed", findings: [] }
  };
  project.guardian_summary = { p0: 0, unresolved_p1: 0 };
  await context.store.saveProject(project);

  await assert.rejects(
    runStage(context, { project_id: "test-brand", stage: "export", idempotency_key: "export-no-approval" }),
    (error) => error?.code === "APPROVAL_REQUIRED"
  );

  project.approvals.push({
    action: "export",
    approved_by: "Bambu",
    status: "approved",
    approved_at: new Date().toISOString()
  });
  await context.store.saveProject(project);
  const result = await runStage(context, {
    project_id: "test-brand",
    stage: "export",
    idempotency_key: "export-approved"
  });
  assert.equal(result.job.stage, "export");
  assert.equal(result.job.status, "ready");
});
