# Supabase context

Status: **architecture only — no Brand Studio production schema has been applied in this phase.**

Supabase is the cloud operational layer for identity, tenancy, sessions, jobs, approvals, sync metadata and optional artifact indexes. It is not the editable source of brand truth.

## Planned ownership
- authentication and memberships;
- tenant/project operational indexes;
- job/session/approval state;
- sync state and artifact metadata;
- optional object-storage mirror.

## Law
- Approved ICM files + versioned brand manifest remain canonical brand intelligence.
- Every tenant-scoped table requires RLS and cross-tenant isolation tests.
- No secrets are stored in project files or client-readable rows.
- Database migrations are reviewed before application and production changes remain separately approval-gated.
