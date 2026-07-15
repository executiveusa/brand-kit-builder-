# ZTE-20260715-0010 — Guarded localhost Studio Host

## Objective

Make the Pauli Brand Studio durable and operational beyond browser demo mode by connecting it to the hardened Brand Kit Builder core through an authenticated localhost host.

## Scope

- localhost-only Node.js Studio host;
- per-process random session authentication;
- CSP nonce and restrictive security headers;
- explicit host command allowlist;
- atomic sanitized Studio snapshot storage;
- event audit log;
- browser hydration from host state;
- automatic core-project creation;
- release-evidence validation and SHA-256 synchronization;
- read-only inspection of human export approval;
- stale-approval protection after evidence changes;
- default `npm run studio` host runtime;
- static browser-only preview retained as `npm run studio:static`;
- tests for session, origin, command, snapshot, evidence, and approval boundaries.

## Files

### Create

- `src/agent/studio-sync.mjs`
- `src/studio-host/snapshot-store.mjs`
- `src/studio-host/service.mjs`
- `scripts/studio-host.mjs`
- `docs/STUDIO_HOST.md`
- `tests/studio-host.test.mjs`
- `ops/reports/plans/ZTE-20260715-0010-local-studio-host.md`
- `ops/reports/ZTE-20260715-0010.json`

### Modify

- `apps/studio/agent-bridge.js`
- `apps/studio/release-project-store.js`
- `apps/studio/guardian-export-domain.js`
- `apps/studio/app.js`
- `package.json`
- `scripts/validate.mjs`
- `scripts/validate-studio.mjs`
- `tests/guardian-export.test.mjs`

## Acceptance criteria

- `npm run studio` serves the Studio through the guarded localhost host.
- The host binds to `127.0.0.1` by default.
- Every API request requires a random session token.
- Unknown commands fail closed.
- No host code imports `child_process` or executes a shell.
- Studio snapshots persist atomically and strip browser approval/export state.
- Browser state hydrates from the host on startup.
- Complete release evidence synchronizes into the core with SHA-256 evidence.
- Incomplete evidence remains stored but cannot unlock core approval.
- Browser code cannot create export approval.
- Only current human terminal approval can be inspected.
- Evidence changes make older approval stale.
- Unchanged evidence does not invalidate approval.
- Existing CLI, MCP, workflow, Guardian, export, and security tests pass.
- No production deployment or remote listener is added.

## Validation

- `npm run check`
- `npm test`
- GitHub Actions `Agent Core CI`

## Risk

MEDIUM. A localhost network listener and durable state boundary are introduced. The listener remains process-local, authenticated, allowlisted, provider-neutral, and incapable of arbitrary process execution.

## Rollback

Close the pull request or revert the Phase 3A commits. `npm run studio:static` remains available. Workspace Studio state can be archived or removed from `.brand-kit-builder/studio/` without touching core project state.
