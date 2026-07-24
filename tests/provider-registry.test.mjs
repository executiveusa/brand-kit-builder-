import { test } from "node:test";
import assert from "node:assert/strict";
import {
  PROVIDER_VERSION,
  PROVIDER_TYPES,
  JOB_STATUSES,
  registerProvider,
  getProvider,
  listProviders,
  unregisterProvider,
  createProviderJob,
  hashJobInput,
  hashJobOutput,
  executeProviderJob,
  getJob,
  clearJobStore,
  createOmittedJob,
  createBlockedJob,
  assertNoFakeCompletion,
  createLLMProvider,
  createVisionProvider,
  createImageGenerationProvider,
  createVectorConstructionProvider,
  createFontIdentificationProvider,
  createVideoProvider
} from "../src/providers/provider-registry.mjs";
import { AgentError } from "../src/agent/errors.mjs";

test("provider abstraction defines 6 provider types", () => {
  assert.equal(PROVIDER_TYPES.length, 6);
  for (const type of ["llm", "vision", "image-generation", "vector-construction", "font-identification", "video"]) {
    assert.ok(PROVIDER_TYPES.includes(type), `Provider type ${type} must be defined`);
  }
});

test("job statuses include all required states", () => {
  for (const status of ["pending", "queued", "running", "completed", "failed", "blocked", "omitted"]) {
    assert.ok(JOB_STATUSES.includes(status), `Job status ${status} must be defined`);
  }
});

test("registerProvider registers a valid provider", () => {
  const result = registerProvider("llm", "test-llm", { execute: () => {} });
  assert.equal(result.registered, true);
  const provider = getProvider("llm", "test-llm");
  assert.equal(provider.name, "test-llm");
  unregisterProvider("llm", "test-llm");
});

test("registerProvider rejects invalid type", () => {
  assert.throws(() => registerProvider("invalid", "test", { execute: () => {} }), AgentError);
});

test("registerProvider rejects adapter without execute", () => {
  assert.throws(() => registerProvider("llm", "test", {}), AgentError);
});

test("getProvider throws for unregistered provider", () => {
  assert.throws(() => getProvider("llm", "nonexistent"), AgentError);
});

test("listProviders returns all registered providers", () => {
  registerProvider("llm", "test-llm-1", { execute: () => {} });
  registerProvider("vision", "test-vision-1", { execute: () => {} });
  const all = listProviders();
  assert.ok(all.length >= 2);
  const llmOnly = listProviders("llm");
  assert.ok(llmOnly.some((p) => p.name === "test-llm-1"));
  unregisterProvider("llm", "test-llm-1");
  unregisterProvider("vision", "test-vision-1");
});

test("createProviderJob creates valid job with required fields", () => {
  const job = createProviderJob({
    idempotency_key: "job-1",
    project_id: "proj-1",
    provider_type: "llm",
    provider_name: "openai",
    model: "gpt-4",
    estimated_cost_cents: 100
  });
  assert.equal(job.idempotency_key, "job-1");
  assert.equal(job.project_id, "proj-1");
  assert.equal(job.provider_type, "llm");
  assert.equal(job.status, "pending");
  assert.equal(job.estimated_cost_cents, 100);
  assert.ok(job.provenance);
  assert.ok(Array.isArray(job.evidence_ids));
});

test("createProviderJob requires idempotency_key", () => {
  assert.throws(() => createProviderJob({ project_id: "p1", provider_type: "llm" }), AgentError);
});

test("createProviderJob requires project_id", () => {
  assert.throws(() => createProviderJob({ idempotency_key: "k1", provider_type: "llm" }), AgentError);
});

test("createProviderJob rejects invalid provider type", () => {
  assert.throws(() => createProviderJob({ idempotency_key: "k1", project_id: "p1", provider_type: "invalid" }), AgentError);
});

test("createProviderJob rejects negative cost", () => {
  assert.throws(() => createProviderJob({ idempotency_key: "k1", project_id: "p1", provider_type: "llm", estimated_cost_cents: -1 }), AgentError);
});

test("createProviderJob enforces single-task cost limit", () => {
  assert.throws(() => createProviderJob({ idempotency_key: "k1", project_id: "p1", provider_type: "llm", estimated_cost_cents: 1001 }), AgentError);
});

test("hashJobInput produces deterministic hash", () => {
  const h1 = hashJobInput({ prompt: "test", model: "gpt-4" });
  const h2 = hashJobInput({ prompt: "test", model: "gpt-4" });
  assert.equal(h1, h2);
  assert.equal(h1.length, 64);
});

test("hashJobOutput produces deterministic hash", () => {
  const h1 = hashJobOutput({ text: "result" });
  const h2 = hashJobOutput({ text: "result" });
  assert.equal(h1, h2);
});

test("hashJobOutput handles null", () => {
  assert.equal(hashJobOutput(null), null);
});

test("executeProviderJob completes with registered provider", async () => {
  clearJobStore();
  registerProvider("llm", "test-exec-llm", {
    execute: async (input) => ({ output: { text: `Hello ${input.name}` }, cost_cents: 50, model: "test-model" })
  });
  const job = createProviderJob({
    idempotency_key: "exec-1",
    project_id: "proj-1",
    provider_type: "llm",
    provider_name: "test-exec-llm",
    estimated_cost_cents: 100
  });
  const result = await executeProviderJob(job, { name: "World" });
  assert.equal(result.reused, false);
  assert.equal(result.job.status, "completed");
  assert.equal(result.job.output.text, "Hello World");
  assert.equal(result.job.actual_cost_cents, 50);
  assert.ok(result.job.output_hash);
  assert.ok(result.job.provenance.timestamp);
  unregisterProvider("llm", "test-exec-llm");
});

