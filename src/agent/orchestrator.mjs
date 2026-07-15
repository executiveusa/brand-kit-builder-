import { access } from "node:fs/promises";
import path from "node:path";
import { APP_VERSION, GATED_STAGES, OWNER_APPROVAL_STAGES, STAGES, STAGE_OUTPUTS } from "./constants.mjs";
import { AgentError } from "./errors.mjs";
import { assertPrebuildPassed, scorePrebuild } from "./prebuild.mjs";
import { assertApproval, assertNoSecretLikeData, assertSafeIdentifier, ensureWorkspaceRoot, resolveInside } from "./security.mjs";
import { WorkspaceStore } from "./store.mjs";

const CLASSIFICATIONS = new Set([
  "greenfield",
  "brownfield",
  "hybrid",
  "recovery",
  "asset-extension",
  "brand-refresh",
  "full-rebrand"
]);
const SOURCE_TRUST = new Set(["primary", "governing", "reference", "inspiration"]);
const GUARDIAN_NAMES = ["brand", "design", "voice", "rights"];
const MAX_JOB_COST_CENTS = 1000;

function now() {
  return new Date().toISOString();
}

function validateSources(sources) {
  if (!Array.isArray(sources) || sources.length === 0) {
    throw new AgentError("SOURCE_REQUIRED", "At least one source is required. A blank-brief project must provide a brief source record.");
  }
  const seen = new Set();
  return sources.map((source, index) => {
    if (!source || typeof source !== "object") {
      throw new AgentError("INVALID_SOURCE", "Every source must be an object.", { index });
    }
    const sourceId = assertSafeIdentifier(source.source_id, `sources[${index}].source_id`);
    if (seen.has(sourceId)) {
      throw new AgentError("DUPLICATE_SOURCE", "Source IDs must be unique.", { source_id: sourceId });
    }
    seen.add(sourceId);
    if (typeof source.type !== "string" || source.type.trim() === "") {
      throw new AgentError("INVALID_SOURCE", "Every source requires a type.", { source_id: sourceId });
    }
    if (typeof source.location !== "string" || source.location.trim() === "") {
      throw new AgentError("INVALID_SOURCE", "Every source requires a location or explicit brief identifier.", { source_id: sourceId });
    }
    if (!SOURCE_TRUST.has(source.trust_level)) {
      throw new AgentError("INVALID_SOURCE_TRUST", "Source trust_level is invalid.", { source_id: sourceId, allowed: [...SOURCE_TRUST] });
    }
    return {
      source_id: sourceId,
      type: source.type,
      location: source.location,
      trust_level: source.trust_level,
      accessed: Boolean(source.accessed),
      hash_or_commit: source.hash_or_commit ?? "unknown",
      license: source.license ?? "unknown",
      applicable_rules: Array.isArray(source.applicable_rules) ? source.applicable_rules : [],
      conflicts: Array.isArray(source.conflicts) ? source.conflicts : [],
      notes: source.notes ?? ""
    };
  });
}

function validateProjectShape(project) {
  assertNoSecretLikeData(project);
  const projectId = assertSafeIdentifier(project?.project_id, "project_id");
  if (typeof project.name !== "string" || project.name.trim().length < 2) {
    throw new AgentError("INVALID_PROJECT", "Project name must contain at least two characters.");
  }
  if (!CLASSIFICATIONS.has(project.classification)) {
    throw new AgentError("INVALID_CLASSIFICATION", "Project classification is invalid.", { allowed: [...CLASSIFICATIONS] });
  }
  const sources = validateSources(project.sources);
  return { projectId, sources };
}

function assertPriorStageCompleted(project, stage) {
  const index = STAGES.indexOf(stage);
  if (index <= 0) return;
  const prior = STAGES[index - 1];
  if (project.stages?.[prior]?.status !== "completed") {
    throw new AgentError("STAGE_ORDER_GUARD", `Stage ${prior} must be completed before ${stage}.`, { required_stage: prior }, 409);
  }
}

function assertGuardiansPassed(project) {
  const failures = GUARDIAN_NAMES.filter((name) => project.guardians?.[name]?.status !== "passed");
  const p0 = Number(project.guardian_summary?.p0 ?? 0);
  const unresolvedP1 = Number(project.guardian_summary?.unresolved_p1 ?? 0);
  if (failures.length || p0 > 0 || unresolvedP1 > 0) {
    throw new AgentError("GUARDIAN_GATE_FAILED", "All four guardians must pass with no P0 or unresolved P1 findings.", {
      failing_guardians: failures,
      p0,
      unresolved_p1: unresolvedP1
    }, 409);
  }
}

