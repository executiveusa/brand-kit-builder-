# In-house Agent API

Brand Kit Builder exposes two local, provider-neutral agent interfaces:

1. `brand-kit-builder` — JSON CLI for scripts, shell agents, CI, and one-shot workers.
2. `brand-kit-builder-mcp` — MCP over stdio for agent runtimes that support tool discovery.

Neither interface opens a network port, calls an external model, sends telemetry, or accepts credentials in job payloads.

## Runtime and state

- Node.js 20 or newer
- No npm runtime dependencies
- Workspace defaults to the current directory

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

For JSON outside the workspace, stream it through stdin:

```bash
cat examples/agent/create-project.json | \
  node bin/brand-kit-builder.mjs create-project --workspace ./workspace --input -

cat examples/agent/run-stage.json | \
  node bin/brand-kit-builder.mjs run-stage --workspace ./workspace --input -

cat examples/agent/complete-intake.json | \
  node bin/brand-kit-builder.mjs complete-stage --workspace ./workspace --input -
```

Read project state:

```bash
node bin/brand-kit-builder.mjs get-project \
  --workspace ./workspace \
  --project-id kupuri-media-demo
```

Every non-interactive success is JSON on stdout. Failures are JSON on stderr with stable error codes.

## MCP

```bash
BKB_WORKSPACE=/absolute/path/to/workspace npm run mcp
```

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

There is deliberately no MCP approval tool. MCP mutations are serialized to protect local state.

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

Only one active work order is allowed per project stage. Reusing an idempotency key with a different project or stage fails.

## Source stage

The `sources` completion request must include the updated source array. Primary and governing sources must be marked `accessed: true`, and their conflicts must be resolved. The engine writes the canonical source ledger and blocks readiness until this gate passes.

## Stage completion

Completion must provide the same `project_id`, `stage`, and `idempotency_key` returned by `run-stage`. Its artifact manifest must contain exactly the required paths.

The engine rejects missing, extra, duplicate, directory, and symlink artifacts. It computes SHA-256 and byte size for every completed artifact. A caller-supplied hash is verified when present.

## Owner approval

Approvals cannot be supplied in project intake, JSON payloads, SDK intake, or MCP calls. After the guardian stage passes, the project owner records export approval from a human-operated local terminal:

```bash
node bin/brand-kit-builder.mjs approve \
  --workspace ./workspace \
  --project-id <project-id> \
  --action export
```

The command requires TTY input and stderr, asks for the project owner name, and requires the exact phrase shown on screen. Prompts use stderr; the resulting approval record uses JSON stdout. The approval is rechecked before export starts and when export completes.

## Export gate

Export remains blocked until:

- primary and governing sources are accessed and conflicts resolved;
- the readiness score is at least 8.5;
- every critical readiness axis is at least 8.0;
- Brand, Design, Voice, and Rights Guardians pass;
- P0 findings and unresolved P1 findings are zero;
- interactive owner approval exists.

## Cost controls

- Single job limit: 1,000 cents
- Daily cumulative reservation limit: 5,000 cents
- Jobs above either limit fail with `COST_GUARD`

The core does not spend money. Cost values are reservations supplied by the calling agent so orchestrators can enforce the studio circuit breakers consistently.
