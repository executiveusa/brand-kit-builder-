# Postiz adapter boundary

## Role
Postiz is an optional external/self-hosted social publishing service used by PARÉ after brand truth and approved content already exist.

It is **not** the canonical home of brand strategy, voice, campaigns or approvals.

## Why process boundary
The current Postiz repository and Node SDK are AGPL-3.0. PARÉ does not vendor or copy the Postiz application/SDK into the Brand Studio core. The adapter talks to a separately deployed Postiz instance through its public HTTP API.

Reference API observed in the current Postiz SDK:
- `GET /public/v1/integrations`
- `GET /public/v1/posts`
- `POST /public/v1/posts`
- `DELETE /public/v1/posts/:id`
- upload exists separately at `/public/v1/upload`

Production callers must verify the installed Postiz version/API contract before rollout.

## Runtime configuration
Secrets remain runtime-only:
- `POSTIZ_BASE_URL`
- `POSTIZ_API_KEY`

Neither value belongs in ICM project folders, receipts, screenshots or portable exports.

## PARÉ workflow
`brand truth → social plan → platform adaptation → human review → approval → Postiz schedule/publish → receipt → measurement`

## Approval law
The adapter fails closed unless the work order contains:
- `approval.required = true`
- `approval.status = approved`
- non-empty `approval.evidence_ref`

## Integration targeting
A publishing payload must target explicit connected integrations/channels. One Hands must not guess a channel from display names when multiple integrations could match.

## Idempotency
PARÉ work orders and receipts carry a SHA-256 idempotency key. Before retrying an uncertain external request, reconcile provider state rather than blindly re-submitting and risking duplicate posts.

## Ownership
A client may host its own Postiz instance. Removing Pauli from the maintenance relationship must not remove access to approved brand intelligence or force a migration away from PARÉ.
