# In-house Agent API

Brand Kit Builder exposes two local, provider-neutral interfaces:

1. `brand-kit-builder` — JSON CLI for scripts, shell agents, CI, and one-shot workers.
2. `brand-kit-builder-mcp` — MCP over stdio for agent runtimes that support tool discovery.

Neither interface opens a network port, calls an external model, sends telemetry, or accepts credentials in job payloads.

## Runtime

- Node.js 20 or newer
- No npm runtime dependencies
- Workspace defaults to the current directory
- All state is stored beneath the workspace:

```text
.brand-kit-builder/
  jobs/
  usage/
projects/
  <project-id>/
```

## CLI

Inspect capabilities:

```bash
node bin/brand-kit-builder.mjs inspect
```

Create a project:

```bash
node bin/brand-kit-builder.mjs create-project \
  --workspace ./workspace \
  --input examples/agent/create-project.json
```

Create an idempotent stage work order:

```bash
node bin/brand-kit-builder.mjs run-stage \
  --workspace ./workspace \
  --input examples/agent/run-stage.json
```

Read project state:

```bash
node bin/brand-kit-builder.mjs get-project \
  --workspace ./workspace \
  --project-id kupuri-media-demo
```

Every success is JSON on stdout. Every failure is JSON on stderr with a stable error code.

## MCP

Start the local stdio server:

```bash
BKB_WORKSPACE=/absolute/path/to/workspace npm run mcp
```

Example MCP configuration:

```json
{
  "mcpServers": {
    "brand-kit-builder": {
      "command": "node",
      "args": ["/absolute/path/brand-kit-builder-/bin/brand-kit-builder-mcp.mjs"],
      "env": {
        "BKB_WORKSPACE": "/absolute/path/to/workspace"
      }
    }
  }
}
```

Exposed tools:

- `brand_kit_inspect`
- `brand_kit_score_prebuild`
- `brand_kit_create_project`
- `brand_kit_get_project`
- `brand_kit_validate_project`
- `brand_kit_run_stage`
- `brand_kit_complete_stage`

## Required stage order

```text
intake
→ sources
→ readiness
→ strategy
→ voice
→ visual
→ brandbook
→ guardian
→ export
```

A stage work order contains:

- project and stage identifiers
- idempotency key
- governing prompt index
- required artifacts
- workspace and project boundaries
- cost reservation
- quality and safety constraints

Agents create the requested artifacts inside `projects/<project-id>/`, then call `complete-stage` with an artifact manifest. The completion call verifies that every required path exists before changing project state.

## Export gate

Export remains blocked until:

- the 20-axis readiness gate is at least 8.5;
- every critical readiness axis is at least 8.0;
- Brand, Design, Voice, and Rights Guardians all pass;
- there are no P0 or unresolved P1 findings;
- the project contains explicit approval from Bambu for the `export` action.

## Idempotency

Every `run-stage` request requires an `idempotency_key`. Reusing the same key returns the original job instead of creating another job or reserving cost twice.

## Cost controls

- Single job limit: 1,000 cents
- Daily cumulative reservation limit: 5,000 cents
- Jobs above either limit fail with `COST_GUARD`

The current core does not spend money itself. Cost values are reservations supplied by the calling agent so orchestrators can enforce the studio circuit breakers consistently.
