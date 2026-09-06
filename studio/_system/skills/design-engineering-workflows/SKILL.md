---
name: design-engineering-workflows
description: Built-in design-chat workflow router for engineering work. Routes audit, reference lock, brownfield rescue, greenfield interface, and visual QA through ADHD Elegant Simplicity, Refero Design, and the existing PARÉ proof/engineering gates.
---

# Design Engineering Workflows

## Role
This is the design-chat router. It selects the smallest workflow and specialist skills. Do not expose a workflow-builder UI by default; let the human state an outcome or select a built-in workflow.

## Built-in workflows

### audit-and-cut.v1 — Audit + Cut
For an existing interface that feels confusing, generic, bloated, or inconsistent.
1. Record current state and screenshots/evidence.
2. Identify primary user outcome and action.
3. Mark P0–P3 issues.
4. Run the subtraction loop.
5. Separate product truth from decorative/duplicated UI.
6. Produce the smallest repair specification.

### reference-lock.v1 — Reference Lock
Before a major redesign or new visual language.
1. Build the smallest useful brief.
2. Research 3–5 directions.
3. Compare strong references.
4. Choose one dominant foundation.
5. Borrow only narrow secondary details.
6. Lock typography, color roles, spacing, surface, imagery, motion, and interaction rules.
7. Record rejected traits.

### brownfield-rescue.v1 — Brownfield Rescue
For improving an existing product/screen.
1. Inspect repository rules and architecture.
2. Record baseline, blast radius, and rollback.
3. Run Audit + Cut.
4. Run Reference Lock only where the current system lacks a valid target.
5. Specify one verifiable repair slice.
6. Implement the smallest isolated change.
7. Render/test responsive, accessibility, loading/error/empty states as applicable.
8. Compare against the lock/current system.
9. Run independent proof gates.

### greenfield-interface.v1 — Greenfield Interface
For a new screen, flow, feature surface, landing page, or product shell.
1. Validate user, problem, trigger, outcome, smallest valuable scope, primary action, risky assumptions, ownership, proof, and commercial value.
2. Research references.
3. For high-visibility work, create three meaningfully different reference-locked directions and require human selection before expensive build.
4. Specify hierarchy, interaction, states, responsive behavior, accessibility, tokens, and proof.
5. Build one verifiable slice.
6. Run visual QA and independent proof.

### visual-qa.v1 — Visual QA
After implementation or when checking a claimed-complete interface.
1. Capture rendered evidence at required breakpoints.
2. Compare to the lock/current design system.
3. Check hierarchy, spacing, typography, color roles, responsive ordering, overflow, touch targets, focus, keyboard, reduced motion, loading/error/empty states, and content truth.
4. Rank P0–P3.
5. Repair authorized P0/P1/P2 issues.
6. Re-render and re-check.
7. Report truthful status.

## Routing
- Existing system → `brownfield-rescue.v1`.
- Small visual fix with concrete source → direct build inside brownfield rescue; do not force three concepts.
- New high-visibility surface → `greenfield-interface.v1` + `reference-lock.v1`.
- Critique only → `audit-and-cut.v1`; do not mutate.
- "Make it look better" → inspect product truth and reference-lock before material styling changes.
- Consequential publishing/deploy/deletion/permissions remain human-gated.

## Required skill pairing
- All workflows: `adhd-elegant-simplicity`.
- Material visual decisions: `refero-design`.
- Engineering changes: existing `subtraction` + `completion-gates`.
- Release candidate: `design-guardian` + `gauntlet` + `design-proof`.

## Status
DESIGNED → IMPLEMENTED → TESTED → READY FOR PREVIEW → PREVIEW VERIFIED → PRODUCTION VERIFIED.
