# Work Order Contract

Version: 1.0.0-draft

A WorkOrder is the only normal unit of autonomous execution.

## Required fields

```yaml
work_order_id: ""
project_id: ""
stage: ""
capability: ""
objective: "one exact outcome"
assigned_role: ""
assigned_agent_id: ""
dependencies: []
inputs: []
required_references: []
allowed_tools: []
allowed_repositories: []
allowed_files_or_paths: []
expected_outputs: []
acceptance_criteria: []
verification_commands: []
evidence_required: []
prohibited_actions: []
budget:
  estimated_cost_cents: 0
  maximum_cost_cents: 0
idempotency_key: ""
human_gate: null
rollback: ""
status: pending
```

## Laws

1. One work order has one exact objective.
2. Implementation work is isolated to one worktree/sandbox unless a multi-service plan explicitly allows otherwise.
3. Inputs are immutable references or versioned snapshots for the duration of execution.
4. Scope expansion creates a new work order; it does not silently widen the current one.
5. Completion requires all expected outputs and acceptance evidence.
6. A work order cannot create its own human approval.
7. Same idempotency key cannot represent another objective/project/stage.
8. Cost, secret, loop, blast-radius, rights and irreversibility circuit breakers override normal continuation.
9. Failure retains evidence and rollback state.
10. Handoff is explicit and machine-readable.

## Statuses

```text
pending
ready
claimed
in_progress
awaiting_human
blocked
failed
completed
cancelled
rolled_back
```

## Completion result

```json
{
  "work_order_id": "...",
  "status": "completed",
  "outputs": [],
  "artifact_ids": [],
  "evidence_ids": [],
  "rule_results": [],
  "tests": [],
  "findings": [],
  "decisions": [],
  "handoff_to": [],
  "rollback_state": "available"
}
```

An orchestrator may retry a failed execution only within the governing retry/circuit-breaker rules.
