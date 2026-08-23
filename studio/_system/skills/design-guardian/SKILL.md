# Design Guardian Skill

Purpose: run the canonical design-quality review before Gauntlet validation.

## Inputs
Approved strategy/manifest, current design outputs, applicable guardian packs, `DESIGN_STANDARD.json`, DARYA typography references, provenance records.

## Review order
1. Strategy fidelity — design expresses the approved positioning and governing idea.
2. Taste — reject generic, derivative, decorative, or trend-stacked work.
3. Krug usability — purpose, hierarchy, action clarity, recovery, scanability.
4. Anti-slop — enforce every release blocker in `GUARDIANS.md`.
5. Accessibility/responsive — keyboard, contrast, mobile, reduced motion, readable line lengths.
6. Rights/provenance — fonts, imagery, claims, and source material are licensed/traceable.

## Rules
- Guardian is independent of the creator.
- Guardian judges; it does not silently repair.
- Any hard blocker fails the review regardless of average score.
- Return the smallest actionable repair packet: one biggest gap first, then blocking evidence.
- Do not approve below the machine-readable thresholds in `studio/_system/governance/DESIGN_STANDARD.json`.

## Output
Write a guardian report and PASS/FAIL verdict into the assigned `30_validate/guardian-reports/` location.
