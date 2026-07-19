# Stage 12 — Rebuild Options

Version: 1.0.0

## Objective
Turn the audit, strategy, design-system, content, and technical evidence into a clear checklist of bounded upgrade workstreams for human selection.

## Entry criteria
Current-state audit and applicable strategy/design evidence are complete enough to recommend action.

## Inputs
Brand audit, Krug/anti-slop findings, research, strategy, design-system gaps, content plan, repository analysis, constraints.

## Required references
`../../shared/work-order-contract.md`, `../../shared/evidence-contract.md`, `../../_config/approval-policy.yaml`.

## Allowed capabilities/tools
Impact/effort/risk analysis and recommendation generation. No implementation.

## Process
Group findings into independent or dependent workstreams; explain evidence, expected outcome, risk, effort, dependencies and what remains unchanged; recommend priority order; present selectable options.

## Outputs
`upgrade-options.json`, `rebuild-options.html`, dependency graph, recommended sequence.

## Acceptance criteria
Each option is scoped, evidence-backed, reversible where possible, and maps cleanly to one or more bounded tickets; no catch-all “rebuild everything” option without decomposition.

## Human decision gate
Human selects which material workstreams to authorize.

## Prohibited actions
Starting implementation, expanding scope without selection, hiding tradeoffs.

## Failure/escalation
Conflicting options/dependencies → surface one precise owner decision.

## Handoff target
Stage 13 PRD and Tickets for selected options only.

## Rollback
No production change; discard or supersede recommendation version.
