# ZTE-20260715-0008 — KAKU brand-book phase

## Objective

Turn a completed visual system into a source-derived, reviewable brand book that preserves the exact 13-part KAKU sequence and all ten required digital annexes.

## Scope

- Exact 13-page KAKU core sequence
- Ten required digital annexes
- Deterministic draft assembly from confirmed project state
- Per-page content editing, source references, and human approval
- Annex inclusion and content review
- Local self-contained HTML preview in a sandboxed iframe
- Brand-book completion gate
- Guardian stage unlock only after every page and annex is complete
- English and Mexican Spanish review interface
- Guarded section and annex persistence bridge events

## Acceptance criteria

- Core sequence order cannot be changed
- Draft assembly uses project strategy, voice, visual rules, sources, and approval authority
- Draft pages are not pre-approved
- Every core page requires non-empty content and explicit approval
- Every annex requires non-empty content and inclusion
- Preview contains no scripts or remote resources
- Guardian review remains locked until all 23 items pass
- Export remains locked
- Repository validation and all tests pass

## Risk

MEDIUM. The phase adds long-form editable content and local HTML rendering but no final PDF, external provider, remote publishing, deployment, or approval bypass.

## Rollback

Close the pull request or revert Phase 2D commits. Strategy, voice, and visual project data remain compatible.