function assertCostWithinPolicy(estimatedCostCents = 0) {
  const cost = Number(estimatedCostCents);
  if (!Number.isFinite(cost) || cost < 0) {
    throw new AgentError("INVALID_COST", "estimated_cost_cents must be a non-negative number.");
  }
  if (cost > MAX_JOB_COST_CENTS) {
    throw new AgentError("COST_GUARD", "The requested job exceeds the $10 single-task limit.", {
      estimated_cost_cents: cost,
      maximum_cost_cents: MAX_JOB_COST_CENTS
    }, 403);
  }
  return Math.round(cost);
}

export async function createAgentContext(workspaceRoot) {
  const root = await ensureWorkspaceRoot(workspaceRoot);
  return { root, store: new WorkspaceStore(root) };
}

export function inspectCapabilities() {
  return {
    ok: true,
    version: APP_VERSION,
    interface: "local-cli-json",
    network_listener: false,
    external_model_calls: false,
    telemetry: false,
    capabilities: {
      create_project: true,
      validate_project: true,
      score_prebuild: true,
      create_stage_work_order: true,
      complete_stage_with_artifact_evidence: true,
      idempotent_jobs: true,
      filesystem_sandbox: true,
      secret_rejection: true,
      owner_approval_gate: true
    },
    limits: {
      max_job_cost_cents: MAX_JOB_COST_CENTS,
      release_floor: 8.5,
      owner_approval_required_for: [...OWNER_APPROVAL_STAGES]
    }
  };
}

export async function createProject(context, input) {
  const { projectId, sources } = validateProjectShape(input);
  const existing = await context.store.loadProject(projectId);
  if (existing) {
    throw new AgentError("PROJECT_EXISTS", "Project already exists. Use a new project_id or an explicit update workflow.", { project_id: projectId }, 409);
  }

  const project = {
    schema_version: "1.0",
    project_id: projectId,
    name: input.name.trim(),
    classification: input.classification,
    owner: input.owner ?? "Bambu",
    primary_audience: input.primary_audience ?? "unknown",
    business_goal: input.business_goal ?? "unknown",
    primary_action: input.primary_action ?? "unknown",
    languages: Array.isArray(input.languages) && input.languages.length ? input.languages : ["en"],
    protected_assets: Array.isArray(input.protected_assets) ? input.protected_assets : [],
    sources,
    readiness: input.readiness?.scores ? scorePrebuild(input.readiness.scores) : null,
    stages: Object.fromEntries(STAGES.map((stage) => [stage, { status: "pending" }])),
    guardians: Object.fromEntries(GUARDIAN_NAMES.map((name) => [name, { status: "pending", findings: [] }])),
    guardian_summary: { p0: 0, unresolved_p1: 0 },
    approvals: Array.isArray(input.approvals) ? input.approvals : [],
    created_at: now(),
    updated_at: now()
  };

  const projectFile = await context.store.saveProject(project);
  const ledgerFile = await context.store.saveSourceLedger(projectId, {
    schema_version: "1.0",
    project_id: projectId,
    sources,
    generated_at: now()
  });

  return {
    ok: true,
    operation: "create_project",
    project,
    files: [path.relative(context.root, projectFile), path.relative(context.root, ledgerFile)]
  };
}

export async function getProject(context, projectId) {
  assertSafeIdentifier(projectId, "project_id");
  const project = await context.store.loadProject(projectId);
  if (!project) throw new AgentError("PROJECT_NOT_FOUND", "Project was not found.", { project_id: projectId }, 404);
  return { ok: true, project };
}

export async function validateProject(context, projectId) {
  const { project } = await getProject(context, projectId);
  const { sources } = validateProjectShape(project);
  const readiness = project.readiness?.scores ? scorePrebuild(project.readiness.scores) : null;
  return {
    ok: true,
    valid: true,
    project_id: projectId,
    source_count: sources.length,
    readiness,
    completed_stages: STAGES.filter((stage) => project.stages?.[stage]?.status === "completed"),
    guardian_gate: GUARDIAN_NAMES.every((name) => project.guardians?.[name]?.status === "passed")
  };
}

