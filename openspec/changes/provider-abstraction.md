# Change: provider-abstraction

## Metadata

- **change-id:** provider-abstraction
- **phase:** 08
- **ticket:** BKB-PROVIDER-001
- **risk-tier:** MEDIUM
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The Brand Studio needs provider-neutral interfaces for LLM, vision, image generation, vector construction, font identification, and video. No provider lock-in. Every job must track idempotency, cost, provenance, hashes, and status. Unavailable providers must be BLOCKED/OMITTED with exact reason, never faked.

## Proposal

Create `src/providers/provider-registry.mjs` — a Node.js-only provider abstraction layer with 6 provider types, job tracking, idempotency, cost guards, provenance, and fake-completion prevention.

### 6 Provider Types
- LLM
- Vision
- Image Generation
- Vector Construction
- Font Identification
- Video

### Features
- Provider registry (register, unregister, list, get)
- Job creation with idempotency key, project ID, provider type, cost estimation
- Job execution with retry logic and failure handling
- Job provenance tracking (provider, model, input hash, output hash, timestamp)
- Cost guard (enforces MAX_JOB_COST_CENTS from canonical contracts)
- Fake completion prevention (assertNoFakeCompletion blocks completed jobs without output hash or provenance)
- Omitted/blocked job states for unavailable providers
- Provider factory functions for each type
- Job store with idempotent reuse (same idempotency key returns same completed job)
- Deterministic input/output hashing (SHA-256)

## Scope

- `src/providers/provider-registry.mjs` — NEW: 300+ line provider abstraction
- `tests/provider-registry.test.mjs` — NEW: 29 tests

## Acceptance criteria

- [x] 6 provider types defined
- [x] Provider registry with register/unregister/list/get
- [x] Job creation with idempotency, project ID, cost estimation
- [x] Job execution with retry logic
- [x] Job provenance tracking (provider, model, input/output hash, timestamp)
- [x] Cost guard enforces MAX_JOB_COST_CENTS
- [x] Fake completion prevention (no completed status without output hash)
- [x] Omitted/blocked states for unavailable providers
- [x] Idempotent reuse (same key returns same completed job)
- [x] Provider factory functions for all 6 types
- [x] `npm run check` passes
- [x] `npm test` passes (253 tests, 251 pass, 2 skipped, 0 fail)
