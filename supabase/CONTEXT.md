# Supabase context

Status: **Phase 3 Brand Studio domain is applied to Botanic Creations under dedicated isolated schemas.**

Supabase is the cloud operational layer for identity, tenancy, sessions, jobs, approvals, sync metadata and artifact indexes. It is not the editable source of brand truth.

## Connected project
- Project: `botanic-creations`
- Project ref: `cyxdevcjycmffhmwxojh`
- Region: `us-west-1`
- Shared infrastructure: yes
- Brand Studio domain: `brand_studio`
- Private implementation domain: `brand_studio_private`
- Direct browser table access: **denied**

## Phase 3 data domain
Tables live only inside `brand_studio`:
- `organizations`
- `memberships`
- `projects`
- `sessions`
- `work_orders`
- `job_runs`
- `approvals`
- `artifact_index`
- `sync_state`
- `activity_events`

Migration sources:
- `migrations/20260812_0004_brand_studio_operating_layer.sql` — deprecated no-op from the superseded public-table design.
- `migrations/20260812_0005_brand_studio_isolated_schema.sql` — isolated schemas, tables, RLS, guards and RPC boundary.
- `migrations/20260812_0006_brand_studio_rpc_hardening.sql` — public SECURITY INVOKER façade over unexposed private implementations.
- `migrations/20260812_0007_brand_studio_performance_hardening.sql` — FK indexes and RLS planner improvements.

Rollback source:
- `rollback/20260812_0004_brand_studio_operating_layer.sql`

## Browser API
The browser can call only these authenticated public RPCs:
- `brand_studio_create_organization`
- `brand_studio_list_organizations`
- `brand_studio_create_project`
- `brand_studio_list_projects`
- `brand_studio_create_work_order`
- `brand_studio_record_approval`

The public wrappers are SECURITY INVOKER. Elevated implementation functions live in `brand_studio_private`, which is not part of the exposed REST schema. Anonymous execution is revoked.

## Guardrails proved
- RLS is enabled and forced on every Brand Studio table.
- `authenticated` has no direct usage on `brand_studio`.
- anonymous users cannot execute Brand Studio RPCs.
- tenant A cannot read tenant B organizations or projects.
- the last active owner cannot be removed/demoted.
- approval-gated work cannot complete before an approved decision exists.
- approvals and activity events are append-only.
- no test tenant/user/work-order rows remain after the transaction-scoped verification suite.
- Supabase security advisor reports no Brand Studio-specific warnings.
- performance advisor reports no Brand Studio unindexed-FK/auth-initplan/duplicate-policy warnings; new unused-index INFO is expected until traffic exists.

## Ownership
Supabase owns operational indexes and state only: authentication, memberships, sessions, work-order/job status, approvals, activity, sync metadata and artifact references.

Supabase does **not** own editable strategy, voice, protected creative decisions, canonical manifests, or the only copy of a deliverable. Those remain approved/versioned ICM files.

## Browser configuration
`apps/web` may receive only:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Never expose a secret/service-role credential to the browser.

## Law
- One tenant cannot observe or mutate another tenant.
- No adapter or cloud table replaces ICM brand truth.
- Consequential state transitions require the correct role and approval evidence.
- No secrets in repo, browser rows, logs or portable exports.
- Schema rollback must target only the Brand Studio domain.
- Vercel production deployment remains a separate explicit approval gate.
