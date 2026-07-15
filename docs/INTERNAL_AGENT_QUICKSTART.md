# Internal Agent Quickstart

## 1. Inspect

```bash
node bin/brand-kit-builder.mjs inspect
```

## 2. Create workspace and project

```bash
mkdir -p workspace
node bin/brand-kit-builder.mjs create-project --workspace ./workspace --input examples/agent/create-project.json
```

## 3. Request a stage

```bash
node bin/brand-kit-builder.mjs run-stage --workspace ./workspace --input examples/agent/run-stage.json
```

Read the returned `required_outputs` and governing prompt index. Create those outputs only under:

```text
workspace/projects/<project-id>/
```

## 4. Complete the stage

```bash
node bin/brand-kit-builder.mjs complete-stage --workspace ./workspace --input examples/agent/complete-intake.json
```

The command fails if any required artifact does not exist.

## 5. Validate before moving on

```bash
node bin/brand-kit-builder.mjs validate-project --workspace ./workspace --project-id kupuri-media-demo
```

## MCP mode

```bash
BKB_WORKSPACE="$PWD/workspace" npm run mcp
```

Configure the agent host from `examples/mcp-config.json`.
