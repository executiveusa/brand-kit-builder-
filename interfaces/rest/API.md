# PARÉ REST API
## One Hands callable surface — self-hostable, transport-neutral, truth-first

PARÉ speaks ICM contracts. REST, MCP, CLI, folder-drop and local callers must normalize into the same request/work-order/receipt semantics rather than creating transport-specific business logic.

## Status legend
- **LIVE IN REPO** — executable in `interfaces/rest/server.mjs` and covered by tests.
- **CONTRACT / FUTURE** — design contract retained for later implementation; do not represent it as live runtime capability.

---

## 1. Live executable endpoints

### Health
```text
GET /health
```
Public liveness only. It does not expose client data or operational state.

### Capabilities / workflows
```text
GET /v1/capabilities
GET /v1/workflows
```
Returns the canonical workflow registry surfaced through One Hands.

### Request normalization
```text
POST /v1/normalize     # legacy interface-request.v1 compatibility
POST /v2/normalize     # interface-request.v2 workflow-aware normalization
```
Provider/model/auth fields do not enter canonical request truth.

### One Hands planning
```text
POST /v2/plan
```
Compiles an outcome into a `one-hands-preflight.v1` plan and `work-order.v2` set. Planning does not execute creative work, publish social content or deploy production.

### Work-order validation
```text
POST /v2/work-orders/validate
```
Validates core v2 semantics and sensitive-action approval requirements.

### Postiz adapter
```text
GET  /v1/postiz/integrations
POST /v1/postiz/schedule
```
Available only when `POSTIZ_BASE_URL` and `POSTIZ_API_KEY` are runtime-configured.

`/v1/postiz/schedule` requires an approved sensitive work order with recorded approval evidence before any provider request is made.

### Darya / OpenHands worker adapter
```text
POST /v1/darya/dispatch
```
Available only when `DARYA_WORKER_URL` is runtime-configured. PARÉ sends a bounded `pare-worker.v1` payload to the configured worker endpoint. Darya is an execution worker; it does not own brand truth.

---

## 2. Authentication boundary

All `/v1/*` and `/v2/*` routes require authentication.

Production/self-host mode:
```text
PARE_API_TOKEN=<owner-managed secret>
```
Clients send:
```text
Authorization: Bearer <token>
```

Development-only loopback mode may explicitly set:
```text
PARE_ALLOW_INSECURE_LOCAL=true
```
The executable server refuses insecure local mode on a non-loopback bind.

Secrets never belong in ICM project folders, manifests, receipts, screenshots or portable exports.

## 3. Runtime configuration names

```text
HOST
PORT
PAULI_BRAND_STUDIO_ROOT
PARE_API_TOKEN
PARE_ALLOW_INSECURE_LOCAL
DARYA_WORKER_URL
DARYA_WORKER_TOKEN
POSTIZ_BASE_URL
POSTIZ_API_KEY
```

These are names/contracts only. Secret values are supplied by the owner at runtime.

## 4. Idempotency

`interface-request.v2` produces a SHA-256 semantic idempotency key from canonical request fields. Transport credentials and provider/session fields are excluded.

Before retrying an uncertain external publish request, reconcile provider state rather than blindly re-submitting.

## 5. Ownership model

The API is designed for a company-owned installation:
- owner controls domain/runtime/credentials;
- canonical brand intelligence remains portable ICM files/manifests;
- Postiz and Darya may be separately self-hosted services;
- Pauli maintenance is optional, not a technical requirement for continued ownership.

---

## 6. Contract/future surface — NOT YET LIVE

The architecture still reserves these routes/capabilities, but callers must not assume they exist until executable runtime + tests are added.

### Projects
```text
POST   /v1/projects
GET    /v1/projects/{id}
GET    /v1/projects/{id}/ledger
```

### Durable work-order queue / human decisions
```text
POST   /v1/work-orders
GET    /v1/work-orders/{id}
POST   /v1/work-orders/{id}/retry
POST   /v1/work-orders/{id}/approve
```

### Canonical manifest proposals
```text
GET    /v1/projects/{id}/manifest
POST   /v1/projects/{id}/manifest/propose
POST   /v1/projects/{id}/manifest/approve
```

### Renderings
```text
POST   /v1/projects/{id}/render/brand-book
POST   /v1/projects/{id}/render/style-guide
POST   /v1/projects/{id}/render/flipbook
POST   /v1/projects/{id}/render/asset-package
GET    /v1/projects/{id}/assets/{path}
```

### Intelligence / guardian APIs
```text
POST   /v1/context/compile
POST   /v1/route
GET    /v1/evaluations/{work_order_id}
POST   /v1/guardians/run
```

### Shared knowledge
```text
GET /v1/knowledge/darya
GET /v1/knowledge/kaku
GET /v1/knowledge/guardians
```

## 7. External action law
Planning, build and preview are not publication.

Social schedule/publish, client installation and production promotion must fail closed without the required recorded approval. A successful HTTP response is evidence only for the named call; it does not make the overall project `Done` or `Production`.
