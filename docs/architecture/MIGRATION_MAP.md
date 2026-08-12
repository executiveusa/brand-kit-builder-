# Migration map — brownfield → ICM v2

Status: **APPROVED 2026-08-11 / PHASE 1 IN PROGRESS.**

ICM restructure law requires inventory/classification and an approved old→new map before moving or deleting brownfield files. This map was approved by the owner before Phase 1 migration work began.

| Legacy path | Role | Canonical home | Phase 1 state |
|---|---|---|---|
| `studio/README.md` | Catalog/router | `studio/CONTEXT.md` + root links | Migrated; README is now a pointer/router |
| `studio/CONSOLIDATION.md` | Factory/shared memory | `studio/_system/governance/CONSOLIDATION.md` | Migrated; legacy pointer retained |
| `studio/ICM.md` | Contract | `studio/_system/contracts/ICM.md` | Migrated; legacy pointer retained |
| `studio/FACTORY.md` | Contract/worker roster | `studio/_system/contracts/FACTORY.md` | Migrated; legacy pointer retained |
| `studio/AUTO_ROUTER.md` | Factory/routing | `studio/_system/routing/AUTO_ROUTER.md` | Migrated; legacy pointer retained |
| `studio/GUARDIANS.md` | Factory/validators | `studio/_system/guardians/GUARDIANS.md` | Migrated; legacy pointer retained |
| `studio/API.md` | Agent interface contract | `interfaces/rest/API.md` | Migrated; legacy pointer retained |
| `studio/PAULIS_PLACE.md` | Downstream publish contract | `studio/_shared/publish/PAULIS_PLACE.md` | Migrated; design-office/store boundary explicit |
| `studio/schemas/*.json` | Factory schemas | `studio/_system/schemas/` | Migrated; legacy JSON pointers retained |
| `PAULI_STUDIO_MASTER_PROMPT.md` | Factory constitution | `studio/_system/governance/PAULI_STUDIO_MASTER_PROMPT.md` | Migrated; root pointer retained |
| `KAKU_BRAND_BOOK_TEMPLATE.md` | Reusable creative reference | `studio/_shared/brand-book/KAKU_BRAND_BOOK_TEMPLATE.md` | Migrated; root pointer retained |
| `DARYA_FONT_REGISTRY.md` | Reusable creative reference | `studio/_shared/design-systems/type/DARYA_FONT_REGISTRY.md` | Migrated; root pointer retained |
| `demo-brand-book.html` | Product/example rendering | `studio/_shared/references/examples/racional-creativo/demo-brand-book.html` | Deferred to Phase 2 app/reference integration after runtime link rewrite |
| `PAULI_STUDIO_GAPS.md` (if present) | Historical/status | `docs/decisions/` or `_archive/` | Inspect freshness before moving |
| `design-os-main` uploaded donor | External MIT reference | `studio/_shared/references/design-os/NOTICE.md` + selectively adapted app code | Phase 2 donor; do not vendor whole donor blindly |
| `new-look` uploaded skill | Factory skill/reference | agent skill registry / `_shared/references/skills/` | Runtime integration phase |
| `full-stack-wiring-audit` uploaded skill | Guardian/audit skill | agent skill registry / `_system/guardians/` pointer | Runtime/audit phase |
| `gauntlet-loop` uploaded skill | Guardian/evaluator pattern | agent skill registry / `_system/guardians/` pointer | Final independent critic phase |
| `icm-architect` uploaded skill | Architecture skill | agent skill registry / `_system/governance/` pointer | Governs this restructuring |

## Compatibility-pointer law
A migrated legacy path may remain only as a small pointer to its new canonical home. The legacy file must not contain a second editable copy of the fact.

## Required checks before Phase 1 merge
1. Search repository references to migrated legacy locations.
2. Ensure the root and studio routers point to canonical ICM paths.
3. Verify one-home-per-fact for all migrated core contracts and shared references.
4. Verify all canonical target files are fetchable from the Phase 1 branch.
5. Run a cold-walk from root `AGENTS.md` → root `CONTEXT.md` → `studio/CONTEXT.md`.
6. Compare Phase 1 branch against `main` and inspect unexpected changes.
7. Check CI/status availability; do not claim CI pass if no checks exist.
8. Keep `main` rollbackable through a single PR revert.

## Deferred artifact move
`demo-brand-book.html` remains at its legacy root path in Phase 1 because it is a rendering/reference artifact rather than canonical operating truth and is referenced by the existing prototype and local injection helper. Its path migration belongs with Phase 2 application integration so links and runtime assumptions change together.
