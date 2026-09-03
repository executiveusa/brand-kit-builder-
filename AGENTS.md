# AGENTS.md — Pauli Brand Studio router

This repository is the **design office** for The Pauli Effect. It turns briefs and source material into governed brand intelligence, design systems, visual assets, campaigns, product mockups, and delivery packages.

## Cold start — mandatory
1. Read `CONTEXT.md`.
2. Read `studio/CONTEXT.md`.
3. Read `studio/_system/contracts/ICM.md`.
4. Run the mental walk test in `studio/_system/governance/WALK_TEST.md`. If PURPOSE, OWNER, STAGE, READ SCOPE, WRITE SCOPE, REQUIRED SKILLS, REQUIRED OUTPUT, PASS BAR, PROOF, or NEXT HANDOFF is unknown, emit `WALK_TEST_FAIL` and stop before editing.
5. Read `studio/_system/skills/CONTEXT.md` and load only the skill(s) required by the current stage/work order.
6. For new identity creation or a material rebrand, read `studio/_system/contracts/CREATIVE_DIRECTION.md`, load `studio/_system/skills/creative-direction/SKILL.md`, and execute `creative-direction.v1` inside the existing ICM stages.
7. Read `studio/_system/governance/CONSOLIDATION.md` only when factory-wide context is required.
8. Read only the contract/reference for the area you are working in. Do not crawl the whole repo unless performing an explicit audit.

## Route by task
| Need | Go to |
|---|---|
| Brand/project intake | `studio/_system/contracts/ICM.md` → `studio/projects/<tenant>/<project>/00_intake/` → `brand-discovery` |
| Strategy / positioning / voice | project `10_strategy/` |
| Governing idea / territories / distinctiveness | `CREATIVE_DIRECTION.md` → `creative-direction` + `collins-level` judgment lens |
| Logo / type / color / imagery / templates / mockups | project `20_design/` after recorded territory approval |
| Brand behavior grammar / application stress test | `CREATIVE_DIRECTION.md` → project `20_design/` → `creative-direction` |
| Commercial desirability | project `30_validate/commercial-desirability.json`; critic must be independent from builder |
| Pre-validation design review | `studio/_system/skills/design-guardian/SKILL.md` |
| Independent review / proof | project `30_validate/` + `studio/_system/guardians/GUARDIANS.md` + `gauntlet` + `design-proof` |
| Brand book / social / asset pack / handoff | project `40_deliver/` + `design-delivery` |
| Publishing / productization | project `50_publish/` + `studio/_shared/publish/PAULIS_PLACE.md` |
| Factory roles | `studio/_system/contracts/FACTORY.md` |
| Model routing | `studio/_system/routing/AUTO_ROUTER.md` |
| Machine quality thresholds | `studio/_system/governance/DESIGN_STANDARD.json` |
| Canonical schemas | `studio/_system/schemas/` |
| Workflow registry | `studio/_system/workflows/registry.v1.json` |
| KAKU brand-book sequence | `studio/_shared/brand-book/KAKU_BRAND_BOOK_TEMPLATE.md` |
| Typography / DARYA | `studio/_shared/design-systems/type/DARYA_FONT_REGISTRY.md` |
| REST API contract | `interfaces/rest/API.md` |
| Other agent doors | `interfaces/CONTEXT.md` |
| Human interface | `apps/web/CONTEXT.md` |
| Portability / USB / local-cloud ownership | `docs/architecture/PORTABILITY_CONTRACT.md` |
| Architecture migration | `docs/architecture/TARGET_TREE.md` + `docs/architecture/MIGRATION_MAP.md` |

## Five creative-direction layers — do not skip or reorder
1. `Governing Idea Gate` in `10_strategy` — score >= 9.0.
2. `Distinctiveness Test` in `10_strategy` — selected territory must be `OWNABLE`, score >= 9.0.
3. `Brand Behavior Grammar` in `20_design` — system coherence >= 9.0.
4. `Application Stress Test` in `20_design` — representative surfaces + responsive proof, >= 9.0.
5. `Commercial Desirability Judge` in `30_validate` — independent score >= 9.0.

Between layers 2 and 3, an authorized human must select the territory. The builder cannot approve that decision.

## Laws
- ICM files and approved manifests are portable brand truth.
- Agents propose; humans/authorized gates commit canonical truth.
- One folder, one job. One home per fact. Link instead of copy.
- Builder and final critic/approver must be separate roles. Builders cannot self-approve.
- No identity production before governing idea + `OWNABLE` distinctiveness + human territory selection.
- Design release candidates must pass commercial desirability, Design Guardian, Gauntlet, and Proof according to `DESIGN_STANDARD.json` before delivery.
- Failed validation returns a bounded repair packet to the owning ICM stage; critics do not silently fix creator work.
- External studios are reference lenses only. Never copy their visual style, layouts, assets, copy, or proprietary work.
- Legacy files may remain only as compatibility pointers after a migrated fact has a canonical home.
- Supabase may index/sync cloud operations; it does not replace portable brand intelligence.
- UI promises must trace to a tested backend path before being labeled live.
- No secrets in repo, logs, prompts, screenshots, or portable exports.
- No production deploy without explicit owner approval.
- No evidence, no completion claim.
