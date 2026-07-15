# Agent examples

- `create-project.json`: canonical project intake.
- `run-stage.json`: idempotent work-order request.
- `complete-intake.json`: bound artifact manifest used after the intake outputs exist.
- `approval.json`: explicit owner approval record shape.

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
