# Universal interface runtime

This package is the transport-neutral front edge of Pauli Brand Studio.

## Law
Every door converts its transport payload into `interface-request.v1` before any factory routing. Adapters may carry authentication/session/transport metadata, but that metadata cannot change tenant, project, outcome, attachments, protected items, constraints, approval need, or idempotency semantics.

## Doors
- REST → `fromRest`
- MCP → `fromMcp`
- CLI → `fromCli`
- folder drop → `fromFolderDrop`
- Popebot → `fromPopebot`
- local agent/runtime → `fromLocal`

All return exactly the same canonical shape for the same semantic request.

## Popebot boundary
Popebot remains the receptionist. Its application adapter may expose `startSession`, `sendTurn`, `getJob`, `cancel`, and `respondToGate`, but `sendTurn` must normalize through `fromPopebot` and hand the result to the same work-order intake used by every other door. Popebot does not own manifests, brand truth, routing policy, provider choice, or approval law.

## Durability
The normalizer computes a SHA-256 semantic idempotency key. Transport retries with the same meaning therefore bind to the same durable work intent. The actual durable `work_order_id` is assigned by the factory/cloud work-order layer, not by the transport.
