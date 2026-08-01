# API — The Factory as a Callable Tool
## Model-agnostic. Any agent, any harness, any model can drive the factory through this surface.

Design principle: the API speaks **contracts** (the schemas in `studio/schemas/`), not frameworks. REST today; MCP tool surface tomorrow — same payloads.

---

## 1. Endpoints

### Projects
```
POST   /v1/projects                    # create project (tenant, brief, assets, constraints)  → G0
GET    /v1/projects/{id}               # state, current stage, gate status
GET    /v1/projects/{id}/ledger        # events.jsonl — the full receipt trail
```

### Work orders (the engine)
```
POST   /v1/work-orders                 # enqueue a work order (work-order.v1.json)
GET    /v1/work-orders/{id}            # state, attempt, outputs, gate
POST   /v1/work-orders/{id}/retry      # manual retry (injects failure notes)
POST   /v1/work-orders/{id}/approve    # human gate decision (G0, G5)
```

### Manifest (canonical truth)
```
GET    /v1/projects/{id}/manifest      # current brand manifest
POST   /v1/projects/{id}/manifest/propose   # agents propose; never write directly
POST   /v1/projects/{id}/manifest/approve   # approved proposal becomes canonical (versioned)
```

### Renderings (outputs of the manifest)
```
POST   /v1/projects/{id}/render/brand-book     # KAKU 13-page HTML + print PDF
POST   /v1/projects/{id}/render/style-guide    # living tokens page
POST   /v1/projects/{id}/render/flipbook       # Emerald Tablet-class interactive publication
POST   /v1/projects/{id}/render/asset-package  # SVG/PNG/EPS/favicon suite
POST   /v1/projects/{id}/render/scroll-site    # Awwwards-stack 3D scroll world
POST   /v1/projects/{id}/render/listing        # PAULI'S PLACE listing payload
GET    /v1/projects/{id}/assets/{path}         # content-addressed asset fetch
```

### Intelligence
```
POST   /v1/context/compile             # body: role + stage + task → context-packet.v1.json
POST   /v1/route                       # body: task family + quality floor → tier + model binding (internal)
GET    /v1/evaluations/{work_order_id} # evaluation-record.v1.json
POST   /v1/guardians/run               # run a guardian pack against a stage folder
```

### Knowledge
```
GET    /v1/knowledge/darya             # font registry (personality, pairings, license status)
GET    /v1/knowledge/kaku              # 13-page sequence law
GET    /v1/knowledge/guardians         # rule packs
```

## 2. Calling pattern for external agents

```
1. POST /v1/projects            → project_id, work_order WO-...-0001 queued
2. poll GET /v1/projects/{id}   → watch stage + gate (or webhook on gate events)
3. at G5: POST .../approve      → human decision with tweak notes
4. POST .../render/*            → pull deliverables
5. POST .../render/listing      → hand to PAULI'S PLACE
```

Webhooks: `gate.reached`, `gate.failed`, `work_order.complete`, `project.delivered`.

## 3. Auth & tenancy

- API keys scoped to tenant. A key can only read its own tenant's projects and manifests.
- Studio knowledge (`/v1/knowledge/*`) is read-only and shared.
- Secrets live in the vault (Infisical-class). The API never returns them.

## 4. Idempotency & durability

- All POSTs accept `Idempotency-Key`. Retried calls return the same receipt.
- Every mutation appends to the project ledger before responding. Crash-safe resume is the orchestrator's job, not the caller's.

*API v1 — the factory's front door*
