# Studio context — Pauli Brand Studio

## Purpose
This folder is the design office. It separates **factory law**, **shared creative intelligence**, **project work**, and **templates** so agents can cold-start without crawling the repository.

## Read order
1. `../CONTEXT.md`
2. `./_system/governance/CONSOLIDATION.md`
3. Only the contract/reference required for the current task

## Routes
- Factory stages + ICM law → `_system/contracts/ICM.md`
- Worker roles/pipeline → `_system/contracts/FACTORY.md`
- Model routing → `_system/routing/AUTO_ROUTER.md`
- Independent release checks → `_system/guardians/GUARDIANS.md`
- Canonical schemas → `_system/schemas/`
- Brand-book sequence → `_shared/brand-book/KAKU_BRAND_BOOK_TEMPLATE.md`
- Typography intelligence → `_shared/design-systems/type/DARYA_FONT_REGISTRY.md`
- REST interface → `../interfaces/rest/API.md`
- Human interface → `../apps/web/CONTEXT.md`

## Folder law
- `_system/` = how the factory operates.
- `_shared/` = reusable creative intelligence available to every tenant.
- `_templates/` = blank project structures and repeatable project starters.
- `projects/` = tenant-sealed brand work.
- A project fact has one canonical home; other locations may only point to it.
- No secret material belongs in this tree.

## Current migration state
Phase 1 is actively converting legacy root/studio paths into this structure. Legacy locations may remain as pointer stubs until the migration PR is verified and merged.
