# Stage 07 — Brand DNA and Evidence Reconciliation

Version: 1.0.0

## Objective
Merge source/site/research/reputation/social/competitor evidence into one editable current-state brand model and readiness input.

## Entry criteria
Required upstream research work orders completed or explicitly marked unavailable/not applicable.

## Inputs
Evidence graph, source ledger, site census, reputation/social/category outputs, owner-confirmed facts.

## Required references
`../../_config/source-precedence.yaml`, `../../shared/evidence-contract.md`, `../../shared/domain-objects.md`.

## Allowed capabilities/tools
Evidence normalization/deduplication, conflict analysis, canonical Brand Engine use cases.

## Process
Separate confirmed facts, observations, inferences and unknowns; reconcile duplicates; retain contradictions; summarize identity/audience/offer/proof/category/reputation/voice/visual clues; calculate coverage and readiness inputs.

## Outputs
`brand-dna.json`, `confidence-matrix.json`, conflict list, confirmed-facts list, inference list, readiness evidence map.

## Acceptance criteria
Every non-owner fact traces to evidence; conflicts remain visible; no inference silently promoted; readiness axes cite supporting evidence or missing gaps.

## Human decision gate
Material unresolved conflict that blocks downstream strategy/rights/identity decisions.

## Prohibited actions
Inventing missing proof, approving hypotheses, creating design assets.

## Failure/escalation
Coverage insufficient → route to targeted research/discovery rather than filler.

## Handoff target
Stage 08 audit and Stage 09 strategy/discovery readiness.

## Rollback
Restore previous Brand DNA version; evidence records remain immutable.
