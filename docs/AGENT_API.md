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

For files outside the workspace, pass JSON through stdin. Direct `--input FILE` reads are intentionally limited to files inside the workspace.

Create a project:

```bash
cat examples/agent/create-project.json | \
  node bin/brand-kit-builder.mjs create-project \
  --workspace ./workspace \
  --input -
```

Create an idempotent stage work order:

```bash
cat examples/agent/run-stage.json | \
  node bin/brand-kit-builder.mjs run-stage \
  --workspace ./workspace \
  --input -
```

Complete the same work order after creating its exact required files:

```bash
cat examples/agent/complete-intake.json | \
  node bin/brand-kit-builder.mjs complete-stage \
  --workspace ./workspace \
  --input -
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

MCP calls are processed serially to protect local state from concurrent stdio mutations.

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

- project and stage identifiers;
- a globally unique idempotency key;
- governing prompt index;
- exact required artifacts;
- workspace and project boundaries;
- cost reservation;
- quality and safety constraints.

Only one active work order is allowed for a project stage. Reusing its idempotency key with a different project or stage fails with `IDEMPOTENCY_CONFLICT`.

## Source stage

The `sources` completion request must include the updated source array. Primary and governing sources must be marked `accessed: true`, and their `conflicts` arrays must be empty. The engine writes the canonical `source-ledger.json` and blocks readiness until this gate passes.

## Stage completion

Agents create the requested artifacts inside `projects/<project-id>/`, then call `complete-stage` with:

- the same `project_id`;
- the same `stage`;
- the same `idempotency_key` returned by `run-stage`;
- an artifact manifest containing exactly the required paths.

The engine rejects missing, extra, duplicate, directory, and symlink artifacts. It computes SHA-256 and byte size for every completed artifact. A caller-supplied hash is verified when present. Completion is idempotent after the bound job reaches `completed`.

## Export gate

Export remains blocked until:

- primary and governing sources are accessed and conflicts resolved;
- the 20-axis readiness gate is at least 8.5;
- every critical readiness axis is at least 8.0;
- Brand, Design, Voice, and Rights Guardians all pass;
- there are no P0 or unresolved P1 findings;
- the project contains explicit approval from Bambu for the `export` action.

Guardian and approval state are checked when the export work order is created and again when export completion is submitted.

## Cost controls

- Single job limit: 1,000 cents
- Daily cumulative reservation limit: 5,000 cents
- Jobs above either limit fail with `COST_GUARD`

The current core does not spend money itself. Cost values are reservations supplied by the calling agent so orchestrators can enforce the studio circuit breakers consistently.
