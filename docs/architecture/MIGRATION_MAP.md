# Migration map — brownfield → ICM v2

Status: **PROPOSED / HUMAN GATE REQUIRED BEFORE MOVES.**

ICM restructure law requires inventory/classification and an approved old→new map before moving or deleting brownfield files. This file is that gate.

| Current path | Role | Proposed home | Action after approval |
|---|---|---|---|
| `studio/README.md` | Catalog/router | `studio/CONTEXT.md` + root links | Consolidate routing; preserve historical README via link/archive |
| `studio/CONSOLIDATION.md` | Factory/shared memory | `studio/_system/governance/CONSOLIDATION.md` | Move; update links |
| `studio/ICM.md` | Contract | `studio/_system/contracts/ICM.md` | Move; reconcile with ICM Architect v2 contracts |
| `studio/FACTORY.md` | Contract/worker roster | `studio/_system/contracts/FACTORY.md` | Move |
| `studio/AUTO_ROUTER.md` | Factory/routing | `studio/_system/routing/AUTO_ROUTER.md` | Move |
| `studio/GUARDIANS.md` | Factory/validators | `studio/_system/guardians/GUARDIANS.md` | Move |
| `studio/API.md` | Agent interface contract | `interfaces/rest/API.md` | Move; keep pointer under studio contracts |
| `studio/PAULIS_PLACE.md` | Downstream publish contract | `studio/_shared/publish/PAULIS_PLACE.md` or downstream repo reference | Decide boundary before move |
| `studio/schemas/*.json` | Factory schemas | `studio/_system/schemas/` | Move as one atomic path migration |
| `PAULI_STUDIO_MASTER_PROMPT.md` | Factory constitution | `studio/_system/governance/PAULI_STUDIO_MASTER_PROMPT.md` | Move; root pointer remains |
| `KAKU_BRAND_BOOK_TEMPLATE.md` | Reusable creative reference | `studio/_shared/brand-book/KAKU_BRAND_BOOK_TEMPLATE.md` | Move |
| `DARYA_FONT_REGISTRY.md` | Reusable creative reference | `studio/_shared/design-systems/type/DARYA_FONT_REGISTRY.md` | Move |
| `demo-brand-book.html` | Product/example rendering | `studio/_shared/references/examples/racional-creativo/demo-brand-book.html` | Move only after link scan |
| `PAULI_STUDIO_GAPS.md` (if present) | Historical/status | `docs/decisions/` or `_archive/` | Inspect freshness before moving |
| `design-os-main` uploaded donor | External MIT reference | `studio/_shared/references/design-os/NOTICE.md` + selectively adapted app code | Do not vendor whole donor blindly |
| `new-look` uploaded skill | Factory skill/reference | agent skill registry / `_shared/references/skills/` | Install only if runtime convention supports it |
| `full-stack-wiring-audit` uploaded skill | Guardian/audit skill | agent skill registry / `_system/guardians/` pointer | Reference current skill; do not duplicate rules into every project |
| `gauntlet-loop` uploaded skill | Guardian/evaluator pattern | agent skill registry / `_system/guardians/` pointer | Use separate critic; retain attribution |
| `icm-architect` uploaded skill | Architecture skill | agent skill registry / `_system/governance/` pointer | Governs restructuring and contracts |

## New files that do not require moving old content
These are safe to add before the migration gate because they create missing routing surfaces without changing old paths:
- root `AGENTS.md`
- root `CONTEXT.md`
- `apps/web/CONTEXT.md`
- architecture proposal documents
- homepage prototype

## Required checks before migration
1. Search every repository path that references each old location.
2. Replace links atomically with moves.
3. Ensure one-home-per-fact after migration.
4. Preserve Git history through moves where possible.
5. Create `_archive/` only for superseded content, never as a dumping ground.
6. Run cold-walk after migration.
7. Run full-stack wiring audit after interface paths change.
8. Keep `main` rollbackable through a single PR revert.

## Human decision required
Approve this map before existing files are moved. Changes to the split between Pauli Brand Studio and PAULI'S PLACE should be decided before relocating `studio/PAULIS_PLACE.md`.
