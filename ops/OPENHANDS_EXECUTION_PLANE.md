# OpenHands execution plane for PARÉ

## Decision

Self-host the **OpenHands control/execution plane** on owner-controlled infrastructure, but do **not** keep an LLM agent continuously thinking 24/7.

The correct operating model is:

`PARÉ / One Hands -> durable work order -> queue/dispatcher -> OpenHands worker -> isolated workspace -> receipt -> Guardian -> human gate`

The service is always available. Agent compute is event-driven.

## Why

An always-running reasoning loop wastes tokens, can drift from the current work order, increases blast radius, and makes evidence/rollback harder. PARÉ already has a durable work-order contract, stage gates, retry limits and receipts. OpenHands should execute bounded work orders inside that governance rather than become the source of truth.

## Runtime split

### 1. Always-on: PARÉ

Responsibilities:

- intake and normalization
- canonical ICM project state
- workflow selection
- work-order ledger
- approval state
- provider/model routing
- Guardian/Gauntlet results
- receipts and rollback references

PARÉ owns business truth. OpenHands does not.

### 2. Always-on: OpenHands control plane

Run OpenHands/Agent Server or Agent Canvas backend on a private VM/VPS or private Docker network. This gives team-shared, always-available execution without requiring a laptop session.

The control plane may remain online 24/7. It should expose only the API/ingress needed by the PARÉ worker adapter and authorized operators.

### 3. On demand: agent workspaces

For each work order:

1. create or resume an isolated workspace/conversation
2. mount/clone only the repository or project scope required by the work order
3. inject the normalized outcome, constraints, protected items, stage and acceptance gates
4. execute the task
5. capture changed files, test evidence, logs and output receipts
6. terminate/release the workspace when complete or parked

Long-running missions may remain resumable, but they must be attached to a durable work-order id rather than a free-running conversation.

## PARÉ integration contract

PARÉ already provides `DARYA_WORKER_URL` and `DARYA_WORKER_TOKEN` as the execution boundary. Darya is the role/persona; OpenHands is the execution substrate.

Recommended request envelope:

```json
{
  "work_order_id": "WO-YYYYMMDD-NNNN",
  "tenant": "tenant-id",
  "project": "project-id",
  "stage": "20_design",
  "role": "Darya",
  "outcome": "bounded outcome",
  "constraints": [],
  "protected_items": [],
  "workspace": {
    "repository": "owner/repo",
    "ref": "branch-or-sha",
    "allowed_paths": []
  },
  "acceptance": {
    "checks": [],
    "quality_floor": 8.5
  }
}
```

Recommended response envelope:

```json
{
  "work_order_id": "WO-YYYYMMDD-NNNN",
  "state": "complete",
  "workspace_ref": "opaque-worker-reference",
  "outputs": [],
  "checks": [],
  "logs_ref": "opaque-log-reference",
  "rollback_ref": "git-sha-or-snapshot",
  "cost": {}
}
```

Secrets, provider credentials and host filesystem paths must not be returned in receipts.

## 24/7 behavior

Use the platform in three modes:

### Interactive

A human opens Agent Canvas for exceptional debugging, visual inspection or supervised missions.

### API/queue — default PARÉ path

One Hands sends a bounded work order to the worker endpoint. The worker starts/resumes an OpenHands task, waits or streams status, records evidence and returns a receipt.

### Scheduled automation

Nightly audits, dependency checks, content refreshes or maintenance are scheduler-created work orders. They are not free-running agents.

## Security boundary

- Prefer a dedicated VM/VPS or sandbox host rather than running the agent directly on the PARÉ production host.
- Use Docker/VM sandboxing for arbitrary code execution.
- Mount the minimum repository/project paths required.
- Keep the Docker socket and host credentials out of PARÉ unless strictly required by the chosen OpenHands deployment.
- Use a private network or authenticated ingress between PARÉ and OpenHands.
- Give each worker a scoped GitHub credential, not an owner-wide personal token.
- Do not expose OpenHands directly to the public internet without authentication, TLS and network restrictions.
- Preserve the G5 human gate for production publication/deployment.

## Failure model

- Three identical failures -> escalate; do not loop forever.
- Worker crash -> work order remains durable in PARÉ and can be retried/resumed.
- OpenHands unavailable -> PARÉ remains readable and canonical; execution is degraded, not data-corrupted.
- Bad deployment -> roll back OpenHands independently from PARÉ.

## Deployment topology

```text
Internet
  |
  +-- public PARÉ web / authenticated PARÉ API
          |
          +-- private work-order dispatcher
                  |
                  +-- OpenHands control plane (always on)
                          |
                          +-- ephemeral/sandboxed workspace A
                          +-- ephemeral/sandboxed workspace B
                          +-- resumable long mission C

PARÉ ICM + ledgers remain on owner-controlled durable storage.
```

## Production rule

For production, run the control plane continuously and workers on demand. "24/7 agent" means **24/7 availability and durable orchestration**, not continuous token-burning reasoning.
