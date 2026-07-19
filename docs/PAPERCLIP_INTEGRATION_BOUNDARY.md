# Paperclip Integration Boundary

Status: Phase 0 contract

## 1. Decision

Paperclip is the preferred **replaceable workforce/control-plane adapter** for the Pauli Brand Studio company model.

It is not the Brand Engine, canonical project database, design-system compiler, source of brand truth, Guardian authority, or release authority.

The Brand Studio must continue to function when Paperclip is stopped or replaced.

## 2. Responsibilities

### Pauli Brand Studio owns

- BrandProject lifecycle and version;
- source ledger/evidence graph;
- research results and verification state;
- design decisions;
- readiness/rule scores;
- strategy/voice/visual/design-system state;
- logo and asset manifests;
- work-order domain contract;
- artifact/provenance manifests;
- Guardian findings;
- human approvals;
- releases/exports/rollback metadata.

### Paperclip owns or mirrors

- company/org-chart representation;
- agent identities, roles, reporting lines, status;
- goals/project planning views;
- issues/tasks and dependencies;
- atomic task checkout/ownership;
- heartbeat/schedule/routine execution;
- budgets and operational cost visibility;
- workspace/runtime/previews links;
- activity/event presentation;
- approval-request presentation and routing;
- manager dashboards.

### Hermes owns as Studio Director

- translate owner goals into bounded workstreams;
- create/route work orders through the Brand Engine/control plane;
- assign specialist agents;
- monitor heartbeats, budget, dependencies and blockers;
- reconcile fan-out/fan-in stages;
- surface decisions requiring human attention;
- report progress and evidence.

Hermes never owns release approval.

## 3. Mapping model

| Brand Studio canonical object | Paperclip representation | Authority |
|---|---|---|
| BrandProject | company project / external reference | Brand Studio |
| WorkOrder | issue/task | Brand Studio contract; Paperclip assignment/status mirror |
| AgentAssignment | agent + reporting relation | reconciled; permissions governed by Brand Studio capability policy |
| ResearchRun | child issue/activity | Brand Studio |
| Artifact | attachment/link/artifact reference | Brand Studio |
| DesignDecision | issue decision/approval note reference | Brand Studio |
| GuardianReview | QA/review issue + result reference | Brand Studio |
| Approval request | approval workflow/card | request may be displayed by Paperclip; approval record stays Brand Studio |
| Release | release/project milestone | Brand Studio |
| RepoWorkspace | workspace/runtime reference | shared mapping; repository state remains external/canonical in Git |

Every mirrored object stores both IDs:

```json
{
  "brand_studio_id": "...",
  "paperclip_id": "...",
  "mapping_version": "1.0",
  "last_synced_at": "...",
  "last_synced_event_id": "..."
}
```

## 4. Integration pattern

```text
Owner / Studio UI
       │
       ▼
Hermes / Paperclip manager view
       │ assignments, status, budget
       ▼
PaperclipAdapter
       │ authenticated typed calls/events
       ▼
Brand Engine
       │ canonical work orders/state
       ├── Research/Design workers
       ├── Sandboxed repo workspaces
       └── Guardians
```

The adapter must be idempotent and event-driven where practical.

## 5. Required adapter capabilities

Phase implementation should expose functions equivalent to:

```text
ensureCompanyMapping()
ensureAgentMapping()
createOrSyncProject()
createOrSyncWorkOrder()
claimWorkOrder()
reportHeartbeat()
reportProgress()
attachArtifactReference()
reportBlocker()
requestHumanDecision()
recordExternalStatus()
reconcileEvents()
```

It must not expose a function equivalent to:

```text
approveReleaseAsAgent()
bypassGuardian()
writeCanonicalProjectJsonDirectly()
mergeMain()
deployProductionWithoutGate()
```

## 6. Event contract

Brand Studio events should be transport-neutral:

```text
project.created
project.updated
work_order.created
work_order.claimed
work_order.progress
work_order.blocked
work_order.completed
research.completed
evidence.conflict_detected
decision.required
decision.recorded
artifact.created
artifact.validated
guardian.finding_created
guardian.passed
approval.requested
approval.recorded
release.ready
release.created
release.rolled_back
```

Paperclip consumes only events it needs and may emit operational events through the adapter. Replaying an event must not duplicate work orders or approvals.

## 7. Agent identity and permissions

Each mapped employee has:

- stable Brand Studio agent ID;
- role/capability allowlist;
- manager ID;
- permitted project IDs;
- permitted repositories;
- cost limits;
- tool permissions;
- work-order scope;
- escalation target.

Roles are not permissions by themselves. Permission is explicit and scoped per assignment.

## 8. Human approval boundary

Paperclip may display an approval request and collect a human decision only after an approved human-authentication adapter exists.

Until then:
- Paperclip shows `AWAITING HUMAN`;
- canonical approval remains recorded through the current local interactive boundary or later cryptographic human adapter;
- an agent-created Paperclip status/comment is never equivalent to owner approval.

There is never a generic remote `POST /approve` endpoint callable by agents.

## 9. Hermes integration modes

The donor Paperclip system includes Hermes local/gateway adapter concepts. Pauli supports two future modes:

### Hermes local

Use when Hermes and Brand Studio run on the same trusted machine/workspace.

Preferred transport:
- MCP/CLI/SDK to Brand Engine;
- local Paperclip adapter for workforce metadata.

### Hermes gateway

Use when Hermes is remote or centrally hosted.

Preferred transport:
- authenticated Brand Studio HTTP API;
- Paperclip gateway control-plane connection;
- narrow scoped credentials.

Both modes produce the same canonical Brand Studio objects.

## 10. Failure isolation

Paperclip unavailable:
- work orders remain in Brand Studio;
- CLI/MCP/SDK/HTTP continue to operate as available;
- sync resumes from event cursor later.

Paperclip duplicate event:
- idempotency key prevents duplicate canonical mutation.

Paperclip agent compromised:
- capability allowlist limits scope;
- cannot manufacture approval;
- cannot access unrelated project/repo without explicit assignment.

Brand Engine unavailable:
- Paperclip may show cached status only;
- no queued action is represented as completed until canonical engine acknowledges it.

## 11. No-lock-in requirements

PASS requires:

- no Brand Studio domain schema imports Paperclip database models;
- no canonical project requires a Paperclip ID to load;
- no artifact is stored only in Paperclip;
- all mapping can be reconstructed from canonical IDs/events;
- control plane is behind an integration interface;
- disabling adapter is configuration, not a migration.

## 12. First Paperclip implementation ticket

`BKB-PAPERCLIP-001` begins only after `BKB-CONTRACT-001` provides stable WorkOrder, event, artifact, identity, and capability contracts.

The first adapter should prove one narrow flow:

```text
BrandProject
→ mapped Paperclip project
→ one WorkOrder becomes an issue
→ one specialist claims it
→ progress/heartbeat visible
→ artifact reference returns
→ Brand Engine completes work order
→ Paperclip status reconciles
```

Do not begin by synchronizing every feature in both systems.
