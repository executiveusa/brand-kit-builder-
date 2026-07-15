# AGENTS.md — Brand Kit Builder

All agents working in this repository must read these files before editing:

1. `docs/PAULI_BRAND_STUDIO_MASTER_SYSTEM_PROMPT_INDEX.md`
2. `docs/PRODUCT_SPEC.md`
3. `docs/ARCHITECTURE.md`
4. `docs/SOURCE_CORPUS.md`

## Operating contract

- Inspect repository state, existing patterns, current branch, and source documents before writing code.
- Preserve the package manager, framework, routes, approved copy, and working behavior once established.
- Create a plan, file allowlist, acceptance criteria, risk tier, and rollback path before implementation.
- Never write secrets, credentials, private keys, or access tokens into source, prompts, screenshots, fixtures, logs, or reports.
- Never invent testimonials, results, partnerships, clients, metrics, awards, credentials, or product states.
- Never use emojis as icons or design-system elements.
- Do not create generic AI dashboards, meaningless bento grids, repeated icon-card sections, random gradients, glow, glass, or oversized radii without a documented product reason.
- Use semantic HTML and accessible interaction states.
- Every visual or UX change requires HTML evidence and an updated implementation report.
- Production deployment and irreversible actions require explicit Bambu approval.

## Branch and commit convention

Branch:

`zte/{bead_id}/{short-description}`

Commit:

`[ZTE][{bead_id}] {action}: {what changed} | {why}`

## Quality gate

- Target: 9.0/10
- Release floor: 8.5/10
- No P0 or unresolved P1 issue
- No missing source ledger
- No missing rollback proof before implementation
