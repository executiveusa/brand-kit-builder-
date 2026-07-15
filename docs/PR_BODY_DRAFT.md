# Agent hardening pull request

## Objective

Make Brand Kit Builder safe and usable by in-house AI agents without exposing a network service or enabling uncontrolled external actions.

## Added

- dependency-free JSON CLI
- MCP-over-stdio server
- JavaScript SDK exports
- project, source, job, and stage schemas
- atomic local state and idempotent jobs
- source, readiness, stage-order, artifact, guardian, approval, path, symlink, secret, and cost guards
- tests for security, prebuild scoring, orchestration, MCP, and cost limits
- GitHub Actions CI
- agent skill, API guide, security model, error catalog, and quickstart

## Validation

`npm run check` and `npm test` are executed in CI. Local cloning was blocked by unavailable external DNS in the sandbox.

## Risk

MEDIUM. New local agent execution surface. No network listener, external AI call, telemetry, secret storage, deployment, or production mutation.

## Rollback

Close the stacked pull request or revert commits on the hardening branch.
