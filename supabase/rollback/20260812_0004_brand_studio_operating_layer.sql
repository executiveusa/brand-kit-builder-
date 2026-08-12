begin;

-- Roll back only objects introduced by 20260812_0004_brand_studio_operating_layer.
-- Existing shared botanic-creations tables are intentionally untouched.

drop table if exists public.brand_studio_activity_events cascade;
drop table if exists public.brand_studio_sync_state cascade;
drop table if exists public.brand_studio_artifact_index cascade;
drop table if exists public.brand_studio_approvals cascade;
drop table if exists public.brand_studio_job_runs cascade;
drop table if exists public.brand_studio_work_orders cascade;
drop table if exists public.brand_studio_sessions cascade;
drop table if exists public.brand_studio_projects cascade;
drop table if exists public.brand_studio_memberships cascade;
drop table if exists public.brand_studio_organizations cascade;

drop function if exists public.brand_studio_validate_work_order_transition() cascade;
drop function if exists public.brand_studio_preserve_last_owner() cascade;
drop function if exists public.brand_studio_is_owner(uuid) cascade;
drop function if exists public.brand_studio_can_admin(uuid) cascade;
drop function if exists public.brand_studio_can_write(uuid) cascade;
drop function if exists public.brand_studio_member_role(uuid) cascade;
drop function if exists public.brand_studio_is_member(uuid) cascade;
drop function if exists public.brand_studio_bootstrap_owner() cascade;
drop function if exists public.brand_studio_set_updated_at() cascade;

commit;
