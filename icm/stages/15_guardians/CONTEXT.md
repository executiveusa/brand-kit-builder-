# Stage 15 — Guardians and QA

Version: 1.0.0

## Objective
Independently challenge completed work before human approval/release.

## Entry criteria
Scoped implementation/design/brandbook artifacts exist with tests/evidence and creator handoff.

## Inputs
Artifacts, evidence, rule results, strategy/voice/design system, implementation report, screenshots/tests, rights/provenance.

## Required references
`../../_config/krug-rules.yaml`, `../../_config/anti-slop-rules.yaml`, `../../shared/artifact-contract.md`, governing Guardian rules.

## Allowed capabilities/tools
Read/review/test/audit tools. Guardians file findings; they do not silently fix/approve their own findings unless a separate execution work order assigns a different role.

## Process
Run Brand, Design, Voice, Rights and applicable Technical QA passes; verify evidence independently; classify P0–P3; ensure creator is not sole approver; rerun affected checks after fixes.

## Outputs
Guardian reviews, `guardian-report.json/html`, technical QA results, unresolved finding list, release readiness summary.

## Acceptance criteria
All required Guardians completed; zero P0 and unresolved P1; P2/P3 disposition explicit; no missing evidence hidden; reviewer independence recorded.

## Human decision gate
Waiver requests, subjective final direction disputes, rights exceptions, or release approval.

## Prohibited actions
Self-approval, silent waiver, changing evidence to make tests pass, claiming visual QA without screenshots.

## Failure/escalation
Blocking finding routes a bounded correction WorkOrder to the appropriate specialist, then re-review.

## Handoff target
Stage 16 Release when gates pass.

## Rollback
Reviews are immutable/versioned; supersede with a new review after correction.
