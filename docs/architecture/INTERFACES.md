# Interface contract — one studio, many doors

## Principle
Human UI, REST, MCP, CLI, Popebot, folder drop, local agent, and cloud agent are **adapters** over the same work-order/context/receipt contracts. None may invent its own workflow semantics.

## Canonical request

```json
{
  "request_id": "REQ-...",
  "tenant_id": "...",
  "project_id": "...",
  "actor": { "type": "human|agent|service", "id": "..." },
  "outcome": "Create a launch-ready Instagram system from the approved brand",
  "inputs": [],
  "constraints": [],
  "locale": "en",
  "channel": "web|rest|mcp|cli|folder|local|cloud",
  "approval_policy": "project-default"
}
```

The router resolves the outcome into a stage-valid work order. It must not expose tool/framework details unless they matter to the user.

## Canonical response

```json
{
  "request_id": "REQ-...",
  "project_id": "...",
  "normalized_outcome": "...",
  "status": "needs_context|planned|working|approval_required|complete|failed",
  "message": "plain-language status",
  "missing_context": [],
  "proposed_actions": [],
  "gate": null,
  "evidence": [],
  "artifacts": [],
  "receipt": "_ledger/events.jsonl#..."
}
```

## Human web / Popebot surface
The Popebot pattern is adapted as the **conversation front door**, not blindly transplanted as the business engine.

Default experience:
1. Human states an outcome in normal language.
2. Studio loads current project context and capability map.
3. Studio asks only unresolved questions.
4. Studio shows consequential plan/gates, not internal agent chatter.
5. Studio performs permitted work.
6. Human sees proof, artifacts, decisions that need them, and recovery options.

Primary web objects:
- outcome composer;
- active project identity;
- "needs your decision" queue;
- proof/artifact viewer;
- recent work receipts;
- portable export control;
- optional advanced drawer for models/providers/interfaces.

Never lead with model pickers, workflow builders, API selectors, agent rosters, or configuration walls.

## REST
Existing `studio/API.md` remains the current v1 intent. During migration it becomes the REST adapter contract.

Minimum endpoints:
- projects
- work orders
- manifest proposals/approvals
- renderings
- context compilation
- guardian runs
- evaluations

All mutations require idempotency and emit receipts.

## MCP
MCP tools map 1:1 onto contract operations rather than exposing filesystem internals.

Proposed first tools:
```text
studio.project.open
studio.project.status
studio.outcome.submit
studio.work_order.get
studio.approval.respond
studio.artifact.list
studio.artifact.get
studio.context.compile
studio.portable.export
```

MCP resources may expose read-only project/manifest/artifact views according to tenant policy.

## CLI
Proposed command family:

```text
pauli-studio open <project>
pauli-studio ask "<outcome>"
pauli-studio status
pauli-studio approve <gate> --decision approve|reject
pauli-studio artifacts
pauli-studio export --portable
pauli-studio serve
```

CLI must work locally against a project pack. `serve` may add local HTTP/MCP surfaces.

## Folder drop
For the simplest agent-to-agent/local automation path:

```text
inbox/
  REQ-<id>.json
outbox/
  REQ-<id>.response.json
```

A watcher validates requests, creates work orders, and writes responses/receipts. Files are claimed atomically and idempotently.

## Local/USB
A portable agent mounts a project pack, reads `AGENTS.md` and the current stage contract, then uses the same local work-order library. Network adapters are optional.

## Cloud
Cloud workers resolve jobs from operational state, mount/sync the required ICM packet, execute in a sandbox, emit evidence, and propose file/manifest changes. They may not bypass human/guardian gates.

## Supabase role
Proposed cloud tables are operational only:
- `brand_studio_tenants`
- `brand_studio_memberships`
- `brand_studio_projects`
- `brand_studio_sessions`
- `brand_studio_work_orders`
- `brand_studio_approvals`
- `brand_studio_artifact_index`
- `brand_studio_sync_state`
- `brand_studio_activity`

Every tenant-scoped table requires RLS. No secret values. No editable shadow copy of the canonical brand manifest.

## Vercel role
- host the human web interface;
- provide preview deployments per branch/PR;
- host lightweight authenticated API adapters where appropriate;
- never be the sole place canonical intelligence exists.

## Status truth
Each surfaced capability must be labeled one of:
- `LIVE_VERIFIED`
- `CONNECTED_UNVERIFIED`
- `PROTOTYPE`
- `PLANNED`
- `BLOCKED`

A route/button existing is insufficient for `LIVE_VERIFIED`.
