import { createReadStream } from "node:fs";
import { lstat } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { APP_VERSION, GATED_STAGES, GUARDIAN_NAMES, MAX_DAILY_COST_CENTS, MAX_JOB_COST_CENTS, OWNER_APPROVAL_STAGES, PROJECT_CLASSIFICATIONS, SOURCE_TRUST_LEVELS, STAGES, STAGE_OUTPUTS } from "./constants.mjs";
import { AgentError } from "./errors.mjs";
import { assertPrebuildPassed, scorePrebuild } from "./prebuild.mjs";
import { assertApproval, assertNoSecretLikeData, assertSafeIdentifier, ensureWorkspaceRoot, resolveInside } from "./security.mjs";
import { WorkspaceStore } from "./store.mjs";

function now() {
  return new Date().toISOString();
}

function utcDay() {
  return new Date().toISOString().slice(0, 10);
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
    if (!SOURCE_TRUST_LEVELS.has(source.trust_level)) {
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

function assertSourcesReady(sources) {
  const normalized = validateSources(sources);
  const governing = normalized.filter((source) => source.trust_level === "primary" || source.trust_level === "governing");
  const unread = governing.filter((source) => !source.accessed).map((source) => source.source_id);
  const unresolvedConflicts = normalized
    .filter((source) => source.conflicts.length > 0)
    .map((source) => ({ source_id: source.source_id, conflicts: source.conflicts }));
  if (governing.length === 0 || unread.length > 0 || unresolvedConflicts.length > 0) {
    throw new AgentError("SOURCE_GATE_FAILED", "Primary and governing sources must be accessed and conflicts resolved before readiness or generation.", {
      governing_source_count: governing.length,
      unread_sources: unread,
      unresolved_conflicts: unresolvedConflicts
    }, 409);
  }
  return normalized;
}

function validateProjectShape(project) {
  assertNoSecretLikeData(project);
  const projectId = assertSafeIdentifier(project?.project_id, "project_id");
  if (typeof project.name !== "string" || project.name.trim().length < 2) {
    throw new AgentError("INVALID_PROJECT", "Project name must contain at least two characters.");
  }
  if (!PROJECT_CLASSIFICATIONS.has(project.classification)) {
    throw new AgentError("INVALID_CLASSIFICATION", "Project classification is invalid.", { allowed: [...PROJECT_CLASSIFICATIONS] });
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

function assertStageAvailable(project, stage) {
  const state = project.stages?.[stage]?.status;
  if (state === "completed") {
    throw new AgentError("STAGE_ALREADY_COMPLETED", `Stage ${stage} is already completed.`, { stage }, 409);
  }
  if (state === "ready") {
    throw new AgentError("STAGE_ALREADY_ACTIVE", `Stage ${stage} already has an active work order.`, {
      stage,
      job_id: project.stages?.[stage]?.job_id
    }, 409);
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

function normalizeJobCost(estimatedCostCents = 0) {
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

async function reserveDailyCost(context, jobId, estimatedCostCents) {
  const day = utcDay();
  const current = await context.store.loadDailyUsage(day) ?? {
    schema_version: "1.0",
    day,
    reserved_cost_cents: 0,
    jobs: []
  };
  if (current.jobs.some((job) => job.job_id === jobId)) return current;
  const nextTotal = Number(current.reserved_cost_cents ?? 0) + estimatedCostCents;
  if (nextTotal > MAX_DAILY_COST_CENTS) {
    throw new AgentError("COST_GUARD", "The requested job would exceed the $50 daily limit.", {
      day,
      current_reserved_cost_cents: current.reserved_cost_cents,
      requested_cost_cents: estimatedCostCents,
      maximum_daily_cost_cents: MAX_DAILY_COST_CENTS
    }, 403);
  }
  current.reserved_cost_cents = nextTotal;
  current.jobs.push({ job_id: jobId, estimated_cost_cents: estimatedCostCents, reserved_at: now() });
  await context.store.saveDailyUsage(day, current);
  return current;
}

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("error", reject);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

async function verifyArtifact(projectRoot, relativePath, manifestItem) {
  const absolutePath = resolveInside(projectRoot, relativePath);
  let stats;
  try {
    stats = await lstat(absolutePath);
  } catch (error) {
    if (error?.code === "ENOENT") {
      throw new AgentError("ARTIFACT_NOT_FOUND", "A declared artifact does not exist in the project workspace.", { path: relativePath });
    }
    throw error;
  }
  if (stats.isSymbolicLink() || !stats.isFile()) {
    throw new AgentError("ARTIFACT_TYPE_GUARD", "Stage artifacts must be regular files and may not be symbolic links.", { path: relativePath });
  }
  const sha256 = await sha256File(absolutePath);
  if (manifestItem?.sha256 && manifestItem.sha256.toLowerCase() !== sha256) {
    throw new AgentError("ARTIFACT_HASH_MISMATCH", "Artifact hash does not match the completion manifest.", {
      path: relativePath,
      expected: manifestItem.sha256.toLowerCase(),
      actual: sha256
    }, 409);
  }
  return {
    path: relativePath,
    media_type: manifestItem?.media_type ?? "application/octet-stream",
    size_bytes: stats.size,
    sha256
  };
}

function validateArtifactManifest(stage, artifacts) {
  if (!Array.isArray(artifacts)) {
    throw new AgentError("INVALID_ARTIFACT_MANIFEST", "artifacts must be an array.");
  }
  const required = STAGE_OUTPUTS[stage];
  const paths = artifacts.map((item) => item?.path);
  if (paths.some((itemPath) => typeof itemPath !== "string" || itemPath.trim() === "")) {
    throw new AgentError("INVALID_ARTIFACT_MANIFEST", "Every artifact requires a project-relative path.");
  }
  const duplicates = paths.filter((itemPath, index) => paths.indexOf(itemPath) !== index);
  const missing = required.filter((requiredPath) => !paths.includes(requiredPath));
  const extra = paths.filter((itemPath) => !required.includes(itemPath));
  if (duplicates.length || missing.length || extra.length) {
    throw new AgentError("ARTIFACT_MANIFEST_MISMATCH", "Artifact manifest must contain exactly the required stage outputs.", {
      duplicates: [...new Set(duplicates)],
      missing,
      extra
    });
  }
  return new Map(artifacts.map((item) => [item.path, item]));
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
      artifact_hashing: true,
      idempotent_jobs: true,
      filesystem_sandbox: true,
      secret_rejection: true,
      owner_approval_gate: true,
      agent_supplied_approvals: false,
      daily_cost_guard: true
    },
    limits: {
      max_job_cost_cents: MAX_JOB_COST_CENTS,
      max_daily_cost_cents: MAX_DAILY_COST_CENTS,
      release_floor: 8.5,
      owner_approval_required_for: [...OWNER_APPROVAL_STAGES]
    }
  };
}

export async function createProject(context, input) {
  if (Object.prototype.hasOwnProperty.call(input ?? {}, "approvals")) {
    throw new AgentError("APPROVAL_INJECTION_GUARD", "Approvals cannot be supplied through project intake or agent JSON.", {
      remediation: "Use the local interactive approval command after all release gates pass."
    }, 403);
  }
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
    approvals: [],
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

export async function recordOwnerApproval(context, input) {
  const projectId = assertSafeIdentifier(input?.project_id, "project_id");
  const action = input?.action;
  if (!OWNER_APPROVAL_STAGES.has(action)) {
    throw new AgentError("INVALID_APPROVAL_ACTION", "This action is not eligible for owner approval through the local gate.", {
      action,
      allowed: [...OWNER_APPROVAL_STAGES]
    });
  }
  const { project } = await getProject(context, projectId);
  if (input?.interactive !== true) {
    throw new AgentError("INTERACTIVE_APPROVAL_REQUIRED", "Owner approval can only be recorded from the local interactive CLI.", {}, 403);
  }
  if (input?.approved_by !== project.owner) {
    throw new AgentError("INVALID_APPROVER", "The approval actor does not match the project owner.", {
      expected: project.owner,
      received: input?.approved_by
    }, 403);
  }
  const expectedConfirmation = `APPROVE ${projectId} ${action}`;
  if (input?.confirmation !== expectedConfirmation) {
    throw new AgentError("INVALID_APPROVAL_CONFIRMATION", "The typed approval confirmation did not match the required phrase.", {
      expected: expectedConfirmation
    }, 403);
  }
  assertGuardiansPassed(project);
  assertPrebuildPassed(project.readiness);
  const existing = project.approvals.find((approval) => approval.action === action && approval.approved_by === project.owner && approval.status === "approved");
  if (existing) {
    return { ok: true, reused: true, operation: "record_owner_approval", approval: existing };
  }
  const approval = {
    action,
    approved_by: project.owner,
    status: "approved",
    approved_at: now(),
    channel: "interactive-local-cli",
    confirmation_sha256: createHash("sha256").update(expectedConfirmation).digest("hex")
  };
  project.approvals.push(approval);
  project.updated_at = now();
  await context.store.saveProject(project);
  return { ok: true, reused: false, operation: "record_owner_approval", approval };
}

export async function validateProject(context, projectId) {
  const { project } = await getProject(context, projectId);
  const { sources } = validateProjectShape(project);
  const readiness = project.readiness?.scores ? scorePrebuild(project.readiness.scores) : null;
  let sourceGate = "PASS";
  try {
    assertSourcesReady(sources);
  } catch {
    sourceGate = "FAIL";
  }
  return {
    ok: true,
    valid: true,
    project_id: projectId,
    source_count: sources.length,
    source_gate: sourceGate,
    readiness,
    active_stage: STAGES.find((stage) => project.stages?.[stage]?.status === "ready") ?? null,
    completed_stages: STAGES.filter((stage) => project.stages?.[stage]?.status === "completed"),
    guardian_gate: GUARDIAN_NAMES.every((name) => project.guardians?.[name]?.status === "passed"),
    approved_actions: project.approvals.filter((approval) => approval.status === "approved").map((approval) => approval.action)
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
    if (previous.project_id !== projectId || previous.stage !== stage) {
      throw new AgentError("IDEMPOTENCY_CONFLICT", "The idempotency key is already bound to a different project or stage.", {
        idempotency_key: idempotencyKey,
        existing_project_id: previous.project_id,
        existing_stage: previous.stage,
        requested_project_id: projectId,
        requested_stage: stage
      }, 409);
    }
    return { ok: true, reused: true, job: previous };
  }

  const { project } = await getProject(context, projectId);
  assertPriorStageCompleted(project, stage);
  assertStageAvailable(project, stage);
  if (STAGES.indexOf(stage) >= STAGES.indexOf("readiness")) assertSourcesReady(project.sources);
  if (GATED_STAGES.has(stage)) assertPrebuildPassed(project.readiness);
  if (stage === "export") assertGuardiansPassed(project);
  if (OWNER_APPROVAL_STAGES.has(stage)) assertApproval(project.approvals, stage, project.owner);
  const estimatedCostCents = normalizeJobCost(input.estimated_cost_cents ?? 0);
  const jobId = `job-${idempotencyKey}`;
  const dailyUsage = await reserveDailyCost(context, jobId, estimatedCostCents);

  const job = {
    schema_version: "1.0",
    job_id: jobId,
    idempotency_key: idempotencyKey,
    project_id: projectId,
    stage,
    status: "ready",
    requested_by: input.requested_by ?? "in-house-agent",
    created_at: now(),
    estimated_cost_cents: estimatedCostCents,
    daily_reserved_cost_cents: dailyUsage.reserved_cost_cents,
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
  project.stages[stage] = { status: "ready", job_id: jobId, idempotency_key: idempotencyKey, requested_at: now() };
  project.updated_at = now();
  await context.store.saveProject(project);
  return { ok: true, reused: false, job };
}

export async function completeStage(context, input) {
  assertNoSecretLikeData(input);
  const projectId = assertSafeIdentifier(input?.project_id, "project_id");
  const idempotencyKey = assertSafeIdentifier(input?.idempotency_key, "idempotency_key");
  const stage = input?.stage;
  if (!STAGES.includes(stage)) throw new AgentError("INVALID_STAGE", "Unknown stage.", { stage, allowed: STAGES });
  const job = await context.store.loadJob(idempotencyKey);
  if (!job) {
    throw new AgentError("WORK_ORDER_REQUIRED", "Stage completion requires an existing work order.", { idempotency_key: idempotencyKey }, 409);
  }
  if (job.project_id !== projectId || job.stage !== stage) {
    throw new AgentError("IDEMPOTENCY_CONFLICT", "The completion request does not match the bound work order.", {
      idempotency_key: idempotencyKey,
      job_project_id: job.project_id,
      job_stage: job.stage,
      requested_project_id: projectId,
      requested_stage: stage
    }, 409);
  }
  if (job.status === "completed") {
    return { ok: true, reused: true, job };
  }
  if (job.status !== "ready") {
    throw new AgentError("WORK_ORDER_NOT_READY", "The work order is not ready for completion.", { status: job.status }, 409);
  }

  const { project } = await getProject(context, projectId);
  assertPriorStageCompleted(project, stage);
  const stageState = project.stages?.[stage];
  if (stageState?.status !== "ready" || stageState?.job_id !== job.job_id) {
    throw new AgentError("WORK_ORDER_STATE_MISMATCH", "Project stage state does not match the completion work order.", {
      stage,
      expected_job_id: stageState?.job_id,
      received_job_id: job.job_id,
      stage_status: stageState?.status
    }, 409);
  }
  if (STAGES.indexOf(stage) >= STAGES.indexOf("readiness")) assertSourcesReady(project.sources);
  if (GATED_STAGES.has(stage)) assertPrebuildPassed(project.readiness);
  if (stage === "export") assertGuardiansPassed(project);
  if (OWNER_APPROVAL_STAGES.has(stage)) assertApproval(project.approvals, stage, project.owner);

  if (stage === "sources") {
    const sources = assertSourcesReady(input.sources);
    project.sources = sources;
    await context.store.saveSourceLedger(projectId, {
      schema_version: "1.0",
      project_id: projectId,
      sources,
      generated_at: now()
    });
  }

  const projectRoot = context.store.projectDirectory(projectId);
  const artifactMap = validateArtifactManifest(stage, input.artifacts);
  const artifactEvidence = [];
  for (const requiredPath of STAGE_OUTPUTS[stage]) {
    artifactEvidence.push(await verifyArtifact(projectRoot, requiredPath, artifactMap.get(requiredPath)));
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
    job_id: job.job_id,
    completed_at: now(),
    artifacts: artifactEvidence
  };
  project.updated_at = now();
  await context.store.saveProject(project);

  job.status = "completed";
  job.completed_at = now();
  job.artifacts = artifactEvidence;
  job.next_stage = STAGES[STAGES.indexOf(stage) + 1] ?? null;
  await context.store.saveJob(idempotencyKey, job);

  return {
    ok: true,
    reused: false,
    operation: "complete_stage",
    project_id: projectId,
    stage,
    status: "completed",
    artifacts: artifactEvidence,
    next_stage: job.next_stage
  };
}
