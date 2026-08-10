# AGENTS.md — Pauli Brand Studio router

This repository is the **design office** for The Pauli Effect. It turns briefs and source material into governed brand intelligence, design systems, visual assets, campaigns, product mockups, and delivery packages.

## Cold start
1. Read `CONTEXT.md`.
2. Read `studio/CONSOLIDATION.md` for current factory truth.
3. Read only the contract for the area you are working in.
4. Do not crawl the whole repo unless performing an explicit audit.

## Route by task
| Need | Go to |
|---|---|
| Brand/project intake | `studio/ICM.md` → project `00_intake/` |
| Strategy / positioning / voice | project `10_strategy/` |
| Logo / type / color / imagery / templates / mockups | project `20_design/` |
| Independent review / proof | project `30_validate/` |
| Brand book / social / asset pack / handoff | project `40_deliver/` |
| Publishing / productization | project `50_publish/` |
| Factory roles | `studio/FACTORY.md` |
| API contract | `studio/API.md` |
| Human interface | `apps/web/CONTEXT.md` |
| Portability / USB / local-cloud ownership | `docs/architecture/PORTABILITY_CONTRACT.md` |
| Architecture migration | `docs/architecture/TARGET_TREE.md` + `MIGRATION_MAP.md` |

## Laws
- ICM files and approved manifests are portable brand truth.
- Agents propose; humans/authorized gates commit canonical truth.
- One folder, one job. One home per fact. Link instead of copy.
- Never move/delete brownfield files without an approved migration map.
- Supabase may index/sync cloud operations; it does not replace portable brand intelligence.
- UI promises must trace to a tested backend path before being labeled live.
- No secrets in repo, logs, prompts, screenshots, or portable exports.
- No production deploy without explicit owner approval.
- No evidence, no completion claim.
