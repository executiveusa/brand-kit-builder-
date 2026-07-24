# Stage 04 — Reputation

Version: 1.0.0

## Objective
Build an evidence-backed picture of public reputation and recurring customer/community themes.

## Entry criteria
Public identity resolved enough to avoid mixing entities.

## Inputs
Project identity, public research, known locations/products/services.

## Required references
`../../_config/research-policy.yaml`, `../../shared/evidence-contract.md`.

## Allowed capabilities/tools
Public review/search/browser adapters; bounded text analysis.

## Process
Collect attributable public review/reputation sources; record rating/count only when directly observed and dated; cluster repeated praise/problems/questions; distinguish source coverage from population truth.

## Outputs
`reputation-report.json`, theme matrix, EvidenceRecords, coverage/limitations.

## Acceptance criteria
No invented reviews; each theme links to evidence; duplicates handled; negative evidence retained; dates/platforms recorded.

## Human decision gate
Claims with material legal/reputation implications or entity ambiguity.

## Prohibited actions
Fake reviews, private data collection, selective deletion to improve score.

## Failure/escalation
Insufficient coverage → mark low confidence, never fill gaps with model guesses.

## Handoff target
Brand DNA, Analyzer, Strategy.

## Rollback
Remove failed-run derived summaries; keep source/audit history.
