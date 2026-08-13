begin;

create schema if not exists brand_studio;
create schema if not exists brand_studio_private;

revoke all on schema brand_studio from public, anon, authenticated;
revoke all on schema brand_studio_private from public, anon, authenticated;

grant usage on schema brand_studio to service_role;
grant usage on schema brand_studio_private to service_role;

create table brand_studio.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 160),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table brand_studio.memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references brand_studio.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','editor','reviewer','viewer')),
  status text not null default 'active' check (status in ('active','invited','suspended','revoked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table brand_studio.projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references brand_studio.organizations(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 180),
  icm_path text,
  status text not null default 'active' check (status in ('active','paused','archived')),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table brand_studio.sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references brand_studio.organizations(id) on delete cascade,
  project_id uuid references brand_studio.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check (status in ('active','closed','expired')),
  started_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  ended_at timestamptz,
  constraint brand_studio_session_project_same_org check (project_id is not null or organization_id is not null)
);

create table brand_studio.work_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references brand_studio.organizations(id) on delete cascade,
  project_id uuid not null references brand_studio.projects(id) on delete cascade,
  session_id uuid references brand_studio.sessions(id) on delete set null,
  requested_by uuid not null references auth.users(id) on delete restrict,
  intent text not null check (char_length(trim(intent)) between 1 and 8000),
  status text not null default 'queued' check (status in ('queued','planned','running','needs_approval','completed','failed','canceled')),
  requires_approval boolean not null default false,
  idempotency_key text,
  input jsonb not null default '{}'::jsonb check (jsonb_typeof(input) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index brand_studio_work_orders_idempotency_uq
  on brand_studio.work_orders (organization_id, idempotency_key)
  where idempotency_key is not null;

create table brand_studio.job_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references brand_studio.organizations(id) on delete cascade,
  work_order_id uuid not null references brand_studio.work_orders(id) on delete cascade,
  provider text,
  status text not null default 'queued' check (status in ('queued','running','completed','failed','canceled')),
  attempt integer not null default 1 check (attempt > 0),
  error_code text,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table brand_studio.approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references brand_studio.organizations(id) on delete cascade,
  work_order_id uuid not null references brand_studio.work_orders(id) on delete cascade,
  decision text not null check (decision in ('requested','approved','rejected')),
  scope_hash text not null check (char_length(scope_hash) between 8 and 256),
  note text,
  decided_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);
create index brand_studio_approvals_work_order_idx on brand_studio.approvals(work_order_id, created_at desc);

create table brand_studio.artifact_index (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references brand_studio.organizations(id) on delete cascade,
  project_id uuid not null references brand_studio.projects(id) on delete cascade,
  work_order_id uuid references brand_studio.work_orders(id) on delete set null,
  kind text not null,
  canonical_path text,
  content_hash text,
  storage_ref text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table brand_studio.sync_state (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references brand_studio.organizations(id) on delete cascade,
  project_id uuid not null references brand_studio.projects(id) on delete cascade,
  source text not null,
  cursor text,
  state_hash text,
  last_synced_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(project_id, source)
);

create table brand_studio.activity_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references brand_studio.organizations(id) on delete cascade,
  project_id uuid references brand_studio.projects(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now()
);

create index brand_studio_memberships_user_idx on brand_studio.memberships(user_id, organization_id);
create index brand_studio_projects_org_idx on brand_studio.projects(organization_id, created_at desc);
create index brand_studio_sessions_org_idx on brand_studio.sessions(organization_id, user_id, started_at desc);
create index brand_studio_work_orders_project_idx on brand_studio.work_orders(organization_id, project_id, created_at desc);
create index brand_studio_job_runs_order_idx on brand_studio.job_runs(organization_id, work_order_id, created_at desc);
create index brand_studio_artifact_project_idx on brand_studio.artifact_index(organization_id, project_id, created_at desc);
create index brand_studio_activity_org_idx on brand_studio.activity_events(organization_id, created_at desc);

create or replace function brand_studio_private.is_member(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, brand_studio
as $$
  select exists (
    select 1 from brand_studio.memberships m
    where m.organization_id = p_organization_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;

create or replace function brand_studio_private.has_role(p_organization_id uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, brand_studio
as $$
  select exists (
    select 1 from brand_studio.memberships m
    where m.organization_id = p_organization_id
      and m.user_id = auth.uid()
      and m.status = 'active'
      and m.role = any(p_roles)
  );
$$;

create or replace function brand_studio_private.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function brand_studio_private.prevent_mutation()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  raise exception 'append-only ledger: mutation denied';
end;
$$;

create or replace function brand_studio_private.preserve_last_owner()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, brand_studio
as $$
declare
  remaining integer;
begin
  if old.role = 'owner' and old.status = 'active' and (
    tg_op = 'DELETE' or new.role <> 'owner' or new.status <> 'active'
  ) then
    select count(*) into remaining from brand_studio.memberships m
      where m.organization_id = old.organization_id
        and m.id <> old.id
        and m.role = 'owner'
        and m.status = 'active';
    if remaining = 0 then
      raise exception 'organization must retain at least one active owner';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create or replace function brand_studio_private.validate_work_order()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, brand_studio
as $$
begin
  if old.organization_id <> new.organization_id or old.project_id <> new.project_id or old.requested_by <> new.requested_by then
    raise exception 'work order ownership fields are immutable';
  end if;

  if old.status <> new.status and not (
    (old.status = 'queued' and new.status in ('planned','running','failed','canceled')) or
    (old.status = 'planned' and new.status in ('running','needs_approval','failed','canceled')) or
    (old.status = 'running' and new.status in ('needs_approval','completed','failed','canceled')) or
    (old.status = 'needs_approval' and new.status in ('planned','running','completed','failed','canceled'))
  ) then
    raise exception 'invalid work order transition: % -> %', old.status, new.status;
  end if;

  if new.status = 'completed' and new.requires_approval and not exists (
    select 1 from brand_studio.approvals a
    where a.work_order_id = new.id and a.decision = 'approved'
  ) then
    raise exception 'approval required before completion';
  end if;

  return new;
end;
$$;

create trigger brand_studio_org_updated before update on brand_studio.organizations
for each row execute function brand_studio_private.set_updated_at();
create trigger brand_studio_membership_updated before update on brand_studio.memberships
for each row execute function brand_studio_private.set_updated_at();
create trigger brand_studio_project_updated before update on brand_studio.projects
for each row execute function brand_studio_private.set_updated_at();
create trigger brand_studio_work_order_updated before update on brand_studio.work_orders
for each row execute function brand_studio_private.set_updated_at();
create trigger brand_studio_artifact_updated before update on brand_studio.artifact_index
for each row execute function brand_studio_private.set_updated_at();
create trigger brand_studio_sync_updated before update on brand_studio.sync_state
for each row execute function brand_studio_private.set_updated_at();
create trigger brand_studio_last_owner before update or delete on brand_studio.memberships
for each row execute function brand_studio_private.preserve_last_owner();
create trigger brand_studio_work_order_guard before update on brand_studio.work_orders
for each row execute function brand_studio_private.validate_work_order();
create trigger brand_studio_approval_immutable before update or delete on brand_studio.approvals
for each row execute function brand_studio_private.prevent_mutation();
create trigger brand_studio_activity_immutable before update or delete on brand_studio.activity_events
for each row execute function brand_studio_private.prevent_mutation();

alter table brand_studio.organizations enable row level security;
alter table brand_studio.organizations force row level security;
alter table brand_studio.memberships enable row level security;
alter table brand_studio.memberships force row level security;
alter table brand_studio.projects enable row level security;
alter table brand_studio.projects force row level security;
alter table brand_studio.sessions enable row level security;
alter table brand_studio.sessions force row level security;
alter table brand_studio.work_orders enable row level security;
alter table brand_studio.work_orders force row level security;
alter table brand_studio.job_runs enable row level security;
alter table brand_studio.job_runs force row level security;
alter table brand_studio.approvals enable row level security;
alter table brand_studio.approvals force row level security;
alter table brand_studio.artifact_index enable row level security;
alter table brand_studio.artifact_index force row level security;
alter table brand_studio.sync_state enable row level security;
alter table brand_studio.sync_state force row level security;
alter table brand_studio.activity_events enable row level security;
alter table brand_studio.activity_events force row level security;

create policy organizations_select on brand_studio.organizations for select to authenticated
using (brand_studio_private.is_member(id));
create policy organizations_update on brand_studio.organizations for update to authenticated
using (brand_studio_private.has_role(id, array['owner','admin']))
with check (brand_studio_private.has_role(id, array['owner','admin']));

create policy memberships_select on brand_studio.memberships for select to authenticated
using (brand_studio_private.is_member(organization_id));
create policy memberships_insert on brand_studio.memberships for insert to authenticated
with check (brand_studio_private.has_role(organization_id, array['owner','admin']));
create policy memberships_update on brand_studio.memberships for update to authenticated
using (brand_studio_private.has_role(organization_id, array['owner','admin']))
with check (brand_studio_private.has_role(organization_id, array['owner','admin']));
create policy memberships_delete on brand_studio.memberships for delete to authenticated
using (brand_studio_private.has_role(organization_id, array['owner','admin']));

create policy projects_select on brand_studio.projects for select to authenticated
using (brand_studio_private.is_member(organization_id));
create policy projects_insert on brand_studio.projects for insert to authenticated
with check (brand_studio_private.has_role(organization_id, array['owner','admin','editor']));
create policy projects_update on brand_studio.projects for update to authenticated
using (brand_studio_private.has_role(organization_id, array['owner','admin','editor']))
with check (brand_studio_private.has_role(organization_id, array['owner','admin','editor']));
create policy projects_delete on brand_studio.projects for delete to authenticated
using (brand_studio_private.has_role(organization_id, array['owner','admin']));

create policy sessions_select on brand_studio.sessions for select to authenticated
using (brand_studio_private.is_member(organization_id));
create policy sessions_insert on brand_studio.sessions for insert to authenticated
with check (brand_studio_private.is_member(organization_id) and user_id = auth.uid());
create policy sessions_update on brand_studio.sessions for update to authenticated
using (brand_studio_private.is_member(organization_id) and user_id = auth.uid())
with check (brand_studio_private.is_member(organization_id) and user_id = auth.uid());

create policy work_orders_select on brand_studio.work_orders for select to authenticated
using (brand_studio_private.is_member(organization_id));
create policy work_orders_insert on brand_studio.work_orders for insert to authenticated
with check (brand_studio_private.has_role(organization_id, array['owner','admin','editor']) and requested_by = auth.uid());
create policy work_orders_update on brand_studio.work_orders for update to authenticated
using (brand_studio_private.has_role(organization_id, array['owner','admin','editor']))
with check (brand_studio_private.has_role(organization_id, array['owner','admin','editor']));

create policy job_runs_select on brand_studio.job_runs for select to authenticated
using (brand_studio_private.is_member(organization_id));

create policy approvals_select on brand_studio.approvals for select to authenticated
using (brand_studio_private.is_member(organization_id));
create policy approvals_insert on brand_studio.approvals for insert to authenticated
with check (brand_studio_private.has_role(organization_id, array['owner','admin','reviewer']) and decided_by = auth.uid());

create policy artifact_select on brand_studio.artifact_index for select to authenticated
using (brand_studio_private.is_member(organization_id));
create policy artifact_insert on brand_studio.artifact_index for insert to authenticated
with check (brand_studio_private.has_role(organization_id, array['owner','admin','editor']));
create policy artifact_update on brand_studio.artifact_index for update to authenticated
using (brand_studio_private.has_role(organization_id, array['owner','admin','editor']))
with check (brand_studio_private.has_role(organization_id, array['owner','admin','editor']));
create policy artifact_delete on brand_studio.artifact_index for delete to authenticated
using (brand_studio_private.has_role(organization_id, array['owner','admin']));

create policy sync_select on brand_studio.sync_state for select to authenticated
using (brand_studio_private.is_member(organization_id));
create policy sync_write on brand_studio.sync_state for all to authenticated
using (brand_studio_private.has_role(organization_id, array['owner','admin','editor']))
with check (brand_studio_private.has_role(organization_id, array['owner','admin','editor']));

create policy activity_select on brand_studio.activity_events for select to authenticated
using (brand_studio_private.is_member(organization_id));
create policy activity_insert on brand_studio.activity_events for insert to authenticated
with check (brand_studio_private.is_member(organization_id) and (actor_user_id is null or actor_user_id = auth.uid()));

revoke all on all tables in schema brand_studio from public, anon, authenticated;
revoke all on all sequences in schema brand_studio from public, anon, authenticated;
revoke all on all functions in schema brand_studio_private from public, anon, authenticated;
grant select, insert, update, delete on all tables in schema brand_studio to service_role;
grant usage, select on all sequences in schema brand_studio to service_role;
grant execute on all functions in schema brand_studio_private to service_role;

create or replace function public.brand_studio_create_organization(p_name text)
returns table(id uuid, name text, role text)
language plpgsql
security definer
set search_path = pg_catalog, public, brand_studio
as $$
declare
  v_user uuid := auth.uid();
  v_org uuid;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if char_length(trim(coalesce(p_name,''))) = 0 then raise exception 'organization name required'; end if;
  insert into brand_studio.organizations(name, created_by) values (trim(p_name), v_user) returning organizations.id into v_org;
  insert into brand_studio.memberships(organization_id, user_id, role, status) values (v_org, v_user, 'owner', 'active');
  insert into brand_studio.activity_events(organization_id, actor_user_id, event_type, entity_type, entity_id)
    values (v_org, v_user, 'organization.created', 'organization', v_org);
  return query select v_org, trim(p_name), 'owner'::text;
end;
$$;

create or replace function public.brand_studio_list_organizations()
returns table(id uuid, name text, role text)
language sql
stable
security definer
set search_path = pg_catalog, public, brand_studio
as $$
  select o.id, o.name, m.role
  from brand_studio.organizations o
  join brand_studio.memberships m on m.organization_id=o.id
  where m.user_id=auth.uid() and m.status='active'
  order by o.created_at;
$$;

create or replace function public.brand_studio_create_project(p_organization_id uuid, p_name text, p_icm_path text default null)
returns table(id uuid, organization_id uuid, name text, icm_path text, status text)
language plpgsql
security definer
set search_path = pg_catalog, public, brand_studio, brand_studio_private
as $$
declare
  v_user uuid := auth.uid();
  v_project uuid;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not brand_studio_private.has_role(p_organization_id, array['owner','admin','editor']) then raise exception 'insufficient role'; end if;
  insert into brand_studio.projects(organization_id,name,icm_path,created_by)
    values (p_organization_id,trim(p_name),nullif(trim(coalesce(p_icm_path,'')),''),v_user)
    returning projects.id into v_project;
  insert into brand_studio.activity_events(organization_id,project_id,actor_user_id,event_type,entity_type,entity_id)
    values (p_organization_id,v_project,v_user,'project.created','project',v_project);
  return query select p.id,p.organization_id,p.name,p.icm_path,p.status from brand_studio.projects p where p.id=v_project;
end;
$$;

create or replace function public.brand_studio_list_projects(p_organization_id uuid)
returns table(id uuid, organization_id uuid, name text, icm_path text, status text)
language sql
stable
security definer
set search_path = pg_catalog, public, brand_studio, brand_studio_private
as $$
  select p.id,p.organization_id,p.name,p.icm_path,p.status
  from brand_studio.projects p
  where p.organization_id=p_organization_id and brand_studio_private.is_member(p_organization_id)
  order by p.created_at;
$$;

create or replace function public.brand_studio_create_work_order(
  p_organization_id uuid,
  p_project_id uuid,
  p_intent text,
  p_idempotency_key text default null,
  p_requires_approval boolean default false
)
returns table(id uuid, organization_id uuid, project_id uuid, intent text, status text, requires_approval boolean, created_at timestamptz)
language plpgsql
security definer
set search_path = pg_catalog, public, brand_studio, brand_studio_private
as $$
declare
  v_user uuid := auth.uid();
  v_id uuid;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  if not brand_studio_private.has_role(p_organization_id, array['owner','admin','editor']) then raise exception 'insufficient role'; end if;
  if not exists(select 1 from brand_studio.projects p where p.id=p_project_id and p.organization_id=p_organization_id) then raise exception 'project does not belong to organization'; end if;
  insert into brand_studio.work_orders(organization_id,project_id,requested_by,intent,idempotency_key,requires_approval)
  values (p_organization_id,p_project_id,v_user,trim(p_intent),nullif(trim(coalesce(p_idempotency_key,'')),''),p_requires_approval)
  on conflict (organization_id,idempotency_key) where idempotency_key is not null
  do update set intent=excluded.intent
  returning work_orders.id into v_id;
  insert into brand_studio.activity_events(organization_id,project_id,actor_user_id,event_type,entity_type,entity_id)
    values (p_organization_id,p_project_id,v_user,'work_order.created','work_order',v_id);
  return query select w.id,w.organization_id,w.project_id,w.intent,w.status,w.requires_approval,w.created_at from brand_studio.work_orders w where w.id=v_id;
end;
$$;

create or replace function public.brand_studio_record_approval(p_work_order_id uuid, p_decision text, p_scope_hash text, p_note text default null)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public, brand_studio, brand_studio_private
as $$
declare
  v_user uuid := auth.uid();
  v_org uuid;
  v_id uuid;
begin
  if v_user is null then raise exception 'authentication required'; end if;
  select organization_id into v_org from brand_studio.work_orders where id=p_work_order_id;
  if v_org is null then raise exception 'work order not found'; end if;
  if not brand_studio_private.has_role(v_org,array['owner','admin','reviewer']) then raise exception 'insufficient role'; end if;
  if p_decision not in ('requested','approved','rejected') then raise exception 'invalid decision'; end if;
  insert into brand_studio.approvals(organization_id,work_order_id,decision,scope_hash,note,decided_by)
    values(v_org,p_work_order_id,p_decision,p_scope_hash,p_note,v_user) returning id into v_id;
  return v_id;
end;
$$;

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
