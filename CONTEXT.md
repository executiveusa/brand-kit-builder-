# CONTEXT — Pauli Brand Studio

## Purpose
This repository is a governed design office. Humans and agents bring an outcome here; the studio converts it into portable brand intelligence and production-ready design assets before downstream production systems consume them.

## Factory vs product
- **Factory:** stable laws, schemas, skills, templates, guardians, adapters, and interface contracts under `studio/_system/`, `studio/_shared/`, `interfaces/`, and `apps/`.
- **Product:** one tenant/project run under `studio/projects/<tenant>/<project>/` using the ICM stage contract.
- **Renderings:** websites, brand books, social templates, mockups, print/POD art, decks, games, puzzles, packaging, and other surfaces generated from approved brand truth.

## Core pipeline
`00_intake → 10_strategy → 20_design → 30_validate → 40_deliver → 50_publish`

Canonical stage law: `studio/_system/contracts/ICM.md`.

## Human surface
`apps/web/` is the design-office front door. The default interaction is outcome-first conversation. Configuration, model choice, provider details, and workflow machinery stay behind progressive disclosure.

## Agent surfaces
All agent interfaces must compile to the same contracts:
- REST
- MCP
- CLI
- local folder drop / watcher
- cloud job
- portable USB workspace

Interface routing begins at `interfaces/CONTEXT.md`. No adapter owns business truth. Adapters translate into work orders/context packets and return receipts.

## Canonical ownership
| Domain | Canonical owner |
|---|---|
| Brand intelligence | approved versioned ICM files + brand manifest |
| Factory law | `studio/_system/` |
| Shared creative intelligence | `studio/_shared/` |
| Cloud identities / memberships | Supabase Auth + Brand Studio isolated RLS domain |
| Cloud job/session/approval indexes | Supabase operational state |
| Cloud asset mirror | configured object storage; never the only copy for portable deliverables |
| Source code history | Git |
| Production deployment | Vercel project/deployment state |
| Secrets | secret manager / deployment secret store; never ICM export |

## Current human gates
1. Start / source-of-truth confirmation.
2. Canonical brand decision approvals when required.
3. Final package approval.
4. Production deployment approval.

## Quality
- Strategy before styling.
- Proof before claim.
- Separate builder and critic.
- No fake metrics, testimonials, backend states, or success UI.
- Brand-specific design, not generic SaaS decoration.
- Accessibility, mobile, reduced motion, rights, provenance, rollback, and owner control are release requirements.

## Current state
Phases 0–3 are implemented. Phase 3 created the authorized `brand_studio` + `brand_studio_private` domains inside Botanic Creations with forced RLS, RPC-only browser access, tenant-isolation proof, approval/owner guards, rollback and green web CI.

Canonical brand truth still lives in ICM; Supabase stores operational cloud state only.

## Next work
Phase 4: make REST, MCP, CLI, folder-drop, Popebot and local callers normalize into the same request/work-order/receipt contracts. Read `interfaces/CONTEXT.md` first.

Production Vercel deployment remains separately approval-gated.
