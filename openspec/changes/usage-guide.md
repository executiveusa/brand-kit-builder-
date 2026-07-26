# Change: usage-guide

## Metadata

- **change-id:** usage-guide
- **phase:** 20
- **ticket:** BKB-GUIDE-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The studio needs a contextual help system with usage guide, onboarding checklist, tooltips, and keyboard shortcuts for new and existing users.

## Proposal

Create `src/guide/usage-guide.mjs` — a contextual help system with:

- 7 guide topics with bilingual content
- 8 tooltips with bilingual content
- 6-item onboarding checklist with completion tracking
- 6 keyboard shortcuts with bilingual labels
- Guide state management: open/close topics, complete checklist items, dismiss tooltips
- Completion percentage calculator
- Validation for guide topics, state, and translations

## Scope

- `src/guide/usage-guide.mjs` — NEW: 310 lines
- `tests/usage-guide.test.mjs` — NEW: 25 tests

## Acceptance criteria

- [x] 7 guide topics with bilingual content
- [x] 8 tooltips with bilingual content
- [x] 6-item onboarding checklist
- [x] 6 keyboard shortcuts
- [x] Guide state management
- [x] Completion percentage tracking
- [x] `npm run check` passes
- [x] `npm test` passes (671 tests, 669 pass, 2 skipped, 0 fail)
