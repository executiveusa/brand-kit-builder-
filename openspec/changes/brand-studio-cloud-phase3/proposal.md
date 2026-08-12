# Proposal — Brand Studio Cloud Phase 3

## Problem
POLISH has a verified human-facing shell but no durable identity, tenancy, project, session, work-order or approval state.

## Outcome
Add a namespaced, tenant-safe Supabase operating layer while preserving approved ICM files + manifest as canonical brand truth.

## Scope
- Supabase Auth-backed membership model.
- `brand_studio_*` operational tables with RLS.
- Append-only approval/activity ledgers.
- Validated work-order status transitions.
- Browser client using URL + publishable key only.
- Progressive cloud UI for sign-in, workspace/project creation and work-order queueing.

## Out of scope
- Factory execution.
- Popebot/MCP/CLI adapters.
- Production deployment.
- Production database mutation without explicit approval.
- Moving canonical brand strategy/voice/design into database rows.

## Protected items
- Existing Phase 2 layout intent and outcome-first composer.
- ICM canonical ownership law.
- Shared non-Brand-Studio Supabase tables.
- Secrets and service-role credentials.

## File allowlist
- `supabase/**`
- `apps/web/**`
- `CONTEXT.md`
- `ops/reports/**`
- `openspec/changes/brand-studio-cloud-phase3/**`

## Rollback
- Application: revert Phase 3 PR.
- Database: `supabase/rollback/20260812_0004_brand_studio_operating_layer.sql` on the exact target that received the migrations.

## Evidence
- GitHub Actions build/lint/Playwright.
- Supabase development-branch migration + RLS test run before production.
- Supabase security/performance advisors after DDL.
