# Brand Kit Builder

Pauli Brand Studio is an in-house, bilingual brand-design application for turning a business idea, website, repository, logo, image, or source-document set into a complete, source-traceable brand system.

## What is included

- the complete Pauli Brand Studio operating prompt;
- repository-level agent and design guardrails;
- a deterministic local agent core;
- JSON CLI, JavaScript SDK, and MCP-over-stdio interfaces;
- source, readiness, stage, Guardian, approval, artifact-integrity, path, secret, and cost gates;
- a custom English and Mexican Spanish studio interface;
- Brand Canvas previews for brand books, logo systems, social applications, and websites;
- files, comments, history, claims, rights, and deliverable workspaces;
- live draft controls for color, typography, imagery, and voice;
- an automatic first-run product tour that can be restarted at any time;
- machine-readable schemas, tests, CI, and delivery reports.

The agent core remains provider-neutral. It does not call external AI models, collect telemetry, accept secrets in job payloads, or deploy production systems.

## Run the custom studio

Requirements: Node.js 20 or newer. No runtime npm dependencies are required.

```bash
npm run studio
```

Open `http://127.0.0.1:4173`.

The studio:

- binds only to localhost;
- loads no remote assets;
- makes no direct browser network calls;
- starts in demo mode when no desktop host is connected;
- stores the preferred language and completed tour state only in local browser storage.

Use **EN / ES** to switch between English and natural Mexican Spanish. The guided tour starts automatically once and remains available from **Tour / Recorrido**. Add `?tour=1` to force it open.

Studio details: [`apps/studio/README.md`](apps/studio/README.md)  
Open CoDesign extraction map: [`docs/UPSTREAM_OPEN_CODESIGN.md`](docs/UPSTREAM_OPEN_CODESIGN.md)  
Third-party notices: [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)

## Use from an AI agent

Inspect capabilities:

```bash
node bin/brand-kit-builder.mjs inspect
```

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

Agent usage: [`docs/AGENT_API.md`](docs/AGENT_API.md)  
Security model: [`docs/SECURITY.md`](docs/SECURITY.md)

## Required workflow

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

Stages cannot be skipped. Strategy and later work require a passing 20-axis readiness gate. Every completion must match a bound work order and provide the exact regular-file artifacts. Export requires all four Guardians, no P0 or unresolved P1 findings, and explicit owner approval from the human-operated local terminal.

## Quality and safety laws

- Inspect primary and governing sources before readiness or generation.
- Prebuild score must be at least 8.5, with every critical axis at least 8.0.
- Never fabricate proof, claims, metrics, testimonials, partnerships, or product states.
- Preserve supplied logos, people, products, packages, and artwork unless a scoped change is approved.
- Apply Steve Krug clarity and trunk-test principles.
- Use visible labels, obvious active states, and reversible draft changes.
- Never use emojis as interface icons.
- Reject secret-like fields and keep file operations inside the configured workspace.
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
3. Custom bilingual studio shell
4. Source-ingestion adapters
5. Relentless discovery interview
6. Strategy and voice engines
7. Visual identity and image studio
8. KAKU brand-book renderer
9. HTML, PDF, presentation, and ZIP exports
10. Guardian review and design handoff
11. Approved GitHub and deployment integrations
