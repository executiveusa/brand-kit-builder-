# Brand Kit Builder

In-house Pauli Brand Studio application for turning a business idea, URL, repository, logo, image, or source-document set into a complete, source-traceable brand kit and brand voice system.

## Current foundation

This repository contains:

- the complete Pauli Brand Studio operating prompt;
- repository-level agent guardrails;
- product and architecture specifications;
- a self-contained interactive prototype;
- a deterministic local agent core;
- JSON CLI and MCP-over-stdio interfaces;
- source, readiness, stage, guardian, approval, artifact-integrity, path, secret, and cost gates;
- machine-readable schemas, tests, CI, and delivery reports.

The agent core is intentionally provider-neutral. It does not open a network listener, call external AI models, collect telemetry, accept secrets in job payloads, or deploy production systems.

## Requirements

- Node.js 20 or newer
- No runtime npm dependencies

## Open the visual prototype

Open `prototype/index.html` directly in a browser.

## Use from an AI agent

Inspect capabilities:

```bash
node bin/brand-kit-builder.mjs inspect
```

Create a project from the executable example. Input files are read from stdin so they do not need to be copied into the workspace:

```bash
cat examples/agent/create-project.json | \
  node bin/brand-kit-builder.mjs create-project \
  --workspace ./workspace \
  --input -
```

Create an idempotent work order:

```bash
cat examples/agent/run-stage.json | \
  node bin/brand-kit-builder.mjs run-stage \
  --workspace ./workspace \
  --input -
```

After creating the exact required artifacts inside `workspace/projects/<project-id>/`, complete the bound work order:

```bash
cat examples/agent/complete-intake.json | \
  node bin/brand-kit-builder.mjs complete-stage \
  --workspace ./workspace \
  --input -
```

Start the local MCP server:

```bash
BKB_WORKSPACE=/absolute/path/to/workspace npm run mcp
```

Full usage: [`docs/AGENT_API.md`](docs/AGENT_API.md)  
Security model: [`docs/SECURITY.md`](docs/SECURITY.md)

## Agent workflow

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

Agents cannot skip stages. One active work order is allowed per stage. Readiness and later stages require accessed primary and governing sources with resolved conflicts. Strategy and later stages require a passing 20-axis readiness gate. Stage completion must use the same idempotency key as its work order and contain exactly the required regular files. The engine records SHA-256 evidence for every completed artifact. Export requires all four guardians, no P0 or unresolved P1 findings, and explicit Bambu approval.

## Quality and safety laws

- Inspect primary and governing sources before readiness or generation.
- Prebuild score must be at least 8.5.
- Every critical readiness axis must be at least 8.0.
- Never fabricate proof, claims, metrics, testimonials, partnerships, or product states.
- Preserve supplied logos, people, products, packages, and artwork unless a scoped change is approved.
- Apply Steve Krug clarity and trunk-test principles.
- Never use emojis as interface icons.
- Use HTML-first evidence, prototypes, fixes, reports, and handoffs.
- Reject secret-like fields in agent payloads.
- Keep all file operations inside the configured workspace.
- Reject symlink artifacts and record artifact hashes.
- Reserve at most $10 per job and $50 per UTC day.
- Never deploy production without explicit owner approval.

## Validate

```bash
npm run ci
```

## Product path

1. Foundation and source governance
2. Hardened local agent core
3. Source-ingestion adapters
4. Relentless discovery interview
5. Strategy and voice engines
6. Visual identity and image studio
7. KAKU brand-book renderer
8. HTML/PDF/export pipeline
9. Guardian review and design handoff
10. Approved GitHub and deployment integrations