test("executeProviderJob reuses completed job", async () => {
  clearJobStore();
  registerProvider("llm", "test-reuse-llm", {
    execute: async () => ({ output: { text: "result" }, cost_cents: 50 })
  });
  const job = createProviderJob({
    idempotency_key: "reuse-1",
    project_id: "proj-1",
    provider_type: "llm",
    provider_name: "test-reuse-llm",
    estimated_cost_cents: 100
  });
  await executeProviderJob(job, {});
  const result2 = await executeProviderJob(job, {});
  assert.equal(result2.reused, true);
  unregisterProvider("llm", "test-reuse-llm");
});

test("executeProviderJob blocks when no provider specified", async () => {
  clearJobStore();
  const job = createProviderJob({
    idempotency_key: "no-prov-1",
    project_id: "proj-1",
    provider_type: "llm",
    estimated_cost_cents: 100
  });
  const result = await executeProviderJob(job, {});
  assert.equal(result.job.status, "blocked");
  assert.equal(result.job.error.code, "NO_PROVIDER");
});

test("executeProviderJob blocks when provider not found", async () => {
  clearJobStore();
  const job = createProviderJob({
    idempotency_key: "not-found-1",
    project_id: "proj-1",
    provider_type: "llm",
    provider_name: "nonexistent",
    estimated_cost_cents: 100
  });
  const result = await executeProviderJob(job, {});
  assert.equal(result.job.status, "blocked");
});

test("executeProviderJob fails after max retries", async () => {
  clearJobStore();
  registerProvider("llm", "test-fail-llm", {
    execute: async () => { throw new Error("Always fails"); }
  });
  const job = createProviderJob({
    idempotency_key: "fail-1",
    project_id: "proj-1",
    provider_type: "llm",
    provider_name: "test-fail-llm",
    estimated_cost_cents: 100,
    max_retries: 0
  });
  let threw = false;
  try {
    await executeProviderJob(job, {});
  } catch (error) {
    threw = true;
    assert.ok(error instanceof AgentError, "Should throw AgentError");
  }
  assert.equal(threw, true, "executeProviderJob should throw when retries exhausted");
  const stored = getJob("fail-1");
  assert.equal(stored.status, "failed");
  assert.ok(stored.error.retries_exhausted);
  unregisterProvider("llm", "test-fail-llm");
});

test("createOmittedJob creates job with omitted status", () => {
  const job = createOmittedJob({
    idempotency_key: "omit-1",
    project_id: "proj-1",
    provider_type: "llm",
    reason: "Provider unavailable"
  });
  assert.equal(job.status, "omitted");
  assert.equal(job.error.code, "PROVIDER_UNAVAILABLE");
});

test("createBlockedJob creates job with blocked status", () => {
  const job = createBlockedJob({
    idempotency_key: "block-1",
    project_id: "proj-1",
    provider_type: "llm",
    reason: "Cost limit exceeded"
  });
  assert.equal(job.status, "blocked");
});

test("assertNoFakeCompletion blocks completed job without output hash", () => {
  const job = createProviderJob({ idempotency_key: "fake-1", project_id: "p1", provider_type: "llm" });
  job.status = "completed";
  job.output_hash = null;
  assert.throws(() => assertNoFakeCompletion(job), AgentError);
});

test("assertNoFakeCompletion blocks completed job without provenance timestamp", () => {
  const job = createProviderJob({ idempotency_key: "fake-2", project_id: "p1", provider_type: "llm" });
  job.status = "completed";
  job.output_hash = "abc123";
  job.provenance.timestamp = null;
  assert.throws(() => assertNoFakeCompletion(job), AgentError);
});

test("assertNoFakeCompletion passes valid completed job", () => {
  const job = createProviderJob({ idempotency_key: "ok-1", project_id: "p1", provider_type: "llm" });
  job.status = "completed";
  job.output_hash = "abc123";
  job.provenance.timestamp = new Date().toISOString();
  assert.equal(assertNoFakeCompletion(job), true);
});

test("provider factory functions create correct types", () => {
  const llm = createLLMProvider("test", () => {});
  assert.equal(llm.type, "llm");
  const vision = createVisionProvider("test", () => {});
  assert.equal(vision.type, "vision");
  const image = createImageGenerationProvider("test", () => {});
  assert.equal(image.type, "image-generation");
  const vector = createVectorConstructionProvider("test", () => {});
  assert.equal(vector.type, "vector-construction");
  const font = createFontIdentificationProvider("test", () => {});
  assert.equal(font.type, "font-identification");
  const video = createVideoProvider("test", () => {});
  assert.equal(video.type, "video");
});

test("unregistered provider returns false", () => {
  assert.equal(unregisterProvider("llm", "nonexistent"), false);
});

test("job provenance tracks provider, model, input hash, output hash, timestamp", async () => {
  clearJobStore();
  registerProvider("llm", "test-prov-llm", {
    execute: async (input) => ({ output: { text: "result" }, cost_cents: 50, model: "test-model-v1" })
  });
  const inputHash = hashJobInput({ prompt: "test" });
  const job = createProviderJob({
    idempotency_key: "prov-1",
    project_id: "proj-1",
    provider_type: "llm",
    provider_name: "test-prov-llm",
    model: "test-model-v1",
    estimated_cost_cents: 100,
    input_hash: inputHash,
    prompt_version: "1.0"
  });
  await executeProviderJob(job, { prompt: "test" });
  assert.equal(job.provenance.provider, "test-prov-llm");
  assert.equal(job.provenance.model, "test-model-v1");
  assert.equal(job.provenance.input_hash, inputHash);
  assert.ok(job.provenance.output_hash);
  assert.ok(job.provenance.timestamp);
  unregisterProvider("llm", "test-prov-llm");
});
