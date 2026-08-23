# MCP adapter context

Status: **local stdio runtime implemented on `feat/icm-design-factory-skills-gauntlet`.**

This adapter exposes the Pauli Design Factory through MCP while preserving the same transport-neutral request contracts used by REST, CLI, folder-drop, Popebot and local callers.

## Run

```bash
node interfaces/mcp/server.mjs
```

Hermes/mcp2cli can bake it with:

```bash
mcp2cli bake create brand-studio \
  --mcp-stdio "node $PAULI_BRAND_STUDIO_ROOT/interfaces/mcp/server.mjs" \
  --description "Pauli Design Factory — ICM design workflows, normalization and reference factory" \
  --force
```

`PAULI_BRAND_STUDIO_ROOT` must point to a checkout of `executiveusa/brand-kit-builder-` containing this runtime. No secret is stored in the repository.

## Tools

- `design_factory_capabilities` — cold-start/walk-test discovery: stages, gates, skills and available transports.
- `design_factory_normalize` — normalize any agent request into the canonical `interface-request.v1` contract and idempotency key.
- `design_factory_run_reference` — execute the deterministic local reference factory through G4 and stop at G5 human approval. It proves wiring and ICM state transitions; it does not pretend reference output is finished strategy or design.

## Law
- Normalize MCP tool calls through `interfaces/runtime/src/normalize.mjs` before work-order intake.
- Do not duplicate business logic from the factory.
- Canonical brand truth remains in approved ICM files/manifests, never the transport.
- Tenant and approval boundaries must match REST/local surfaces.
- Builders may not self-approve.
- No publishing or irreversible action is exposed by this MCP adapter.
- Do not claim the REST deployment is live merely because its contract exists; REST runtime/deployment verification is separate.

## Verification

```bash
cd interfaces/mcp
npm test
```

Tests verify MCP initialization, tool discovery, canonical request normalization, and cold-agent capability routing.
