# Change: studio-compliance-data-help-and-accessibility

## Metadata

- **change-id:** studio-compliance-data-help-and-accessibility
- **phase:** 02
- **ticket:** BKB-STUDIO-COMPLIANCE-001
- **risk-tier:** LOW
- **status:** accepted
- **accepted-at:** 2026-07-24
- **accepted-by:** GRINIONS-autonomous

## Context

The Studio HTML had `data-help` on all static buttons, but dynamically generated buttons in JS files (brand-tools, strategy-voice-tools, visual-tools, brandbook-tools, guardian-export-tools, tour) were missing `data-help` metadata and some were missing explicit `aria-label` attributes. The Phase 0 audit flagged this as a release blocker.

## Proposal

Add `data-help` and `aria-label` attributes to every dynamically generated button across all Studio JS files. Add compliance tests that verify:
1. All JS-generated buttons have `data-help`
2. All JS-generated buttons have accessible names
3. No emoji characters used as interface icons
4. Tour dialog has keyboard navigation and ARIA semantics
5. Dialog close buttons have `aria-label`
6. Focus management: tour returns focus to tour button on finish
7. Form submit buttons have `data-help`

## Scope

### Files changed

- `apps/studio/brand-tools.js` — added `data-help` + `aria-label` to: close, library-close, project-list, cancel, create, save-intake, save-discovery, resolve-source, add-source, save-scores buttons
- `apps/studio/strategy-voice-tools.js` — added `data-help` + `aria-label` to: remove-proof, add-proof, save-strategy, save-voice buttons
- `apps/studio/visual-tools.js` — added `data-help` + `aria-label` to: save-visual-system button
- `apps/studio/brandbook-tools.js` — added `data-help` + `aria-label` to: toggle-preview, close-preview, previous, next, save, section-nav, annex-nav buttons
- `apps/studio/guardian-export-tools.js` — added `data-help` + `aria-label` to: remove-finding, guardian-nav, add-finding, save-review, check-approval, download buttons
- `apps/studio/tour.js` — added `data-help` + `aria-label` to: skip, back, next buttons
- `tests/studio-compliance.test.mjs` — NEW: 7 compliance tests

## Acceptance criteria

- [x] All dynamically generated buttons have `data-help` metadata
- [x] All dynamically generated buttons have accessible names (`aria-label` or text content)
- [x] No emoji characters used as interface icons
- [x] Tour dialog has keyboard navigation (Escape, ArrowRight, ArrowLeft) and ARIA semantics (role=dialog, aria-modal, aria-labelledby)
- [x] Dialog close buttons have `aria-label`
- [x] Focus management: tour returns focus to tour button on finish
- [x] `npm run check` passes
- [x] `npm test` passes (82 tests, 80 pass, 2 skipped, 0 fail)

## Rollback

Revert the squash merge commit. All changes are additive attribute additions. See `ops/rollback/phase-02-studio-compliance.json`.
