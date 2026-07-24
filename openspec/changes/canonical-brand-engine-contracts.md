# Change: canonical-brand-engine-contracts

## Metadata

- **change-id:** canonical-brand-engine-contracts
- **phase:** 01
- **ticket:** BKB-CONTRACT-001
- **risk-tier:** MEDIUM
- **status:** accepted
- **accepted-at:** 2026-07-24
- **accepted-by:** GRINIONS-autonomous

## Context

The repository had duplicated domain constants and business logic between `apps/studio/project-store.js` (browser) and `src/agent/constants.mjs` (Node.js). The Studio used different axis IDs (e.g., `offer_conversion_clarity`) than the agent core (e.g., `offer_and_conversion_clarity`), requiring a fragile `AXIS_MAP` translation layer in `studio-sync.mjs`. Version strings, guardian names, trust levels, classifications, and cost limits were defined independently in each layer.

## Proposal

Create ONE canonical contracts module at `apps/studio/contracts.js` accessible by both browser and Node.js. All adapters (Studio, CLI, MCP, future SDK) consume shared contracts from this single source of truth.

### Canonical objects defined

- BrandProject (factory: `createBrandProjectShell`)
- EvidenceRecord (factory: `createEvidenceRecord`)
- WorkOrder (factory: `createWorkOrder`)
- GuardianReview (factory: `createGuardianReview`)
- Approval (factory: `createApproval`)
- Artifact (factory: `createArtifact`)
- CapabilityDescriptor (factory: `createCapabilityDescriptor`)

### Canonical constants defined

- `CANONICAL_VERSION` (0.3.0) — single version source
- `STAGES` (9 stages)
- `STAGE_OUTPUTS` (required artifacts per stage)
- `GATED_STAGES` (stages requiring readiness gate)
- `OWNER_APPROVAL_STAGES` (stages requiring owner approval)
- `PREBUILD_AXES` (20 axes with bilingual labels and critical flags)
- `CRITICAL_PREBUILD_AXES` (5 critical axes)
- `GUARDIAN_NAMES` (4 guardians)
- `SOURCE_TRUST_LEVELS` (4 trust levels)
- `PROJECT_CLASSIFICATIONS` (7 classifications)
- `CAPABILITY_DESCRIPTOR` (capability registry)
- `STUDIO_AXIS_ALIASES` (backward-compatible old→canonical axis ID map)
- Cost limits, release floor, schema versions

### Duplication removed

- `src/agent/constants.mjs` now re-exports from `contracts.js` (no local definitions)
- `apps/studio/project-store.js` imports STAGES and PREBUILD_AXES from `contracts.js`
- `src/agent/orchestrator.mjs` imports GUARDIAN_NAMES, SOURCE_TRUST_LEVELS, PROJECT_CLASSIFICATIONS, cost limits from canonical
- `src/agent/studio-sync.mjs` imports STUDIO_AXIS_ALIASES from `contracts.js` (removed local AXIS_MAP)

### Backward compatibility

- `STUDIO_AXIS_ALIASES` maps old Studio axis IDs to canonical IDs
- `project-store.js` `migrateReadinessScores()` migrates old stored scores on load
- `studio-sync.mjs` `normalizeReadiness()` accepts both canonical and old axis IDs

## Scope

### Files changed

- `apps/studio/contracts.js` — NEW canonical contracts module
- `src/agent/constants.mjs` — now re-exports from contracts.js
- `src/agent/orchestrator.mjs` — imports from canonical, removed local duplicates
- `src/agent/studio-sync.mjs` — imports STUDIO_AXIS_ALIASES from contracts, accepts both axis ID formats
- `apps/studio/project-store.js` — imports from contracts.js, canonical axis IDs, migration layer
- `scripts/validate-studio.mjs` — added contracts.js to file list
- `tests/contracts.test.mjs` — NEW canonical contracts parity tests (20 tests)

## Acceptance criteria

- [x] One canonical contract module defines all domain objects, stages, axes, guardians
- [x] Agent core re-exports canonical constants (no local definitions)
- [x] Studio imports canonical constants (no local definitions)
- [x] Backward compatibility: old stored projects with old axis IDs migrate correctly
- [x] `npm run check` passes (version parity + studio validation)
- [x] `npm test` passes (75 tests, 73 pass, 2 skipped, 0 fail)
- [x] Canonical contracts parity tests verify cross-layer consistency
- [x] No stored projects broken (migration layer handles old axis IDs)

## Rollback

Revert the squash merge commit. The migration layer is additive — old stored projects remain readable. See `ops/rollback/phase-01-canonical-brand-engine-contracts.json`.
