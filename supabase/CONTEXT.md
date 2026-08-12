# Supabase context

Status: **Phase 3 migration and browser integration are implemented on the ZTE branch; no Brand Studio production schema has been applied.**

Supabase is the cloud operational layer for identity, tenancy, sessions, jobs, approvals, sync metadata and artifact indexes. It is not the editable source of brand truth.

## Connected project
- Project: `botanic-creations`
- Project ref: `cyxdevcjycmffhmwxojh`
- Region: `us-west-1`
- Shared infrastructure: yes
- Existing `brand_studio_*` production tables: none at Phase 3 start
- Existing Supabase development branches: none at Phase 3 start

## Phase 3 schema
All new tables are namespaced to avoid collisions with other systems using the shared database:
- `brand_studio_organizations`
- `brand_studio_memberships`
- `brand_studio_projects`
- `brand_studio_sessions`
- `brand_studio_work_orders`
- `brand_studio_job_runs`
- `brand_studio_approvals`
- `brand_studio_artifact_index`
- `brand_studio_sync_state`
- `brand_studio_activity_events`

Migration source:
- `migrations/20260812_0004_brand_studio_operating_layer.sql`
- `migrations/20260812_0005_brand_studio_safety_guards.sql`

Rollback source:
- `rollback/20260812_0004_brand_studio_operating_layer.sql`

Isolation/security test source:
- `tests/brand_studio_rls.sql`

## Ownership
Supabase owns:
- authentication and memberships;
- tenant/project operational indexes;
- web sessions and normalized work-order receipts;
- job-run state;
- append-only human approval decisions;
- append-only activity events;
- sync state and artifact metadata.

Supabase does **not** own:
- editable brand strategy;
- editable brand voice;
- protected creative decisions;
- the canonical brand manifest;
- the only copy of a deliverable.

Those remain approved, versioned ICM files + the project manifest.

## Browser contract
`apps/web` may receive only:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Never expose a secret key or service-role credential to the browser. RLS is the authorization boundary for authenticated browser writes.

## Law
- Every tenant-scoped table requires RLS and cross-tenant isolation tests.
- Approval and activity ledgers are append-only to authenticated clients.
- A `needs_approval` work order cannot become `completed` without an immutable `approved` decision record.
- The final active owner of an organization cannot be removed or demoted.
- Browser deletion of organizations is not granted.
- No secrets are stored in project files or client-readable rows.
- Database migrations are reviewed on an isolated development branch before production application.
- Production database and production deployment changes remain separately approval-gated.
