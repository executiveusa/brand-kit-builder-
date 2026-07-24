# Stage 01 — Intake

Version: 1.0.0

## Objective
Create or reconcile the BrandProject scope without inventing facts.

## Entry criteria
A bounded intake WorkOrder and at least one explicit input mode: idea, URL, repository, logo, image, documents, ZIP, existing kit, or mixed.

## Inputs
Owner goal, supplied sources/assets, languages/market, approval authority, constraints.

## Required references
`../../_config/source-precedence.yaml`, `../../_config/approval-policy.yaml`, `../../shared/work-order-contract.md`.

## Allowed capabilities/tools
Project creation/read, source registration, file metadata inspection. No creative generation.

## Process
Classify project; register inputs; lock protected assets; record owner/approval authority; identify missing source access; create initial workstream scope.

## Outputs
Project record, intake artifact, initial source ledger entries, protected-item list, unresolved decisions.

## Acceptance criteria
No fabricated facts; every supplied input recorded; approval authority explicit; protected assets identified; project classification justified.

## Evidence required
Source filenames/URLs/repo refs and owner-provided facts.

## Human decision gate
Only when project identity/ownership/scope materially conflicts.

## Prohibited actions
Design generation, source-access claims without inspection, approval creation, public release.

## Failure/escalation
Missing mandatory identity/ownership facts → `awaiting_human`; secret exposure → hard stop.

## Handoff target
Stage 02 for URLs/sites, repository analysis in parallel when supplied, then research/source acquisition.

## Rollback
Delete only the unapproved draft project record created by this WorkOrder or restore prior version.
