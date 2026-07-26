# Change: guardian-expansion

## Metadata

- **change-id:** guardian-expansion
- **phase:** 15
- **ticket:** BKB-GUARDIAN-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The existing Guardian system needs expansion with new types for design consistency, accessibility, performance, and security. Each guardian type has specific rules, severity levels, and pass thresholds.

## Proposal

Create `src/design-system/guardian-expansion.mjs` — an expanded guardian system with:

- 4 guardian types: design_consistency, accessibility, performance, security
- 21 rules total: 5 design, 6 accessibility, 5 performance, 5 security
- Each rule: id, name, description, severity (P0/P1/P2)
- Guardian scoring: pass threshold, weight, P0/P1 failure counts
- Report generation: overall score, weighted average, blocking status
- Validation: validateGuardianType, validateRuleResult, getGuardianRules, getBlockingRules

## Scope

- `src/design-system/guardian-expansion.mjs` — NEW: 280 lines
- `tests/guardian-expansion.test.mjs` — NEW: 28 tests

## Acceptance criteria

- [x] 4 guardian types with all required fields
- [x] 21 rules total with severity levels
- [x] Weights sum to 1.0
- [x] Scoring calculates pass/fail correctly
- [x] P0 failures are blocking
- [x] Report generation includes overall score and recommendation
- [x] `npm run check` passes
- [x] `npm test` passes (534 tests, 532 pass, 2 skipped, 0 fail)
