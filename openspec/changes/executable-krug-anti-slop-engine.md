# Change: executable-krug-anti-slop-engine

## Metadata

- **change-id:** executable-krug-anti-slop-engine
- **phase:** 03
- **ticket:** BKB-RULES-001
- **risk-tier:** MEDIUM
- **status:** accepted
- **accepted-at:** 2026-07-24
- **accepted-by:** GRINIONS-autonomous

## Context

Steve Krug usability principles and anti-slop rules existed as YAML configuration files in `icm/_config/` but had no executable implementation. The GRINIONS plan requires deterministic, machine-checkable gates that produce structured results with rule_id, severity, evidence, remediation, score impact, and waiver handling.

## Proposal

Create `apps/studio/rules-engine.js` — a deterministic rule framework accessible by both browser and Node.js (following the `contracts.js` pattern). The engine evaluates "design surface" objects and produces structured rule results.

### Krug rules implemented (9)

- KRUG-CLARITY-001 — purpose/audience/next action immediately understandable
- KRUG-CTA-001 — one dominant primary action
- KRUG-SCAN-001 — headings/labels/grouping support scanning
- KRUG-HIER-001 — visual hierarchy matches information priority
- KRUG-CLICK-001 — interactive elements recognizable without hover
- KRUG-NAV-001 — navigation and current location obvious
- KRUG-LOCATION-001 — current location visibly indicated
- KRUG-RECOVERY-001 — users can exit modals/forms/dead ends
- KRUG-MOBILE-001 — primary workflow complete on mobile

### Anti-slop rules implemented (10)

- SLOP-CLAIM-001 (P0) — no fabricated/unverified metrics/testimonials/awards
- SLOP-HERO-001 — hero must be brand-specific
- SLOP-CARD-001 — no unnecessary nested card shells
- SLOP-BENTO-001 — bento layouts need IA justification
- SLOP-METRIC-001 — metric cards require real evidence
- SLOP-ICON-001 — no emoji icons, one icon family
- SLOP-MOTION-001 — motion must support understanding
- SLOP-COPY-001 — copy must be brand-specific (detects "Transform your business" etc.)
- SLOP-PLACEHOLDER-001 (P0) — no placeholder data as real
- SLOP-AI-DEFAULT-001 — no generic AI patterns without rationale

### Features

- 4 statuses: PASS, WARN, BLOCK, NOT_APPLICABLE
- Structured results with all required fields (rule_id, rule_version, severity, evidence, affected_surface, confidence, remediation, score_impact, reviewer, waiver, evaluated_at)
- Evidence requirement enforcement (non-NOT_APPLICABLE results must provide required evidence)
- Score caps for P0/P1 slop rules (6.5 for claims/placeholders, 7.0 for AI defaults)
- Waiver system with human-only approval (agent self-waiver prohibited)
- Summary function with gate logic (P0 blocks, unresolved P1 blocks)
- Deterministic evaluation (same input → same output)

## Scope

### Files changed

- `apps/studio/rules-engine.js` — NEW: 500+ line deterministic rules engine
- `scripts/validate-studio.mjs` — added rules-engine.js to file list
- `tests/rules-engine.test.mjs` — NEW: 39 tests covering all rules, waivers, score caps, determinism

## Acceptance criteria

- [x] 9 Krug rules implemented with deterministic evaluation
- [x] 10 anti-slop rules implemented with deterministic evaluation
- [x] 12 anti-slop categories defined
- [x] 4 statuses (PASS/WARN/BLOCK/NOT_APPLICABLE) enforced
- [x] Evidence requirement enforced (throws on missing evidence)
- [x] Waiver system with human-only approval (agent self-waiver prohibited)
- [x] Score caps for P0/P1 slop rules (6.5, 7.0)
- [x] Summary gate logic (P0 blocks, P1 blocks)
- [x] Deterministic: same input produces same output
- [x] `npm run check` passes
- [x] `npm test` passes (121 tests, 119 pass, 2 skipped, 0 fail)

## Rollback

Revert the squash merge commit. Engine is additive — no existing behavior changed. See `ops/rollback/phase-03-krug-anti-slop-engine.json`.
