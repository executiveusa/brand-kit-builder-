# Agent examples

- `create-project.json`: canonical project intake.
- `run-stage.json`: idempotent intake work-order request.
- `complete-intake.json`: bound artifact manifest used after the intake outputs exist.
- `complete-sources.json`: source-stage completion with accessed evidence and resolved conflicts.

Run from the repository root:

```bash
cat examples/agent/create-project.json | \
  node bin/brand-kit-builder.mjs create-project --workspace ./workspace --input -

cat examples/agent/run-stage.json | \
  node bin/brand-kit-builder.mjs run-stage --workspace ./workspace --input -

cat examples/agent/complete-intake.json | \
  node bin/brand-kit-builder.mjs complete-stage --workspace ./workspace --input -
```

The completion command uses the same `idempotency_key` as the work order and fails until both declared files exist beneath `workspace/projects/kupuri-media-demo/`. The manifest must contain exactly the required paths.

Before using `complete-sources.json`, request a `sources` work order with idempotency key `kupuri-sources-v1`, inspect the actual sources, replace the placeholder hash or snapshot identifier, and create `source-conflicts.md`.

Approval is intentionally absent from agent JSON and MCP tools. The project owner records export approval only through the local interactive CLI after guardian and readiness gates pass.
