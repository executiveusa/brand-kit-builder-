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

function projectInput(projectId = "test-brand") {
  return {
    project_id: projectId,
    name: "Test Brand",
    classification: "greenfield",
    owner: "Bambu",
    sources: [{
      source_id: "brief",
      type: "brief",
      location: "user-confirmed-brief",
      trust_level: "primary",
      accessed: true,
      conflicts: []
    }],
    readiness: { scores: scores() }
  };
}

async function writeStageArtifacts(context, projectId, stage) {
  const root = context.store.projectDirectory(projectId);
  for (const relative of STAGE_OUTPUTS[stage]) {
    const target = path.join(root, relative);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, `test evidence for ${relative}\n`, "utf8");
  }
}

test("binds idempotency keys, work orders, stage state, and artifact evidence", async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "brand-kit-builder-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const context = await createAgentContext(workspace);
  await createProject(context, projectInput());

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
    runStage(context, { project_id: "test-brand", stage: "sources", idempotency_key: "test-intake-v1" }),
    (error) => error?.code === "IDEMPOTENCY_CONFLICT"
  );
  await assert.rejects(
    runStage(context, { project_id: "test-brand", stage: "sources", idempotency_key: "test-sources-early" }),
    (error) => error?.code === "STAGE_ORDER_GUARD"
  );
  await assert.rejects(
    completeStage(context, {
      project_id: "test-brand",
      stage: "intake",
      idempotency_key: "missing-work-order",
      artifacts: STAGE_OUTPUTS.intake.map((artifactPath) => ({ path: artifactPath }))
    }),
    (error) => error?.code === "WORK_ORDER_REQUIRED"
  );

  await writeStageArtifacts(context, "test-brand", "intake");
  const completion = await completeStage(context, {
    project_id: "test-brand",
    stage: "intake",
    idempotency_key: "test-intake-v1",
    artifacts: STAGE_OUTPUTS.intake.map((artifactPath) => ({ path: artifactPath, media_type: "text/plain" }))
  });
  assert.equal(completion.reused, false);
  assert.equal(completion.artifacts.length, STAGE_OUTPUTS.intake.length);
  assert.match(completion.artifacts[0].sha256, /^[a-f0-9]{64}$/);

  const repeatedCompletion = await completeStage(context, {
    project_id: "test-brand",
    stage: "intake",
    idempotency_key: "test-intake-v1",
    artifacts: STAGE_OUTPUTS.intake.map((artifactPath) => ({ path: artifactPath }))
  });
  assert.equal(repeatedCompletion.reused, true);

  const sources = await runStage(context, {
    project_id: "test-brand",
    stage: "sources",
    idempotency_key: "test-sources-v1"
  });
  assert.equal(sources.job.status, "ready");
  await assert.rejects(
    runStage(context, { project_id: "test-brand", stage: "sources", idempotency_key: "second-source-job" }),
    (error) => error?.code === "STAGE_ALREADY_ACTIVE"
  );

  await writeStageArtifacts(context, "test-brand", "sources");
  await completeStage(context, {
    project_id: "test-brand",
    stage: "sources",
    idempotency_key: "test-sources-v1",
    sources: projectInput().sources,
    artifacts: STAGE_OUTPUTS.sources.map((artifactPath) => ({ path: artifactPath }))
  });
  const readiness = await runStage(context, {
    project_id: "test-brand",
    stage: "readiness",
    idempotency_key: "test-readiness-v1"
  });
  assert.equal(readiness.job.stage, "readiness");
});

test("requires owner approval and passed guardians before export", async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "brand-kit-builder-export-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const context = await createAgentContext(workspace);
  await createProject(context, projectInput());
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

  const activeProject = await context.store.loadProject("test-brand");
  activeProject.guardians.rights.status = "failed";
  await context.store.saveProject(activeProject);
  await writeStageArtifacts(context, "test-brand", "export");
  await assert.rejects(
    completeStage(context, {
      project_id: "test-brand",
      stage: "export",
      idempotency_key: "export-approved",
      artifacts: STAGE_OUTPUTS.export.map((artifactPath) => ({ path: artifactPath }))
    }),
    (error) => error?.code === "GUARDIAN_GATE_FAILED"
  );
});
