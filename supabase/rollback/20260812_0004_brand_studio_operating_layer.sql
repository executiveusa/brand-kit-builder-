begin;

-- Destructive rollback for the Brand Studio domain only.
-- Apply only when explicitly rolling back Phase 3 on the exact database that received it.
-- No pre-existing Botanic Creations schema/table/function is targeted here.

drop function if exists public.brand_studio_record_approval(uuid,text,text,text);
drop function if exists public.brand_studio_create_work_order(uuid,uuid,text,text,boolean);
drop function if exists public.brand_studio_list_projects(uuid);
drop function if exists public.brand_studio_create_project(uuid,text,text);
drop function if exists public.brand_studio_list_organizations();
drop function if exists public.brand_studio_create_organization(text);

drop schema if exists brand_studio_private cascade;
drop schema if exists brand_studio cascade;

commit;
