# CONTEXT — Pauli Brand Studio

## Purpose
This repository is a governed design office. Humans and agents bring an outcome here; the studio converts it into portable brand intelligence and production-ready design assets before downstream production systems consume them.

## Factory vs product
- **Factory:** stable laws, schemas, skills, templates, guardians, adapters, and interface contracts.
- **Product:** one tenant/project run, stored as an ICM workspace with editable stage outputs.
- **Renderings:** websites, brand books, social templates, mockups, print/POD art, decks, games, puzzles, packaging, and other surfaces generated from approved brand truth.

## Core pipeline
`00_intake → 10_strategy → 20_design → 30_validate → 40_deliver → 50_publish`

Existing detailed stage law remains in `studio/ICM.md` until the migration map is approved and executed.

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

No adapter owns business truth. Adapters translate into work orders/context packets and return receipts.

## Canonical ownership
| Domain | Canonical owner |
|---|---|
| Brand intelligence | approved versioned ICM files + brand manifest |
| Factory law | this repository |
| Cloud identities / memberships | Supabase Auth + RLS tables |
| Cloud job/session/approval indexes | Supabase operational state |
| Cloud asset mirror | Supabase Storage or configured provider; never the only copy for portable deliverables |
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

## Current work
Read `ops/reports/plans/ZTE-20260810-0001.md` for the active brownfield reorganization slice.
