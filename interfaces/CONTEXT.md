# Interfaces context

This folder contains **doors into the same Pauli Brand Studio contracts**. Interfaces do not own brand truth and must not create parallel business logic.

## Canonical edge runtime
`runtime/src/normalize.mjs` is the transport-neutral normalization layer. REST, MCP, CLI, folder-drop, Popebot and local callers must pass through it before work-order intake.

Canonical request schema: `_shared/interface-request.v1.schema.json`.

## Routes
- `rest/API.md` — HTTP contract for projects, work orders, manifests, renderings, guardians and knowledge.
- `runtime/` — executable normalization and equivalence tests for all doors.
- `mcp/` — MCP transport may map tool arguments into `fromMcp`.
- `cli/` — local command arguments map through `fromCli`.
- `folder-drop/` — filesystem request documents map through `fromFolderDrop`.
- `popebot/` — conversation turns map through `fromPopebot`; Popebot remains receptionist/session UI only.
- local/agent runtimes map through `fromLocal`.

## Invariants
- Same semantic request → same normalized payload and SHA-256 idempotency key, regardless of transport.
- Transport authentication/session/provider fields are discarded before canonical work intake.
- Adapters cannot choose provider/model policy or mutate brand truth.
- Durable `work_order_id` is assigned by the work-order/factory layer, never invented by a transport.
- Receipts are transport-neutral and bind to the canonical idempotency key.

## Proof
`runtime/tests/equivalence.test.mjs` proves six-door equivalence, stable idempotency, rejection of missing tenant/project/outcome, transport-field stripping and transport-neutral receipts. CI: `.github/workflows/brand-studio-interfaces.yml`.

## Law
Every interface normalizes requests into the same work-order/context/receipt contracts under `../studio/_system/`. Interface-specific state is transport/session state only. Canonical brand intelligence remains in approved ICM project files and manifests.
