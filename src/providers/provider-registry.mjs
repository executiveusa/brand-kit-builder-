import { createHash } from "node:crypto";
import { AgentError } from "../agent/errors.mjs";
import { MAX_JOB_COST_CENTS, MAX_DAILY_COST_CENTS } from "../../apps/studio/contracts.js";

export const PROVIDER_VERSION = "1.0.0";

export const PROVIDER_TYPES = [
  "llm",
  "vision",
  "image-generation",
  "vector-construction",
  "font-identification",
  "video"
];

export const JOB_STATUSES = [
  "pending",
  "queued",
  "running",
  "completed",
  "failed",
  "blocked",
  "omitted"
];

export const PROVIDER_REGISTRY = new Map();

export function registerProvider(type, name, adapter) {
  if (!PROVIDER_TYPES.includes(type)) {
    throw new AgentError("INVALID_PROVIDER_TYPE", "Unknown provider type.", { type, allowed: PROVIDER_TYPES });
  }
  if (!name || typeof name !== "string") {
    throw new AgentError("INVALID_PROVIDER_NAME", "Provider name must be a non-empty string.");
  }
  if (!adapter || typeof adapter.execute !== "function") {
    throw new AgentError("INVALID_PROVIDER_ADAPTER", "Adapter must have an execute function.");
  }
  if (!PROVIDER_REGISTRY.has(type)) PROVIDER_REGISTRY.set(type, new Map());
  PROVIDER_REGISTRY.get(type).set(name, { type, name, adapter, registered_at: new Date().toISOString() });
  return { type, name, registered: true };
}

export function getProvider(type, name) {
  const typeProviders = PROVIDER_REGISTRY.get(type);
  if (!typeProviders || !typeProviders.has(name)) {
    throw new AgentError("PROVIDER_NOT_FOUND", "Provider is not registered.", { type, name });
  }
  return typeProviders.get(name);
}

export function listProviders(type) {
  if (type) {
    const typeProviders = PROVIDER_REGISTRY.get(type);
    if (!typeProviders) return [];
    return [...typeProviders.values()].map(({ type, name, registered_at }) => ({ type, name, registered_at }));
  }
  const all = [];
  for (const typeProviders of PROVIDER_REGISTRY.values()) {
    for (const { type, name, registered_at } of typeProviders.values()) {
      all.push({ type, name, registered_at });
    }
  }
  return all;
}

export function unregisterProvider(type, name) {
  const typeProviders = PROVIDER_REGISTRY.get(type);
  if (!typeProviders || !typeProviders.has(name)) return false;
  typeProviders.delete(name);
  return true;
}

export function createProviderJob(input = {}) {
  if (!input.idempotency_key) {
    throw new AgentError("MISSING_IDEMPOTENCY_KEY", "Provider job requires an idempotency_key.");
  }
  if (!input.project_id) {
    throw new AgentError("MISSING_PROJECT_ID", "Provider job requires a project_id.");
  }
  if (!PROVIDER_TYPES.includes(input.provider_type)) {
    throw new AgentError("INVALID_PROVIDER_TYPE", "Unknown provider type.", { received: input.provider_type, allowed: PROVIDER_TYPES });
  }
  const estimatedCost = Number(input.estimated_cost_cents || 0);
  if (!Number.isFinite(estimatedCost) || estimatedCost < 0) {
    throw new AgentError("INVALID_COST", "estimated_cost_cents must be a non-negative number.");
  }
  if (estimatedCost > MAX_JOB_COST_CENTS) {
    throw new AgentError("COST_GUARD", "Job exceeds the single-task cost limit.", { estimated_cost_cents: estimatedCost, maximum: MAX_JOB_COST_CENTS }, 403);
  }
  return {
    schema_version: "1.0",
    job_version: PROVIDER_VERSION,
    job_id: `provider-job-${input.idempotency_key}`,
    idempotency_key: input.idempotency_key,
    project_id: input.project_id,
    provider_type: input.provider_type,
    provider_name: input.provider_name || null,
    model: input.model || null,
    status: "pending",
    requested_by: input.requested_by || "in-house-agent",
    created_at: new Date().toISOString(),
    started_at: null,
    completed_at: null,
    estimated_cost_cents: estimatedCost,
    actual_cost_cents: null,
    evidence_ids: Array.isArray(input.evidence_ids) ? input.evidence_ids : [],
    input_hash: input.input_hash || null,
    output_hash: null,
    output: null,
    error: null,
    retries: 0,
    max_retries: input.max_retries != null ? Number(input.max_retries) : 2,
    provenance: {
      provider: input.provider_name || null,
      model: input.model || null,
      prompt_version: input.prompt_version || null,
      input_hash: input.input_hash || null,
      output_hash: null,
      timestamp: null
    }
  };
}

