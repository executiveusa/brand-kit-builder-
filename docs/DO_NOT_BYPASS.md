# Do not bypass the agent core

Agents must not write directly to `.brand-kit-builder/` or mutate `projects/<project-id>/project.json`.

Direct edits bypass idempotency, stage ordering, readiness checks, guardian state, approvals, path containment, and cost accounting. Use the CLI or MCP tools documented in `docs/AGENT_API.md`.
