begin;

grant usage on schema brand_studio_private to authenticated;

create or replace function brand_studio_private.rpc_create_organization(p_name text)
returns table(id uuid, name text, role text)
language plpgsql security definer
set search_path = pg_catalog, brand_studio
as $$
declare v_user uuid:=auth.uid(); v_org uuid;
begin
 if v_user is null then raise exception 'authentication required'; end if;
 if char_length(trim(coalesce(p_name,'')))=0 then raise exception 'organization name required'; end if;
 insert into brand_studio.organizations(name,created_by) values(trim(p_name),v_user) returning organizations.id into v_org;
 insert into brand_studio.memberships(organization_id,user_id,role,status) values(v_org,v_user,'owner','active');
 insert into brand_studio.activity_events(organization_id,actor_user_id,event_type,entity_type,entity_id) values(v_org,v_user,'organization.created','organization',v_org);
 return query select v_org,trim(p_name),'owner'::text;
end $$;

create or replace function brand_studio_private.rpc_list_organizations()
returns table(id uuid, name text, role text)
language sql stable security definer
set search_path = pg_catalog, brand_studio
as $$
 select o.id,o.name,m.role from brand_studio.organizations o join brand_studio.memberships m on m.organization_id=o.id
 where m.user_id=auth.uid() and m.status='active' order by o.created_at
$$;

create or replace function brand_studio_private.rpc_create_project(p_organization_id uuid,p_name text,p_icm_path text default null)
returns table(id uuid, organization_id uuid, name text, icm_path text, status text)
language plpgsql security definer
set search_path = pg_catalog, brand_studio, brand_studio_private
as $$
declare v_user uuid:=auth.uid(); v_project uuid;
begin
 if v_user is null then raise exception 'authentication required'; end if;
 if not brand_studio_private.has_role(p_organization_id,array['owner','admin','editor']) then raise exception 'insufficient role'; end if;
 insert into brand_studio.projects(organization_id,name,icm_path,created_by) values(p_organization_id,trim(p_name),nullif(trim(coalesce(p_icm_path,'')),''),v_user) returning projects.id into v_project;
 insert into brand_studio.activity_events(organization_id,project_id,actor_user_id,event_type,entity_type,entity_id) values(p_organization_id,v_project,v_user,'project.created','project',v_project);
 return query select p.id,p.organization_id,p.name,p.icm_path,p.status from brand_studio.projects p where p.id=v_project;
end $$;

create or replace function brand_studio_private.rpc_list_projects(p_organization_id uuid)
returns table(id uuid, organization_id uuid, name text, icm_path text, status text)
language sql stable security definer
set search_path = pg_catalog, brand_studio, brand_studio_private
as $$
 select p.id,p.organization_id,p.name,p.icm_path,p.status from brand_studio.projects p
 where p.organization_id=p_organization_id and brand_studio_private.is_member(p_organization_id) order by p.created_at
$$;

create or replace function brand_studio_private.rpc_create_work_order(p_organization_id uuid,p_project_id uuid,p_intent text,p_idempotency_key text default null,p_requires_approval boolean default false)
returns table(id uuid, organization_id uuid, project_id uuid, intent text, status text, requires_approval boolean, created_at timestamptz)
language plpgsql security definer
set search_path = pg_catalog, brand_studio, brand_studio_private
as $$
declare v_user uuid:=auth.uid(); v_id uuid;
begin
 if v_user is null then raise exception 'authentication required'; end if;
 if not brand_studio_private.has_role(p_organization_id,array['owner','admin','editor']) then raise exception 'insufficient role'; end if;
 if not exists(select 1 from brand_studio.projects p where p.id=p_project_id and p.organization_id=p_organization_id) then raise exception 'project does not belong to organization'; end if;
 insert into brand_studio.work_orders(organization_id,project_id,requested_by,intent,idempotency_key,requires_approval)
 values(p_organization_id,p_project_id,v_user,trim(p_intent),nullif(trim(coalesce(p_idempotency_key,'')),''),p_requires_approval)
 on conflict (organization_id,idempotency_key) where idempotency_key is not null do update set intent=excluded.intent
 returning work_orders.id into v_id;
 insert into brand_studio.activity_events(organization_id,project_id,actor_user_id,event_type,entity_type,entity_id) values(p_organization_id,p_project_id,v_user,'work_order.created','work_order',v_id);
 return query select w.id,w.organization_id,w.project_id,w.intent,w.status,w.requires_approval,w.created_at from brand_studio.work_orders w where w.id=v_id;
end $$;

