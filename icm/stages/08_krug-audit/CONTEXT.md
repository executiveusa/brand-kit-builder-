# Stage 08 — Krug / Anti-Slop Audit

Version: 1.0.0

## Objective
Evaluate current digital surfaces against executable usability, anti-slop, accessibility and design-system evidence before recommending rebuild work.

## Entry criteria
Site census/evidence exists for digital surfaces being scored.

## Inputs
Screenshots, semantic DOM/interaction inventory, navigation/routes, forms/states, Brand DNA/evidence.

## Required references
`../../_config/krug-rules.yaml`, `../../_config/anti-slop-rules.yaml`, `../../shared/evidence-contract.md`.

## Allowed capabilities/tools
Rule engine, screenshot/DOM analysis, accessibility/performance adapters when available.

## Process
Run applicable rules; collect evidence; trunk-test major pages; score categories separately; record PASS/WARN/BLOCK/P0–P3; distinguish automated vs heuristic vs human-only checks.

## Outputs
`brand-audit.json`, `audit.html`, rule results, category scorecard, prioritized findings.

## Acceptance criteria
No unexplained aggregate score; each failure has rule ID/evidence/remediation/scope; missing evidence explicit; unresolved P0/P1 visible.

## Human decision gate
Scoped waiver or disagreement on high-impact heuristic finding.

## Prohibited actions
Automatic redesign, self-waiving blockers, scoring evidence that was never captured.

## Failure/escalation
Missing required capture → block affected rule or request targeted census evidence.

## Handoff target
Strategy, Design System, Rebuild Options.

## Rollback
Rule results are versioned; supersede with rerun rather than erase history.
