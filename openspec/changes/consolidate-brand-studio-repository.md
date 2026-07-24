# Change: consolidate-brand-studio-repository

## Metadata

- **change-id:** consolidate-brand-studio-repository
- **phase:** 00
- **risk-tier:** MEDIUM
- **status:** accepted
- **accepted-at:** 2026-07-24
- **accepted-by:** GRINIONS-autonomous
- **target-version:** 0.3.0

## Context

The repository had two open documentation-only PRs (#11 gap-closure prompt, #12 Phase 0 architecture freeze) and a version drift between `package.json` (0.3.0) and `APP_VERSION` / MCP serverInfo (0.2.0). The GRINIONS control structure (`openspec/`, `ops/receipts/`, `ops/rollback/`, `.ralphy/`, PR template) was missing.

## Proposal

1. Merge PR #12 (Phase 0 architecture freeze — ICM structure, bounded tickets, capability matrix, anti-slop spec, Paperclip boundary).
2. Merge PR #11 (production gap-closure prompt document).
3. Fix version drift: align `APP_VERSION` and MCP `serverInfo.version` to `0.3.0` to match `package.json`.
4. Add version parity check to `scripts/validate.mjs` to prevent future drift.
5. Add `graphify-out/` to `.gitignore`.
6. Create GRINIONS control structure: `openspec/`, `ops/receipts/`, `ops/rollback/`, `.ralphy/`, `.github/pull_request_template.md`.
7. Write consolidation receipt and rollback receipt.

## Scope

### Files changed

- `src/agent/constants.mjs` — `APP_VERSION` 0.2.0 to 0.3.0
- `bin/brand-kit-builder-mcp.mjs` — import `APP_VERSION`, use it for `serverInfo.version`
- `scripts/validate.mjs` — add version parity check
- `.gitignore` — add `graphify-out/`, `.ralphy/logs/`, `openspec/changes/*/drafts/`
- `openspec/` — new directory
- `ops/receipts/` — new directory
- `ops/rollback/` — new directory
- `.ralphy/` — new directory
- `.github/pull_request_template.md` — new file

### PRs merged

- PR #12 — Phase 0 architecture freeze (squash merged, SHA `024172e`)
- PR #11 — Production gap-closure prompt (squash merged, SHA `cb56b73`)

## Non-goals

- No runtime schema migration
- No provider integration
- No database change
- No deployment
- No secret exposure
- No destructive migration

## Acceptance criteria

- [x] PR #12 merged (Phase 0 architecture freeze)
- [x] PR #11 merged (gap-closure prompt)
- [x] Version drift fixed (`APP_VERSION` = `package.json.version` = `0.3.0`)
- [x] Version parity check added to `npm run check`
- [x] `graphify-out/` gitignored
- [x] GRINIONS control structure created
- [x] Consolidation receipt written
- [x] Rollback receipt written
- [x] `npm run check` passes
- [x] `npm test` passes (53 tests, 0 failures)

## Rollback

Revert the squash merge commit. No data migration, no stored-project state change, no deployment rollback required. See `ops/rollback/phase-00-repository-consolidation.json`.
