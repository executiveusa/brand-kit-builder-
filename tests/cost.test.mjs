import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { PREBUILD_AXES } from "../src/agent/constants.mjs";
import { createAgentContext, createProject, runStage } from "../src/agent/orchestrator.mjs";

function scores(value = 8.5) {
  return Object.fromEntries(PREBUILD_AXES.map((axis) => [axis, value]));
}

function projectInput(projectId = "cost-test") {
  return {
    project_id: projectId,
    name: `Cost Test ${projectId}`,
    classification: "greenfield",
    owner: "Bambu",
    sources: [{ source_id: "brief", type: "brief", location: "confirmed", trust_level: "primary", accessed: true, conflicts: [] }],
    readiness: { scores: scores() }
  };
}

test("rejects a job above the single-task cost limit", async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "brand-kit-cost-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const context = await createAgentContext(workspace);
  await createProject(context, projectInput());
  await assert.rejects(
    runStage(context, { project_id: "cost-test", stage: "intake", idempotency_key: "too-expensive", estimated_cost_cents: 1001 }),
    (error) => error?.code === "COST_GUARD"
  );
});

test("rejects cumulative reservations above the daily limit", async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), "brand-kit-daily-cost-"));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const context = await createAgentContext(workspace);
  for (let index = 0; index < 5; index += 1) {
    const projectId = `cost-test-${index}`;
    await createProject(context, projectInput(projectId));
    await runStage(context, {
      project_id: projectId,
      stage: "intake",
      idempotency_key: `cost-${index}`,
      estimated_cost_cents: 1000
    });
  }
  await createProject(context, projectInput("cost-test-over"));
  await assert.rejects(
    runStage(context, { project_id: "cost-test-over", stage: "intake", idempotency_key: "cost-over", estimated_cost_cents: 1 }),
    (error) => error?.code === "COST_GUARD"
  );
});
