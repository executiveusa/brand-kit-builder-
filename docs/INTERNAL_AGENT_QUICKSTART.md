# Internal Agent Quickstart

## 1. Inspect

```bash
node bin/brand-kit-builder.mjs inspect
```

## 2. Create workspace and project

```bash
mkdir -p workspace
cat examples/agent/create-project.json | \
  node bin/brand-kit-builder.mjs create-project \
  --workspace ./workspace \
  --input -
```

## 3. Request a stage

```bash
cat examples/agent/run-stage.json | \
  node bin/brand-kit-builder.mjs run-stage \
  --workspace ./workspace \
  --input -
```

Read the returned `required_outputs`, `idempotency_key`, and governing prompt index. Create only those outputs under:

```text
workspace/projects/<project-id>/
```

## 4. Complete the bound stage

```bash
cat examples/agent/complete-intake.json | \
  node bin/brand-kit-builder.mjs complete-stage \
  --workspace ./workspace \
  --input -
```

The completion request must use the same project, stage, and idempotency key as the work order. It fails if the manifest has missing or extra paths, if a file is absent, or if an artifact is a directory or symlink. Successful completion records SHA-256 and byte size.

## 5. Validate before moving on

```bash
node bin/brand-kit-builder.mjs validate-project \
  --workspace ./workspace \
  --project-id kupuri-media-demo
```

## Source stage rule

When completing `sources`, include the updated source array. Every primary or governing source must have `accessed: true`, and all `conflicts` arrays must be empty.

## MCP mode

```bash
BKB_WORKSPACE="$PWD/workspace" npm run mcp
```

Configure the agent host from `examples/mcp-config.json`. Use one MCP server process per workspace.
