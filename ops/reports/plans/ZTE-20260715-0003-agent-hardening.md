# BEAD PLAN — ZTE-20260715-0003

## Objective

Harden Brand Kit Builder for safe in-house use by AI agents through a deterministic local CLI, machine-readable contracts, strict filesystem boundaries, source and readiness gates, idempotent job records, approval checks, tests, and CI.

## Risk

MEDIUM. This change introduces an agent execution surface and local write operations, but no network listener, external model call, secret handling, production deployment, or irreversible action.

## Files to create or modify

- `package.json`
- `bin/brand-kit-builder.mjs`
- `src/agent/*.mjs`
- `schemas/*.schema.json`
- `config/policy.json`
- `examples/agent/*.json`
- `tests/*.test.mjs`
- `.github/workflows/ci.yml`
- `docs/AGENT_API.md`
- `docs/SECURITY.md`
- `README.md`
- `AGENTS.md`
- `ops/reports/ZTE-20260715-0003.json`

## Validation criteria

- `npm test` passes on Node 20.
- `npm run check` validates syntax and examples.
- CLI accepts JSON from a file or stdin and returns JSON only.
- All write paths remain under the declared workspace root.
- Unsafe paths, secret-like keys, missing source ledgers, failed prebuild gates, and unapproved gated actions are rejected.
- Duplicate idempotency keys return the previous job result instead of creating a second job.
- No runtime dependency, external API, telemetry, or production configuration is introduced.

## Rollback

Close the pull request without merging or revert all commits on `zte/ZTE-20260715-0003/agent-hardening`.