export async function runStage(context, input) {
  assertNoSecretLikeData(input);
  const projectId = assertSafeIdentifier(input?.project_id, "project_id");
  const idempotencyKey = assertSafeIdentifier(input?.idempotency_key, "idempotency_key");
  const stage = input?.stage;
  if (!STAGES.includes(stage)) {
    throw new AgentError("INVALID_STAGE", "Unknown stage.", { stage, allowed: STAGES });
  }
  const previous = await context.store.loadJob(idempotencyKey);
  if (previous) {
    return { ok: true, reused: true, job: previous };
  }

  const { project } = await getProject(context, projectId);
  assertPriorStageCompleted(project, stage);
  if (GATED_STAGES.has(stage)) assertPrebuildPassed(project.readiness);
  if (stage === "export") assertGuardiansPassed(project);
  if (OWNER_APPROVAL_STAGES.has(stage)) assertApproval(project.approvals, stage, project.owner);
  const estimatedCostCents = assertCostWithinPolicy(input.estimated_cost_cents ?? 0);

  const job = {
    schema_version: "1.0",
    job_id: `job-${idempotencyKey}`,
    idempotency_key: idempotencyKey,
    project_id: projectId,
    stage,
    status: "ready",
    requested_by: input.requested_by ?? "in-house-agent",
    created_at: now(),
    estimated_cost_cents: estimatedCostCents,
    governing_prompt_index: "docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md",
    required_outputs: STAGE_OUTPUTS[stage],
    constraints: {
      source_first: true,
      no_fabricated_claims: true,
      no_secret_material: true,
      workspace_root: path.relative(process.cwd(), context.root) || ".",
      project_root: path.relative(context.root, context.store.projectDirectory(projectId)),
      release_floor: 8.5
    },
    completion_command: "complete-stage"
  };
  await context.store.saveJob(idempotencyKey, job);
  return { ok: true, reused: false, job };
}

export async function completeStage(context, input) {
  assertNoSecretLikeData(input);
  const projectId = assertSafeIdentifier(input?.project_id, "project_id");
  const stage = input?.stage;
  if (!STAGES.includes(stage)) throw new AgentError("INVALID_STAGE", "Unknown stage.", { stage, allowed: STAGES });
  const { project } = await getProject(context, projectId);
  assertPriorStageCompleted(project, stage);
  if (GATED_STAGES.has(stage)) assertPrebuildPassed(project.readiness);
  if (OWNER_APPROVAL_STAGES.has(stage)) assertApproval(project.approvals, stage, project.owner);

  const projectRoot = context.store.projectDirectory(projectId);
  const artifacts = Array.isArray(input.artifacts) ? input.artifacts : [];
  const artifactMap = new Map(artifacts.map((item) => [item?.path, item]));
  const missing = STAGE_OUTPUTS[stage].filter((requiredPath) => !artifactMap.has(requiredPath));
  if (missing.length) {
    throw new AgentError("ARTIFACT_MANIFEST_INCOMPLETE", "Required stage artifacts are missing from the manifest.", { missing });
  }

  for (const requiredPath of STAGE_OUTPUTS[stage]) {
    const absolutePath = resolveInside(projectRoot, requiredPath);
    try {
      await access(absolutePath);
    } catch {
      throw new AgentError("ARTIFACT_NOT_FOUND", "A declared artifact does not exist in the project workspace.", { path: requiredPath });
    }
  }

  if (stage === "readiness") {
    project.readiness = scorePrebuild(input.readiness_scores);
  }
  if (stage === "guardian") {
    const guardians = input.guardians;
    for (const name of GUARDIAN_NAMES) {
      if (guardians?.[name]?.status !== "passed") {
        throw new AgentError("GUARDIAN_GATE_FAILED", `Guardian ${name} did not pass.`, { guardian: name });
      }
    }
    project.guardians = guardians;
    project.guardian_summary = {
      p0: Number(input.guardian_summary?.p0 ?? 0),
      unresolved_p1: Number(input.guardian_summary?.unresolved_p1 ?? 0)
    };
    assertGuardiansPassed(project);
  }

  project.stages[stage] = {
    status: "completed",
    completed_at: now(),
    artifacts: STAGE_OUTPUTS[stage]
  };
  project.updated_at = now();
  await context.store.saveProject(project);

  return {
    ok: true,
    operation: "complete_stage",
    project_id: projectId,
    stage,
    status: "completed",
    next_stage: STAGES[STAGES.indexOf(stage) + 1] ?? null
  };
}
