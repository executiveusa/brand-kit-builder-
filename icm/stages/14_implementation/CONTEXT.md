# Stage 14 — Implementation

Version: 1.0.0

## Objective
Implement exactly one approved ticket inside one isolated repository workspace and produce verifiable evidence.

## Entry criteria
Approved WorkOrder, repository/base SHA, file/repo allowlist, acceptance criteria, rollback and sandbox/worktree available.

## Inputs
WorkOrder, PRD/ticket, design system, required project artifacts, repository instructions/current branch state.

## Required references
`../../shared/work-order-contract.md`, `../../shared/artifact-contract.md`, repository `AGENTS.md`, applicable Krug/anti-slop rules.

## Allowed capabilities/tools
Only tools explicitly allowed by WorkOrder; repository writes limited to sandbox/worktree/file allowlist.

## Process
Snapshot baseline; inspect existing patterns; implement smallest compliant change; lint/type/test after bounded edits; create preview/evidence; run applicable rule checks; self-correct within loop limits; commit to ticket branch.

## Outputs
Code/assets, tests, preview, screenshots, diff, implementation report, artifact/evidence records, rollback proof, PR/handoff when authorized.

## Acceptance criteria
All ticket criteria pass; no unrelated changes; tests pass; visual work has screenshot evidence; design tokens/components reused; rollback available.

## Human decision gate
Irreversible action, production release, scope expansion, rights issue, or genuine product/architecture conflict.

## Prohibited actions
Direct main writes, cross-project edits, secret logging, unapproved deployment, unrelated cleanup/refactor.

## Failure/escalation
Three identical errors → halt ticket with context; failed verification → rollback/re-plan affected ticket.

## Handoff target
Stage 15 Guardians / Technical QA.

## Rollback
Discard/revert isolated branch/worktree to recorded base SHA; preserve failure report.
