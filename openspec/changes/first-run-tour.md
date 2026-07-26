# Change: first-run-tour

## Metadata

- **change-id:** first-run-tour
- **phase:** 18
- **ticket:** BKB-TOUR-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24

## Context

The studio needs a first-run tour that guides new users through key features. The tour must be skippable, keyboard-operated, persistent after completion, and restartable.

## Proposal

Create `src/design-system/first-run-tour.mjs` — a first-run tour system with:

- 7 tour steps: welcome, dashboard, create-project, analysis, design-system, export, complete
- Each step: target selector, position, bilingual title/description, data-help, aria-label
- Tour state management: pending → active → completed/skipped/restarted
- Keyboard navigation: ArrowRight/Enter (next), ArrowLeft (back), Escape (skip)
- 8 accessibility requirements: keyboard nav, focus trap, aria-live, skip button, escape dismiss, persistent, restartable, visible labels

## Scope

- `src/design-system/first-run-tour.mjs` — NEW: 280 lines
- `tests/first-run-tour.test.mjs` — NEW: 32 tests

## Acceptance criteria

- [x] 7 tour steps with bilingual content
- [x] Tour state: pending, active, completed, skipped, restarted
- [x] Keyboard navigation with shortcuts
- [x] 8 accessibility requirements
- [x] Tour is skippable, restartable, persistent
- [x] `npm run check` passes
- [x] `npm test` passes (625 tests, 623 pass, 2 skipped, 0 fail)
