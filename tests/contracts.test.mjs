import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CANONICAL_VERSION,
  STAGES,
  STAGE_OUTPUTS,
  GATED_STAGES,
  OWNER_APPROVAL_STAGES,
  PREBUILD_AXES,
  PREBUILD_AXIS_IDS,
  CRITICAL_PREBUILD_AXES,
  CRITICAL_PREBUILD_AXIS_IDS,
  GUARDIAN_NAMES,
  SOURCE_TRUST_LEVELS,
  PROJECT_CLASSIFICATIONS,
  RELEASE_FLOOR,
  MAX_JOB_COST_CENTS,
  MAX_DAILY_COST_CENTS,
  CAPABILITY_DESCRIPTOR,
  STUDIO_AXIS_ALIASES,
  createBrandProjectShell,
  createEvidenceRecord,
  createWorkOrder,
  createGuardianReview,
  createApproval,
  createArtifact,
  createCapabilityDescriptor
} from "../apps/studio/contracts.js";
import { APP_VERSION, PREBUILD_AXES as AGENT_AXIS_IDS, STAGES as AGENT_STAGES, GUARDIAN_NAMES as AGENT_GUARDIANS } from "../src/agent/constants.mjs";

test("canonical contracts define exactly 20 prebuild axes", () => {
  assert.equal(PREBUILD_AXES.length, 20);
  assert.equal(PREBUILD_AXIS_IDS.length, 20);
});

test("canonical contracts define exactly 9 stages", () => {
  assert.equal(STAGES.length, 9);
});

test("canonical contracts define exactly 4 guardians", () => {
  assert.equal(GUARDIAN_NAMES.length, 4);
  assert.deepEqual([...GUARDIAN_NAMES].sort(), ["brand", "design", "rights", "voice"]);
});

test("canonical contracts define 5 critical prebuild axes", () => {
  assert.equal(CRITICAL_PREBUILD_AXIS_IDS.length, 5);
  assert.equal(CRITICAL_PREBUILD_AXES.size, 5);
});

test("agent core re-exports canonical constants", () => {
  assert.equal(APP_VERSION, CANONICAL_VERSION);
  assert.deepEqual(AGENT_STAGES, STAGES);
  assert.deepEqual(AGENT_AXIS_IDS, PREBUILD_AXIS_IDS);
  assert.deepEqual(AGENT_GUARDIANS, GUARDIAN_NAMES);
});

test("stage outputs cover every stage", () => {
  for (const stage of STAGES) {
    assert.ok(Array.isArray(STAGE_OUTPUTS[stage]), `Stage ${stage} must have outputs`);
    assert.ok(STAGE_OUTPUTS[stage].length > 0, `Stage ${stage} must have at least one output`);
  }
});

test("gated stages are a subset of all stages", () => {
  for (const stage of GATED_STAGES) {
    assert.ok(STAGES.includes(stage), `Gated stage ${stage} must be in STAGES`);
  }
});

test("owner approval stages are a subset of all stages", () => {
  for (const stage of OWNER_APPROVAL_STAGES) {
    assert.ok(STAGES.includes(stage), `Owner approval stage ${stage} must be in STAGES`);
  }
});

test("studio axis aliases cover all axes", () => {
  assert.equal(Object.keys(STUDIO_AXIS_ALIASES).length, 20);
  for (const canonicalId of PREBUILD_AXIS_IDS) {
    const hasAlias = Object.values(STUDIO_AXIS_ALIASES).includes(canonicalId);
    assert.ok(hasAlias, `Canonical axis ${canonicalId} must have an alias entry`);
  }
});

test("source trust levels include all required levels", () => {
  for (const level of ["primary", "governing", "reference", "inspiration"]) {
    assert.ok(SOURCE_TRUST_LEVELS.has(level), `Trust level ${level} must be defined`);
  }
});

test("project classifications include all required types", () => {
  for (const type of ["greenfield", "brownfield", "hybrid", "recovery", "asset-extension", "brand-refresh", "full-rebrand"]) {
    assert.ok(PROJECT_CLASSIFICATIONS.has(type), `Classification ${type} must be defined`);
  }
});

test("capability descriptor matches studio policy", () => {
  assert.equal(CAPABILITY_DESCRIPTOR.agent_supplied_approvals, false);
  assert.equal(CAPABILITY_DESCRIPTOR.owner_approval_gate, true);
  assert.equal(CAPABILITY_DESCRIPTOR.daily_cost_guard, true);
});

test("cost limits match studio policy", () => {
  assert.equal(MAX_JOB_COST_CENTS, 1000);
  assert.equal(MAX_DAILY_COST_CENTS, 5000);
  assert.equal(RELEASE_FLOOR, 8.5);
});

test("createBrandProjectShell produces valid project structure", () => {
  const project = createBrandProjectShell({ project_id: "test", name: "Test" });
  assert.equal(project.schema_version, "1.0");
  assert.equal(project.project_id, "test");
  assert.equal(project.name, "Test");
  assert.equal(project.owner, "Bambu");
  assert.equal(project.languages[0], "en");
  assert.equal(project.stages.intake.status, "pending");
  assert.equal(project.guardians.brand.status, "pending");
  assert.equal(project.approvals.length, 0);
});

test("createEvidenceRecord produces valid evidence structure", () => {
  const evidence = createEvidenceRecord({ evidence_id: "ev-1", project_id: "p-1", claim: "test" });
  assert.equal(evidence.schema_version, "1.0");
  assert.equal(evidence.evidence_id, "ev-1");
  assert.equal(evidence.verification_state, "unverified");
  assert.equal(evidence.usable_for_public_claims, false);
});

test("createWorkOrder produces valid work order structure", () => {
  const wo = createWorkOrder({ job_id: "job-1", idempotency_key: "key-1", project_id: "p-1", stage: "intake" });
  assert.equal(wo.schema_version, "1.0");
  assert.equal(wo.job_id, "job-1");
  assert.equal(wo.status, "ready");
  assert.equal(wo.completion_command, "complete-stage");
});

test("createGuardianReview produces valid guardian structure", () => {
  const gr = createGuardianReview({ guardian: "brand" });
  assert.equal(gr.schema_version, "1.0");
  assert.equal(gr.guardian, "brand");
  assert.equal(gr.status, "pending");
  assert.equal(gr.independent_confirmed, false);
  assert.equal(gr.findings.length, 0);
});

test("createApproval produces valid approval structure", () => {
  const ap = createApproval({ action: "export", approved_by: "Bambu" });
  assert.equal(ap.action, "export");
  assert.equal(ap.approved_by, "Bambu");
  assert.equal(ap.status, "pending");
  assert.equal(ap.channel, "interactive-local-cli");
});

test("createArtifact produces valid artifact structure", () => {
  const art = createArtifact({ path: "test.json", sha256: "abc123" });
  assert.equal(art.path, "test.json");
  assert.equal(art.sha256, "abc123");
  assert.equal(art.status, "pending");
  assert.equal(art.media_type, "application/octet-stream");
});

test("createCapabilityDescriptor matches inspect output", () => {
  const cap = createCapabilityDescriptor();
  assert.equal(cap.version, CANONICAL_VERSION);
  assert.equal(cap.network_listener, false);
  assert.equal(cap.external_model_calls, false);
  assert.equal(cap.telemetry, false);
  assert.equal(cap.limits.max_job_cost_cents, 1000);
  assert.equal(cap.limits.max_daily_cost_cents, 5000);
  assert.equal(cap.limits.release_floor, 8.5);
});
