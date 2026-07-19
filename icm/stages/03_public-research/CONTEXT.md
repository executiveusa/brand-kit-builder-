# Stage 03 — Public Research

Version: 1.0.0

## Objective
Collect public, cited external evidence about the brand/company/category without fabricating certainty.

## Entry criteria
BrandProject exists; research scope and budget are bounded.

## Inputs
Project identity, URLs/names, site census, owner-confirmed facts.

## Required references
`../../_config/research-policy.yaml`, `../../_config/source-precedence.yaml`, `../../shared/evidence-contract.md`.

## Allowed capabilities/tools
Public web/search/browser adapters with bounded parallel fan-out.

## Process
Search company facts, public profiles, news, interviews, directories, category/industry sources and relevant public mentions; capture source URL/date/context; deduplicate; separate observations/inferences; retain conflicts.

## Outputs
Research-run record, EvidenceRecords, coverage report, unresolved conflicts, research summary.

## Acceptance criteria
Every conclusion references evidence; confidence/verification states present; inaccessible sources explicit; no private-profile scraping; cost/fan-out within WorkOrder.

## Human decision gate
High-impact unresolved company/ownership/claim conflict.

## Prohibited actions
Auth bypass, private LinkedIn scraping, fake citations, copying unsupported search snippets as verified fact.

## Failure/escalation
Provider/search failure is isolated and recorded; three identical failures halt that adapter.

## Handoff target
Evidence Analyst, Reputation/Social/Competitor specialists.

## Rollback
Invalidate/remove only evidence produced by the failed run while preserving audit history.
