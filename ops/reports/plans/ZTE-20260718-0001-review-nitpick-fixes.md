# ZTE-20260718-0001 — Post-merge review fixes

## Objective

Resolve every actionable unresolved review finding attached to PR #9 without expanding the product surface.

## Findings in scope

1. Preserve `studio_sync.synchronized_at` when the canonical evidence hash is unchanged so a valid human export approval does not become stale after a non-material sync.
2. Reject Studio snapshot and event writes when any existing path segment beneath the workspace is a symbolic link.
3. Update the canonical `projects/<project-id>/source-ledger.json` whenever Studio release evidence synchronizes normalized sources into the core project.

## Files allowed to change

- `src/agent/studio-sync.mjs`
- `src/studio-host/snapshot-store.mjs`
- `tests/studio-host.test.mjs`
- `ops/reports/plans/ZTE-20260718-0001-review-nitpick-fixes.md`
- `ops/reports/ZTE-20260718-0001.json`

## Tests to add

- unchanged evidence preserves the original synchronization timestamp and keeps approval current;
- changed evidence receives a later synchronization timestamp and invalidates the prior approval;
- normalized Studio sources are written to the canonical source ledger;
- a symlinked `.brand-kit-builder` path blocks snapshot state and event writes.

## Validation criteria

PASS only when:

- all new regression tests pass;
- the complete repository validation and Node test suite pass in GitHub Actions;
- no unresolved P0/P1/P2 review thread remains on the follow-up PR;
- main contains the fixes through a merged pull request.

## Rollback

Revert the follow-up merge commit. No schema migration, external service, secret, deployment, or irreversible state change is introduced.

## Risk

MEDIUM. The changes affect release-approval freshness, canonical source evidence, and filesystem write guards. The implementation is intentionally limited to existing contracts and regression tests.
