# Agent Handoff Contract

Every in-house agent stage must leave a machine-readable handoff that another agent can resume without reading chat history.

## Required handoff fields

```json
{
  "project_id": "project-id",
  "stage": "strategy",
  "status": "completed",
  "source_ledger": "projects/project-id/source-ledger.json",
  "inputs_read": [],
  "artifacts_written": [],
  "tests_run": [],
  "scores": {},
  "claims_added": [],
  "claims_rejected": [],
  "guardian_findings": [],
  "decisions": [],
  "assumptions": [],
  "risks": [],
  "next_stage": "voice",
  "next_agent_instruction": "Request a voice work order with a new idempotency key."
}
```

## Rules

- Record only sources actually read.
- Separate confirmed facts from inference.
- Do not mark an artifact complete unless it exists inside the project workspace.
- Do not hide rejected claims or guardian findings.
- Do not place secrets, credentials, private client data, or approval tokens in the handoff.
- Use stable project-relative paths.
- Every assumption must state how it can be verified.
- The next agent must call `brand_kit_validate_project` before continuing.
