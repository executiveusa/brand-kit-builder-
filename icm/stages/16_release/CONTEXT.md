# Stage 16 — Release and Handoff

Version: 1.0.0

## Objective
Package only validated, approved artifacts into a client-owned release and perform only explicitly authorized repository/deployment actions.

## Entry criteria
Required Guardians pass; no P0/unresolved P1; readiness/release score gates pass; canonical human approval exists and matches current evidence/version.

## Inputs
Approved artifacts, package manifest candidates, Guardian summaries, approval record, rollback data, target repository/delivery instructions.

## Required references
`../../_config/approval-policy.yaml`, `../../shared/artifact-contract.md`, `../../shared/agent-handoff-contract.md`.

## Allowed capabilities/tools
Export/package/hash/signature/render adapters; Git/PR/deployment only when the WorkOrder and human gates authorize them.

## Process
Revalidate approval freshness; build canonical manifest; verify every included file/hash/status/provenance; record explicit omissions; create client-owned ZIP/handoff; open PR or approved release action when scoped; verify result and rollback readiness.

## Outputs
Release record, package manifest, export ZIP, handoff HTML/MD, acceptance matrix, rollback instructions, PR/deployment references when applicable.

## Acceptance criteria
No phantom artifacts; all included hashes verify; omissions explicit; approval matches current evidence; release is reproducible/traceable; client ownership and maintenance instructions present.

## Human decision gate
Release approval and any production deploy/merge required by governing policy.

## Prohibited actions
Agent self-approval, silent production deployment, direct main write, claiming omitted output complete.

## Failure/escalation
Any post-approval material change invalidates/stales affected approval and returns to review; failed release verification triggers rollback.

## Handoff target
Owner/client and operations/maintenance workflow.

## Rollback
Use recorded release/repository/deployment rollback; never destroy prior approved release lineage.
