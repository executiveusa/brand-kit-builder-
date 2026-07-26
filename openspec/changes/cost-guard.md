# Change: cost-guard

## Metadata

- **change-id:** cost-guard
- **phase:** 21
- **ticket:** BKB-COST-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The studio needs a cost and budget guard to enforce spending limits across providers, analyses, and exports. Prevents overages at daily, monthly, and per-project levels.

## Proposal

Create `src/budget/cost-guard.mjs` — a cost and budget guard system with:

- Cost limits: analysis (3), generation (3), export (2), daily, monthly, per-project
- Provider rates: 6 providers (OpenAI GPT-4, GPT-3.5, Claude, DALL-E 3, Stable Diffusion, local)
- Cost estimation for providers and operations
- Budget state: daily, monthly, per-project tracking
- Transaction recording with validation
- Budget checking (canAfford, getRemainingBudget)
- Day/month reset logic
- Validation for budget state and cost limits

## Scope

- `src/budget/cost-guard.mjs` — NEW: 240 lines
- `tests/cost-guard.test.mjs` — NEW: 24 tests

## Acceptance criteria

- [x] 8 cost limit categories
- [x] 6 provider rate tables
- [x] Cost estimation for providers and operations
- [x] Transaction recording with budget enforcement
- [x] Day/month reset logic
- [x] `npm run check` passes
- [x] `npm test` passes (695 tests, 693 pass, 2 skipped, 0 fail)
