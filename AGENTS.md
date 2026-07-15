# AGENTS.md — Brand Kit Builder

All agents working in this repository must read these files before editing or operating the workflow:

1. `docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md`
2. `docs/PRODUCT_SPEC.md`
3. `docs/ARCHITECTURE.md`
4. `docs/SOURCE_CORPUS.md`
5. `docs/AGENT_API.md`
6. `docs/SECURITY.md`
7. `docs/UPSTREAM_OPEN_CODESIGN.md` when changing the studio interface

## Operating contract

- Inspect repository state, existing patterns, current branch, and source documents before writing code.
- Preserve the package manager, framework, routes, approved copy, and working behavior once established.
- Create a plan, file allowlist, acceptance criteria, risk tier, and rollback path before implementation.
- Never write secrets, credentials, private keys, access tokens, cookies, or authorization headers into source, prompts, screenshots, fixtures, logs, reports, or agent job JSON.
- Never invent testimonials, results, partnerships, clients, metrics, awards, credentials, or product states.
- Never use emojis as icons or design-system elements.
- Do not create generic AI dashboards, meaningless bento grids, repeated icon-card sections, random gradients, glow, glass, or oversized radii without a documented product reason.
- Use semantic HTML, visible labels, accessible interaction states, and obvious current-location cues.
- Every visual or UX change requires HTML evidence, bilingual copy review, and an updated implementation report.
- Production deployment and irreversible actions require explicit Bambu approval.

## Studio interface contract

- English and Mexican Spanish must remain complete and key-compatible.
- Do not add Chinese language content to the custom studio.
- Every actionable button requires an accessible name and `data-help` description.
- The first-run tour must remain skippable, keyboard-operable, persistent after completion, and restartable.
- Browser code must not call providers, accept secrets, access arbitrary paths, or make direct network requests.
- The desktop host bridge may route commands only to approved guarded adapters.
- Preserve Open CoDesign MIT attribution for substantially adapted patterns or code.
- Steve Krug rules apply: do not make users guess what a control does, where they are, what is blocked, or what happens next.

## Agent execution contract

Use the guarded CLI or MCP server instead of writing project state directly:

```bash
node bin/brand-kit-builder.mjs inspect
BKB_WORKSPACE=/absolute/workspace npm run mcp
```

Rules:

- Every project requires explicit source records.
- Every stage runs in the declared order.
- Every work order requires a unique idempotency key.
- Every completion call must identify all required artifacts under `projects/<project-id>/`.
- Do not bypass readiness, Guardian, approval, cost, path, or secret guards by editing stored JSON.
- Do not call model providers, browsers, GitHub write tools, or deployment systems unless a separately approved adapter explicitly allows it.
- Treat CLI and MCP error codes as control signals.
- Same error three consecutive times triggers a hard stop and escalation.

## Branch and commit convention

Branch:

`zte/{bead_id}/{short-description}`

Commit:

`[ZTE][{bead_id}] {action}: {what changed} | {why}`

## Quality gate

- Target: 9.0/10
- Release floor: 8.5/10
- Every critical readiness axis at least 8.0
- No P0 or unresolved P1 issue
- No missing source ledger
- No missing rollback proof before implementation
- No export without all four Guardians and explicit Bambu approval
- No studio release with missing translations, unresolved tour targets, Chinese text, direct browser network calls, or inaccessible buttons
