# Design — Brand Studio Cloud Phase 3

## Data boundary
ICM files + approved manifest remain canonical. Supabase stores operational references only.

## Tables
Organizations → memberships → projects → sessions/work orders → job runs/approvals/artifact index/sync/activity.

## Authorization
- Authenticated creator may create an organization.
- Organization creation bootstraps creator as owner.
- Active members may read tenant data.
- Owners/admins manage membership.
- Owners/admins/editors may create/update operational project/work-order data.
- Viewers remain read-only.
- Browser organization deletion is not granted.
- Last active owner cannot be removed or demoted.
- Approvals and activity events are append-only to authenticated clients.

## Work-order state machine
`queued → planned|running|failed|canceled`
`planned → running|needs_approval|failed|canceled`
`running → needs_approval|completed|failed|canceled`
`needs_approval → planned|running|completed|failed|canceled`

`needs_approval → completed` additionally requires an immutable approved decision record for that work order.

## Browser experience
Cloud controls remain secondary to the outcome composer. With no environment configuration, the UI explicitly says cloud is not configured and performs no persistence. With configuration, the user can sign in by email, select/create workspace and project, then queue the composed outcome.

## Secrets
Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` may enter browser builds. Secret/service-role credentials are forbidden.

## Responsive/accessibility
Native form controls, visible labels, focus inherited from Phase 2 shell, mobile single-column fallback, status/error live regions, no cloud requirement for viewing the public shell.