export function hashJobInput(input) {
  const canonical = JSON.stringify(input, Object.keys(input).sort());
  return createHash("sha256").update(canonical).digest("hex");
}

export function hashJobOutput(output) {
  if (output == null) return null;
  const serialized = typeof output === "string" ? output : JSON.stringify(output);
  return createHash("sha256").update(serialized).digest("hex");
}

const jobStore = new Map();

export async function executeProviderJob(job, input, options = {}) {
  if (!job || !job.idempotency_key) {
    throw new AgentError("INVALID_JOB", "Job must have an idempotency_key.");
  }
  const existing = jobStore.get(job.idempotency_key);
  if (existing && existing.status === "completed") {
    return { reused: true, job: existing };
  }
  if (job.status === "completed") {
    return { reused: true, job };
  }
  const providerName = job.provider_name || options.default_provider;
  if (!providerName) {
    job.status = "blocked";
    job.error = { code: "NO_PROVIDER", message: "No provider specified and no default available." };
    jobStore.set(job.idempotency_key, job);
    return { reused: false, job };
  }
  let provider;
  try {
    provider = getProvider(job.provider_type, providerName);
  } catch (error) {
    job.status = "blocked";
    job.error = { code: error.code, message: error.message };
    jobStore.set(job.idempotency_key, job);
    return { reused: false, job };
  }
  job.status = "running";
  job.started_at = new Date().toISOString();
  job.provider_name = providerName;
  jobStore.set(job.idempotency_key, job);
  try {
    const result = await provider.adapter.execute(input, { job });
    const outputHash = hashJobOutput(result.output);
    job.status = "completed";
    job.completed_at = new Date().toISOString();
    job.output = result.output;
    job.output_hash = outputHash;
    job.actual_cost_cents = Number(result.cost_cents || job.estimated_cost_cents || 0);
    job.provenance.output_hash = outputHash;
    job.provenance.provider = providerName;
    job.provenance.model = result.model || job.model;
    job.provenance.timestamp = job.completed_at;
    jobStore.set(job.idempotency_key, job);
    return { reused: false, job };
  } catch (error) {
    job.retries += 1;
    if (job.retries <= job.max_retries) {
      job.status = "pending";
      job.error = { code: "EXECUTION_ERROR", message: error.message || String(error), retry: job.retries };
    } else {
      job.status = "failed";
      job.error = { code: "EXECUTION_ERROR", message: error.message || String(error), retries_exhausted: true };
    }
    jobStore.set(job.idempotency_key, job);
    if (job.status === "failed") {
      throw new AgentError("PROVIDER_EXECUTION_FAILED", "Provider job failed after retries.", { idempotency_key: job.idempotency_key, error: job.error });
    }
    return { reused: false, job, retry: job.retries };
  }
}

export function getJob(idempotencyKey) {
  return jobStore.get(idempotencyKey) || null;
}

export function clearJobStore() {
  jobStore.clear();
}

export function createOmittedJob(input = {}) {
  const job = createProviderJob(input);
  job.status = "omitted";
  job.error = { code: "PROVIDER_UNAVAILABLE", message: input.reason || "Provider unavailable. Job omitted." };
  return job;
}

export function createBlockedJob(input = {}) {
  const job = createProviderJob(input);
  job.status = "blocked";
  job.error = { code: input.blocked_reason || "BLOCKED", message: input.reason || "Job blocked." };
  return job;
}

export function assertNoFakeCompletion(job) {
  if (job.status === "completed" && !job.output_hash) {
    throw new AgentError("FAKE_COMPLETION", "Job marked completed without output hash. Never fake completion.", { idempotency_key: job.idempotency_key });
  }
  if (job.status === "completed" && !job.provenance.timestamp) {
    throw new AgentError("FAKE_COMPLETION", "Job marked completed without provenance timestamp.", { idempotency_key: job.idempotency_key });
  }
  return true;
}

export function createLLMProvider(name, executeFn) {
  return {
    type: "llm",
    name,
    adapter: { execute: executeFn }
  };
}

export function createVisionProvider(name, executeFn) {
  return {
    type: "vision",
    name,
    adapter: { execute: executeFn }
  };
}

export function createImageGenerationProvider(name, executeFn) {
  return {
    type: "image-generation",
    name,
    adapter: { execute: executeFn }
  };
}

export function createVectorConstructionProvider(name, executeFn) {
  return {
    type: "vector-construction",
    name,
    adapter: { execute: executeFn }
  };
}

export function createFontIdentificationProvider(name, executeFn) {
  return {
    type: "font-identification",
    name,
    adapter: { execute: executeFn }
  };
}

export function createVideoProvider(name, executeFn) {
  return {
    type: "video",
    name,
    adapter: { execute: executeFn }
  };
}
