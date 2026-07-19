# Agent Handoff Contract

Version: 1.0.0-draft

A handoff transfers verified work product and explicit decisions, not hidden chain-of-thought.

## Required handoff

```yaml
handoff_id: ""
project_id: ""
work_order_id: ""
from_agent_id: ""
from_role: ""
to_role_or_agent: ""
objective_completed: ""
status: "completed | blocked | awaiting_human | failed"
authoritative_outputs: []
artifact_ids: []
evidence_ids: []
decisions:
  - decision_id: ""
    summary: ""
unresolved_conflicts: []
assumptions: []
findings: []
acceptance_criteria_satisfied: []
next_required_action: ""
rollback: ""
created_at: ""
```

## Laws

- Receiving agents validate referenced artifacts/evidence instead of trusting prose.
- Assumptions are labeled; they are not upgraded to facts by repetition.
- Blocking findings are never hidden to make a handoff look complete.
- File/repo/URL references include versions/hashes when available.
- Handoff cannot create human approval.
- Scope changes create a new WorkOrder.
- No secrets, credentials, cookies, private keys, or raw auth material in handoff artifacts.

## Human-readable companion

When the handoff represents a major design/release decision, create an HTML/Studio review surface with:
- what changed;
- why;
- evidence;
- before/after or alternatives where relevant;
- blockers;
- exact decision requested;
- rollback.
