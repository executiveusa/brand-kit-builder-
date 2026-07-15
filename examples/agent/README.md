# Agent examples

- `create-project.json`: canonical project intake.
- `run-stage.json`: idempotent work-order request.
- `complete-intake.json`: artifact manifest used after the intake outputs exist.

Run from the repository root:

```bash
node bin/brand-kit-builder.mjs create-project --workspace ./workspace --input examples/agent/create-project.json
node bin/brand-kit-builder.mjs run-stage --workspace ./workspace --input examples/agent/run-stage.json
node bin/brand-kit-builder.mjs complete-stage --workspace ./workspace --input examples/agent/complete-intake.json
```

The completion command fails until both declared files exist beneath `workspace/projects/kupuri-media-demo/`.
