# Acceptance — Brand Studio Cloud Phase 3

## Web
- Production build passes.
- ESLint passes.
- Playwright passes at 1440/768/390.
- No horizontal overflow.
- Existing outcome composer remains primary and functional.
- With no cloud environment values, UI says `Not configured` and makes no persistence claim.
- No console/page errors in the offline build.
- Keyboard focus and reduced-motion tests remain green.

## Database
- All `brand_studio_*` base tables have RLS enabled.
- Tenant B cannot read Tenant A projects.
- Tenant B cannot insert Tenant A work orders.
- Organization creator is bootstrapped as active owner.
- Final active owner cannot be removed/demoted.
- Approval/activity rows are append-only for authenticated clients.
- Invalid work-order state jumps fail.
- `needs_approval → completed` fails without an approved decision.
- Browser role cannot delete organizations.
- No existing non-Brand-Studio table is modified.

## Security
- Browser configuration uses project URL + publishable key only.
- No service-role/secret key in repo, frontend, test output or screenshots.
- Supabase security advisor has no unresolved Brand Studio P0/P1 finding.

## Rollback
- Database rollback drops only `brand_studio_*` objects and supporting functions.
- Application rollback is a clean PR revert.

## Gate
Phase 3 may merge when web + isolated development-branch database evidence passes and audit quality is at least 8.5/10. Production DDL remains separately approval-gated.