create or replace function brand_studio_private.rpc_record_approval(p_work_order_id uuid,p_decision text,p_scope_hash text,p_note text default null)
returns uuid language plpgsql security definer
set search_path = pg_catalog, brand_studio, brand_studio_private
as $$
declare v_user uuid:=auth.uid(); v_org uuid; v_id uuid;
begin
 if v_user is null then raise exception 'authentication required'; end if;
 select organization_id into v_org from brand_studio.work_orders where id=p_work_order_id;
 if v_org is null then raise exception 'work order not found'; end if;
 if not brand_studio_private.has_role(v_org,array['owner','admin','reviewer']) then raise exception 'insufficient role'; end if;
 if p_decision not in ('requested','approved','rejected') then raise exception 'invalid decision'; end if;
 insert into brand_studio.approvals(organization_id,work_order_id,decision,scope_hash,note,decided_by) values(v_org,p_work_order_id,p_decision,p_scope_hash,p_note,v_user) returning id into v_id;
 return v_id;
end $$;

revoke all on function brand_studio_private.rpc_create_organization(text) from public, anon;
revoke all on function brand_studio_private.rpc_list_organizations() from public, anon;
revoke all on function brand_studio_private.rpc_create_project(uuid,text,text) from public, anon;
revoke all on function brand_studio_private.rpc_list_projects(uuid) from public, anon;
revoke all on function brand_studio_private.rpc_create_work_order(uuid,uuid,text,text,boolean) from public, anon;
revoke all on function brand_studio_private.rpc_record_approval(uuid,text,text,text) from public, anon;
grant execute on function brand_studio_private.rpc_create_organization(text) to authenticated;
grant execute on function brand_studio_private.rpc_list_organizations() to authenticated;
grant execute on function brand_studio_private.rpc_create_project(uuid,text,text) to authenticated;
grant execute on function brand_studio_private.rpc_list_projects(uuid) to authenticated;
grant execute on function brand_studio_private.rpc_create_work_order(uuid,uuid,text,text,boolean) to authenticated;
grant execute on function brand_studio_private.rpc_record_approval(uuid,text,text,text) to authenticated;

create or replace function public.brand_studio_create_organization(p_name text)
returns table(id uuid, name text, role text)
language sql security invoker
set search_path = pg_catalog, brand_studio_private
as $$ select * from brand_studio_private.rpc_create_organization(p_name) $$;
create or replace function public.brand_studio_list_organizations()
returns table(id uuid, name text, role text)
language sql stable security invoker
set search_path = pg_catalog, brand_studio_private
as $$ select * from brand_studio_private.rpc_list_organizations() $$;
create or replace function public.brand_studio_create_project(p_organization_id uuid,p_name text,p_icm_path text default null)
returns table(id uuid, organization_id uuid, name text, icm_path text, status text)
language sql security invoker
set search_path = pg_catalog, brand_studio_private
as $$ select * from brand_studio_private.rpc_create_project(p_organization_id,p_name,p_icm_path) $$;
create or replace function public.brand_studio_list_projects(p_organization_id uuid)
returns table(id uuid, organization_id uuid, name text, icm_path text, status text)
language sql stable security invoker
set search_path = pg_catalog, brand_studio_private
as $$ select * from brand_studio_private.rpc_list_projects(p_organization_id) $$;
create or replace function public.brand_studio_create_work_order(p_organization_id uuid,p_project_id uuid,p_intent text,p_idempotency_key text default null,p_requires_approval boolean default false)
returns table(id uuid, organization_id uuid, project_id uuid, intent text, status text, requires_approval boolean, created_at timestamptz)
language sql security invoker
set search_path = pg_catalog, brand_studio_private
as $$ select * from brand_studio_private.rpc_create_work_order(p_organization_id,p_project_id,p_intent,p_idempotency_key,p_requires_approval) $$;
create or replace function public.brand_studio_record_approval(p_work_order_id uuid,p_decision text,p_scope_hash text,p_note text default null)
returns uuid language sql security invoker
set search_path = pg_catalog, brand_studio_private
as $$ select brand_studio_private.rpc_record_approval(p_work_order_id,p_decision,p_scope_hash,p_note) $$;

revoke all on function public.brand_studio_create_organization(text) from public, anon;
revoke all on function public.brand_studio_list_organizations() from public, anon;
revoke all on function public.brand_studio_create_project(uuid,text,text) from public, anon;
revoke all on function public.brand_studio_list_projects(uuid) from public, anon;
revoke all on function public.brand_studio_create_work_order(uuid,uuid,text,text,boolean) from public, anon;
revoke all on function public.brand_studio_record_approval(uuid,text,text,text) from public, anon;
grant execute on function public.brand_studio_create_organization(text) to authenticated;
grant execute on function public.brand_studio_list_organizations() to authenticated;
grant execute on function public.brand_studio_create_project(uuid,text,text) to authenticated;
grant execute on function public.brand_studio_list_projects(uuid) to authenticated;
grant execute on function public.brand_studio_create_work_order(uuid,uuid,text,text,boolean) to authenticated;
grant execute on function public.brand_studio_record_approval(uuid,text,text,text) to authenticated;

commit;
