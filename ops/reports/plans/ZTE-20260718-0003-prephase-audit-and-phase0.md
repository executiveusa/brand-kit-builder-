# ZTE-20260718-0003 — Pre-Phase-0 audit and Phase 0 architecture freeze

## Objective

1. Complete the production-completion handoff audit against the current `main` branch without assuming earlier claims are current.
2. Produce an evidence-backed capability matrix and bounded ticket backlog.
3. Only after the audit is verified, begin Phase 0 by freezing the target architecture, ICM context model, Paperclip boundary, agent roles, canonical domain objects, rule packs, and threat model.

## Baseline and concurrent work

- Repository: `executiveusa/brand-kit-builder-`
- Baseline main: `7b0f142258570a32190081f88adb8361e6f64150`
- Open PR #11 is documentation-only and changes only `docs/ONE_SHOT_PRODUCTION_BRAND_STUDIO_GAP_CLOSURE.md`; do not overwrite it.
- Latest authoritative full-suite CI before this branch: PR #10 head `1139d0de610cd3cc76172c9b4005d160d6005f8a`, Agent Core CI run `29650565168`, conclusion `success`.
- A local clone/test attempt was made before edits and failed because the sandbox could not resolve `github.com`; GitHub Actions remains the authoritative validation path.

## Files allowed in BKB-AUDIT-001

- `ops/reports/plans/ZTE-20260718-0003-prephase-audit-and-phase0.md`
- `docs/CURRENT_CAPABILITY_MATRIX.md`
- `docs/BOUNDED_IMPLEMENTATION_TICKETS.md`
- `ops/reports/ZTE-20260718-0003.json`

## Files allowed when Phase 0 begins

- `docs/PHASE_0_ARCHITECTURE_FREEZE.md`
- `docs/ICM_STUDIO_SPEC.md`
- `docs/PAPERCLIP_INTEGRATION_BOUNDARY.md`
- `docs/ANTI_SLOP_RULE_ENGINE_SPEC.md`
- `docs/AGENT_ORG_CHART.md`
- `icm/CONTEXT.md`
- `icm/_config/*.md|yaml|json`
- `icm/shared/*.md|json`
- `icm/stages/*/CONTEXT.md`
- this plan/report and capability/ticket documents when reconciliation requires an update

## Dependencies read before implementation

- `AGENTS.md`
- all eight ordered `docs/prompt/*` modules
- `docs/PRODUCT_SPEC.md`
- `docs/ARCHITECTURE.md`
- `docs/SOURCE_CORPUS.md`
- `docs/AGENT_API.md`
- `docs/SECURITY.md`
- `skills/brand-kit-builder-agent/SKILL.md`
- PR #11 execution prompt
- uploaded Open Pomelli donor repository
- uploaded Paperclip repository
- uploaded ICM methodology paper
- ZTE handoff supplied by the owner

## Acceptance criteria — BKB-AUDIT-001

PASS only when:

- current main, last 10 commits, open PRs/issues, CI, package version, Studio UI, CLI, MCP, SDK status, renderers, export, logo/visual model, storage, and security boundaries are reconciled;
- capability claims are backed by current files/tests rather than README assumptions;
- current capability matrix identifies keep/extend/replace decisions and smallest safe tickets;
- package/app version drift and documentation/runtime drift are explicitly recorded;
- all confirmed gaps are decomposed into bounded tickets;
- repository validation and full Node test suite pass in GitHub Actions for the audit branch.

## Acceptance criteria — Phase 0

PASS only when:

- one canonical Brand Engine boundary is defined for Human Studio, CLI, MCP, SDK, and future HTTP API;
- ICM five-layer context architecture and numbered stage contracts are explicit;
- Paperclip is defined as a replaceable control-plane adapter, not the canonical brand domain;
- Hermes is defined as Studio Director/orchestrator, not a self-approving worker;
- canonical objects, evidence/provenance, work orders, approvals, artifacts, Guardians, rule packs, and release boundaries are versioned and transport-neutral;
- deterministic Krug/anti-slop rule categories and merge-blocking severity behavior are specified;
- multi-repository sandbox and human-in-the-loop trust boundaries are documented;
- no production deployment or irreversible migration occurs.

## Verification

- `npm run check`
- `npm test`
- no unresolved P0/P1 findings on the PR
- compare planned files against any new concurrent PR before each ticket

## Risk

MEDIUM. BKB-AUDIT-001 is documentation-only. Phase 0 freezes architectural contracts that will guide future implementation but does not migrate runtime state or deploy services.

## Rollback

Revert the audit/architecture commits. No schema migration, secret, provider, production deployment, database change, or irreversible action is included.
