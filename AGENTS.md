# AGENTS.md — Pauli Brand Studio router

This repository is the **design office** for The Pauli Effect. It turns briefs and source material into governed brand intelligence, design systems, visual assets, campaigns, product mockups, and delivery packages.

## Cold start
1. Read `CONTEXT.md`.
2. Read `studio/CONTEXT.md`.
3. Read `studio/_system/governance/CONSOLIDATION.md` only when factory-wide context is required.
4. Read only the contract/reference for the area you are working in.
5. Do not crawl the whole repo unless performing an explicit audit.

## Route by task
| Need | Go to |
|---|---|
| Brand/project intake | `studio/_system/contracts/ICM.md` → `studio/projects/<tenant>/<project>/00_intake/` |
| Strategy / positioning / voice | project `10_strategy/` |
| Logo / type / color / imagery / templates / mockups | project `20_design/` |
| Independent review / proof | project `30_validate/` + `studio/_system/guardians/GUARDIANS.md` |
| Brand book / social / asset pack / handoff | project `40_deliver/` |
| Publishing / productization | project `50_publish/` + `studio/_shared/publish/PAULIS_PLACE.md` |
| Factory roles | `studio/_system/contracts/FACTORY.md` |
| Model routing | `studio/_system/routing/AUTO_ROUTER.md` |
| Canonical schemas | `studio/_system/schemas/` |
| KAKU brand-book sequence | `studio/_shared/brand-book/KAKU_BRAND_BOOK_TEMPLATE.md` |
| Typography / DARYA | `studio/_shared/design-systems/type/DARYA_FONT_REGISTRY.md` |
| REST API contract | `interfaces/rest/API.md` |
| Other agent doors | `interfaces/CONTEXT.md` |
| Human interface | `apps/web/CONTEXT.md` |
| Portability / USB / local-cloud ownership | `docs/architecture/PORTABILITY_CONTRACT.md` |
| Architecture migration | `docs/architecture/TARGET_TREE.md` + `docs/architecture/MIGRATION_MAP.md` |

## Laws
- ICM files and approved manifests are portable brand truth.
- Agents propose; humans/authorized gates commit canonical truth.
- One folder, one job. One home per fact. Link instead of copy.
- Legacy files may remain only as compatibility pointers after a migrated fact has a canonical home.
- Supabase may index/sync cloud operations; it does not replace portable brand intelligence.
- UI promises must trace to a tested backend path before being labeled live.
- No secrets in repo, logs, prompts, screenshots, or portable exports.
- No production deploy without explicit owner approval.
- No evidence, no completion claim.
