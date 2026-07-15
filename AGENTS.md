# AGENTS.md — Brand Kit Builder

All agents working in this repository must read these files before editing or operating the workflow:

1. `docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md`
2. `docs/PRODUCT_SPEC.md`
3. `docs/ARCHITECTURE.md`
4. `docs/SOURCE_CORPUS.md`
5. `docs/AGENT_API.md`
6. `docs/SECURITY.md`

## Operating contract

- Inspect repository state, existing patterns, current branch, and source documents before writing code.
- Preserve the package manager, framework, routes, approved copy, and working behavior once established.
- Create a plan, file allowlist, acceptance criteria, risk tier, and rollback path before implementation.
- Never write secrets, credentials, private keys, access tokens, cookies, or authorization headers into source, prompts, screenshots, fixtures, logs, reports, or agent job JSON.
- Never invent testimonials, results, partnerships, clients, metrics, awards, credentials, or product states.
- Never use emojis as icons or design-system elements.
- Do not create generic AI dashboards, meaningless bento grids, repeated icon-card sections, random gradients, glow, glass, or oversized radii without a documented product reason.
- Use semantic HTML and accessible interaction states.
- Every visual or UX change requires HTML evidence and an updated implementation report.
- Production deployment and irreversible actions require explicit Bambu approval.

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
- Every completion call must identify all required artifacts, and those artifacts must exist under `projects/<project-id>/`.
- Do not bypass readiness, guardian, approval, cost, path, or secret guards by editing stored JSON.
- Do not call model providers, browsers, GitHub write tools, or deployment systems unless a separately approved adapter explicitly allows it.
- Treat CLI and MCP error codes as control signals. Do not retry `APPROVAL_REQUIRED`, `SECRET_GUARD`, `PATH_GUARD`, `COST_GUARD`, or `GUARDIAN_GATE_FAILED` without resolving the cause.
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
- No export without all four guardians and explicit Bambu approval
