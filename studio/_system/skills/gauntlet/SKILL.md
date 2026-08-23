# Design Gauntlet Skill

Purpose: force independent, evidence-backed comparison against explicit quality bars before delivery.

## Loop
`builder → separate fresh critic → direct comparison → one biggest gap → builder`

No praise requirement. No arbitrary round-count exit. Stop only when the work beats the defined comparison bar, the release gate fails closed, or the owner stops the loop.

## Required judges
- strategy
- taste
- usability
- accessibility
- rights/provenance
- responsive behavior

## Method
1. Name a fetchable/comparable bar for the slice under review.
2. Judge from fresh context; do not reuse the builder as critic.
3. Compare the actual artifact, not intentions or descriptions.
4. Record evidence for each score and blocker.
5. Return the single largest gap to the owning ICM stage.
6. Builder repairs only that bounded gap plus any hard blockers.
7. Re-run the affected judges and final gate.

## Release rule
Averages cannot hide a failed hard gate. Required thresholds come from `studio/_system/governance/DESIGN_STANDARD.json`.

## Output
Write the scorecard, comparison evidence, verdict, biggest gap, owning repair stage, and rerun result into `30_validate/` and `_ledger/evaluations/` as directed by the work order.
