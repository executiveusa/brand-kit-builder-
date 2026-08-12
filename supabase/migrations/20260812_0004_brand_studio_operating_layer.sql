begin;

-- Pauli Brand Studio cloud operating layer.
-- Canonical brand truth remains in approved ICM files + manifest. These tables only
-- own cloud identity, tenancy and operational indexes.

create table if not exists public.brand_studio_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brand_studio_memberships (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.brand_studio_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','editor','viewer')),
  status text not null default 'active' check (status in ('active','invited','disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create table if not exists public.brand_studio_projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.brand_studio_organizations(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(trim(name)) between 1 and 200),
  lifecycle_status text not null default 'active' check (lifecycle_status in ('draft','active','archived')),
  canonical_manifest_path text not null,
  canonical_manifest_hash text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create table if not exists public.brand_studio_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.brand_studio_organizations(id) on delete cascade,
  project_id uuid references public.brand_studio_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  channel text not null check (channel in ('web','popebot','rest','mcp','cli','folder','local','usb')),
  status text not null default 'open' check (status in ('open','closed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.brand_studio_work_orders (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.brand_studio_organizations(id) on delete cascade,
  project_id uuid not null references public.brand_studio_projects(id) on delete cascade,
  session_id uuid references public.brand_studio_sessions(id) on delete set null,
  requested_by uuid not null references auth.users(id) on delete restrict,
  intent text not null check (char_length(trim(intent)) between 1 and 4000),
  normalized_request jsonb not null default '{}'::jsonb,
  request_hash text,
  status text not null default 'queued' check (status in ('queued','planned','running','needs_approval','completed','failed','canceled')),
  approval_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.brand_studio_job_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.brand_studio_organizations(id) on delete cascade,
  work_order_id uuid not null references public.brand_studio_work_orders(id) on delete cascade,
  attempt integer not null default 1 check (attempt > 0),
  executor text not null,
  status text not null default 'queued' check (status in ('queued','running','succeeded','failed','canceled')),
  started_at timestamptz,
  finished_at timestamptz,
  error_code text,
  error_summary text,
  created_at timestamptz not null default now(),
  unique (work_order_id, attempt)
);

-- Append-only decision ledger. A pending approval is represented by a work order in
-- needs_approval; the actual human decision is inserted here as a new immutable event.
create table if not exists public.brand_studio_approvals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.brand_studio_organizations(id) on delete cascade,
  project_id uuid not null references public.brand_studio_projects(id) on delete cascade,
  work_order_id uuid references public.brand_studio_work_orders(id) on delete set null,
  decided_by uuid not null references auth.users(id) on delete restrict,
  subject_type text not null,
  subject_ref text not null,
  decision text not null check (decision in ('approved','rejected','changes_requested')),
  rationale text,
  created_at timestamptz not null default now()
);

create table if not exists public.brand_studio_artifact_index (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.brand_studio_organizations(id) on delete cascade,
  project_id uuid not null references public.brand_studio_projects(id) on delete cascade,
  work_order_id uuid references public.brand_studio_work_orders(id) on delete set null,
  kind text not null,
  title text not null,
  storage_provider text not null,
  storage_path text not null,
  canonical_path text,
  content_hash text not null,
  mime_type text,
  byte_size bigint check (byte_size is null or byte_size >= 0),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.brand_studio_sync_state (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.brand_studio_organizations(id) on delete cascade,
  project_id uuid not null references public.brand_studio_projects(id) on delete cascade,
  target text not null,
  local_manifest_hash text,
  remote_manifest_hash text,
  state text not null default 'pending' check (state in ('clean','pending','conflict','error')),
  details jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (project_id, target)
);

-- Append-only audit ledger. Payloads must contain operational metadata only; never secrets.
create table if not exists public.brand_studio_activity_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.brand_studio_organizations(id) on delete cascade,
  project_id uuid references public.brand_studio_projects(id) on delete cascade,
  work_order_id uuid references public.brand_studio_work_orders(id) on delete set null,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists brand_studio_memberships_user_idx on public.brand_studio_memberships(user_id, status);
create index if not exists brand_studio_projects_org_idx on public.brand_studio_projects(organization_id, lifecycle_status);
create index if not exists brand_studio_sessions_org_user_idx on public.brand_studio_sessions(organization_id, user_id, status);
create index if not exists brand_studio_work_orders_project_idx on public.brand_studio_work_orders(project_id, status, created_at desc);
create index if not exists brand_studio_job_runs_work_order_idx on public.brand_studio_job_runs(work_order_id, created_at desc);
create index if not exists brand_studio_approvals_subject_idx on public.brand_studio_approvals(project_id, subject_type, subject_ref, created_at desc);
create index if not exists brand_studio_artifact_project_idx on public.brand_studio_artifact_index(project_id, created_at desc);
create index if not exists brand_studio_activity_project_idx on public.brand_studio_activity_events(project_id, created_at desc);

create or replace function public.brand_studio_set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.brand_studio_bootstrap_owner()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.brand_studio_memberships (organization_id, user_id, role, status)
  values (new.id, new.created_by, 'owner', 'active')
  on conflict (organization_id, user_id) do nothing;
  return new;
end;
$$;

create or replace function public.brand_studio_is_member(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.brand_studio_memberships m
    where m.organization_id = p_organization_id
      and m.user_id = auth.uid()
      and m.status = 'active'
  );
$$;

create or replace function public.brand_studio_member_role(p_organization_id uuid)
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select m.role
  from public.brand_studio_memberships m
  where m.organization_id = p_organization_id
    and m.user_id = auth.uid()
    and m.status = 'active'
  limit 1;
$$;

create or replace function public.brand_studio_can_write(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(public.brand_studio_member_role(p_organization_id) in ('owner','admin','editor'), false);
$$;

create or replace function public.brand_studio_can_admin(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(public.brand_studio_member_role(p_organization_id) in ('owner','admin'), false);
$$;

create or replace function public.brand_studio_is_owner(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(public.brand_studio_member_role(p_organization_id) = 'owner', false);
$$;

create or replace function public.brand_studio_preserve_last_owner()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  active_owner_count integer;
begin
  if old.role = 'owner' and old.status = 'active' and (
    tg_op = 'DELETE' or new.role <> 'owner' or new.status <> 'active'
  ) then
    select count(*) into active_owner_count
    from public.brand_studio_memberships m
    where m.organization_id = old.organization_id
      and m.role = 'owner'
      and m.status = 'active'
      and m.id <> old.id;

    if active_owner_count = 0 then
      raise exception 'brand_studio organization must retain at least one active owner';
    end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

create or replace function public.brand_studio_validate_work_order_transition()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if old.status = new.status then return new; end if;

  if not (
    (old.status = 'queued' and new.status in ('planned','running','canceled','failed')) or
    (old.status = 'planned' and new.status in ('running','needs_approval','canceled','failed')) or
    (old.status = 'running' and new.status in ('needs_approval','completed','failed','canceled')) or
    (old.status = 'needs_approval' and new.status in ('planned','running','completed','failed','canceled'))
  ) then
    raise exception 'invalid brand_studio work order transition: % -> %', old.status, new.status;
  end if;

  return new;
end;
$$;

create trigger brand_studio_organizations_updated_at before update on public.brand_studio_organizations for each row execute function public.brand_studio_set_updated_at();
create trigger brand_studio_memberships_updated_at before update on public.brand_studio_memberships for each row execute function public.brand_studio_set_updated_at();
create trigger brand_studio_projects_updated_at before update on public.brand_studio_projects for each row execute function public.brand_studio_set_updated_at();
create trigger brand_studio_work_orders_updated_at before update on public.brand_studio_work_orders for each row execute function public.brand_studio_set_updated_at();
create trigger brand_studio_sync_state_updated_at before update on public.brand_studio_sync_state for each row execute function public.brand_studio_set_updated_at();
create trigger brand_studio_organizations_bootstrap_owner after insert on public.brand_studio_organizations for each row execute function public.brand_studio_bootstrap_owner();
create trigger brand_studio_memberships_last_owner before update or delete on public.brand_studio_memberships for each row execute function public.brand_studio_preserve_last_owner();
create trigger brand_studio_work_orders_transition before update of status on public.brand_studio_work_orders for each row execute function public.brand_studio_validate_work_order_transition();

alter table public.brand_studio_organizations enable row level security;
alter table public.brand_studio_memberships enable row level security;
alter table public.brand_studio_projects enable row level security;
alter table public.brand_studio_sessions enable row level security;
alter table public.brand_studio_work_orders enable row level security;
alter table public.brand_studio_job_runs enable row level security;
alter table public.brand_studio_approvals enable row level security;
alter table public.brand_studio_artifact_index enable row level security;
alter table public.brand_studio_sync_state enable row level security;
alter table public.brand_studio_activity_events enable row level security;

create policy brand_studio_org_select on public.brand_studio_organizations for select to authenticated using (public.brand_studio_is_member(id));
create policy brand_studio_org_insert on public.brand_studio_organizations for insert to authenticated with check (auth.uid() is not null and created_by = auth.uid());
create policy brand_studio_org_update on public.brand_studio_organizations for update to authenticated using (public.brand_studio_can_admin(id)) with check (public.brand_studio_can_admin(id));
create policy brand_studio_org_delete on public.brand_studio_organizations for delete to authenticated using (public.brand_studio_is_owner(id));

create policy brand_studio_membership_select on public.brand_studio_memberships for select to authenticated using (public.brand_studio_is_member(organization_id));
create policy brand_studio_membership_insert on public.brand_studio_memberships for insert to authenticated with check (public.brand_studio_can_admin(organization_id));
create policy brand_studio_membership_update on public.brand_studio_memberships for update to authenticated using (public.brand_studio_can_admin(organization_id)) with check (public.brand_studio_can_admin(organization_id));
create policy brand_studio_membership_delete on public.brand_studio_memberships for delete to authenticated using (public.brand_studio_is_owner(organization_id));

create policy brand_studio_project_select on public.brand_studio_projects for select to authenticated using (public.brand_studio_is_member(organization_id));
create policy brand_studio_project_insert on public.brand_studio_projects for insert to authenticated with check (public.brand_studio_can_write(organization_id) and created_by = auth.uid());
create policy brand_studio_project_update on public.brand_studio_projects for update to authenticated using (public.brand_studio_can_write(organization_id)) with check (public.brand_studio_can_write(organization_id));
create policy brand_studio_project_delete on public.brand_studio_projects for delete to authenticated using (public.brand_studio_can_admin(organization_id));

create policy brand_studio_session_select on public.brand_studio_sessions for select to authenticated using (user_id = auth.uid() or public.brand_studio_can_admin(organization_id));
create policy brand_studio_session_insert on public.brand_studio_sessions for insert to authenticated with check (public.brand_studio_is_member(organization_id) and user_id = auth.uid());
create policy brand_studio_session_update on public.brand_studio_sessions for update to authenticated using (user_id = auth.uid() or public.brand_studio_can_admin(organization_id)) with check (public.brand_studio_is_member(organization_id));
create policy brand_studio_session_delete on public.brand_studio_sessions for delete to authenticated using (user_id = auth.uid() or public.brand_studio_can_admin(organization_id));

create policy brand_studio_work_order_select on public.brand_studio_work_orders for select to authenticated using (public.brand_studio_is_member(organization_id));
create policy brand_studio_work_order_insert on public.brand_studio_work_orders for insert to authenticated with check (public.brand_studio_can_write(organization_id) and requested_by = auth.uid());
create policy brand_studio_work_order_update on public.brand_studio_work_orders for update to authenticated using (public.brand_studio_can_write(organization_id)) with check (public.brand_studio_can_write(organization_id));
create policy brand_studio_work_order_delete on public.brand_studio_work_orders for delete to authenticated using (public.brand_studio_can_admin(organization_id));

create policy brand_studio_job_run_select on public.brand_studio_job_runs for select to authenticated using (public.brand_studio_is_member(organization_id));
create policy brand_studio_job_run_insert on public.brand_studio_job_runs for insert to authenticated with check (public.brand_studio_can_write(organization_id));
create policy brand_studio_job_run_update on public.brand_studio_job_runs for update to authenticated using (public.brand_studio_can_write(organization_id)) with check (public.brand_studio_can_write(organization_id));
create policy brand_studio_job_run_delete on public.brand_studio_job_runs for delete to authenticated using (public.brand_studio_can_admin(organization_id));

create policy brand_studio_approval_select on public.brand_studio_approvals for select to authenticated using (public.brand_studio_is_member(organization_id));
create policy brand_studio_approval_insert on public.brand_studio_approvals for insert to authenticated with check (public.brand_studio_is_member(organization_id) and decided_by = auth.uid());

create policy brand_studio_artifact_select on public.brand_studio_artifact_index for select to authenticated using (public.brand_studio_is_member(organization_id));
create policy brand_studio_artifact_insert on public.brand_studio_artifact_index for insert to authenticated with check (public.brand_studio_can_write(organization_id) and created_by = auth.uid());
create policy brand_studio_artifact_update on public.brand_studio_artifact_index for update to authenticated using (public.brand_studio_can_write(organization_id)) with check (public.brand_studio_can_write(organization_id));
create policy brand_studio_artifact_delete on public.brand_studio_artifact_index for delete to authenticated using (public.brand_studio_can_admin(organization_id));

create policy brand_studio_sync_select on public.brand_studio_sync_state for select to authenticated using (public.brand_studio_is_member(organization_id));
create policy brand_studio_sync_insert on public.brand_studio_sync_state for insert to authenticated with check (public.brand_studio_can_write(organization_id));
create policy brand_studio_sync_update on public.brand_studio_sync_state for update to authenticated using (public.brand_studio_can_write(organization_id)) with check (public.brand_studio_can_write(organization_id));
create policy brand_studio_sync_delete on public.brand_studio_sync_state for delete to authenticated using (public.brand_studio_can_admin(organization_id));

create policy brand_studio_activity_select on public.brand_studio_activity_events for select to authenticated using (public.brand_studio_is_member(organization_id));
create policy brand_studio_activity_insert on public.brand_studio_activity_events for insert to authenticated with check (public.brand_studio_is_member(organization_id) and actor_user_id = auth.uid());

grant select, insert, update, delete on public.brand_studio_organizations to authenticated;
grant select, insert, update, delete on public.brand_studio_memberships to authenticated;
grant select, insert, update, delete on public.brand_studio_projects to authenticated;
grant select, insert, update, delete on public.brand_studio_sessions to authenticated;
grant select, insert, update, delete on public.brand_studio_work_orders to authenticated;
grant select, insert, update, delete on public.brand_studio_job_runs to authenticated;
grant select, insert on public.brand_studio_approvals to authenticated;
grant select, insert, update, delete on public.brand_studio_artifact_index to authenticated;
grant select, insert, update, delete on public.brand_studio_sync_state to authenticated;
grant select, insert on public.brand_studio_activity_events to authenticated;

grant execute on function public.brand_studio_is_member(uuid) to authenticated;
grant execute on function public.brand_studio_member_role(uuid) to authenticated;
grant execute on function public.brand_studio_can_write(uuid) to authenticated;
grant execute on function public.brand_studio_can_admin(uuid) to authenticated;
grant execute on function public.brand_studio_is_owner(uuid) to authenticated;

comment on table public.brand_studio_projects is 'Operational project index. Canonical brand truth lives in approved ICM project files + manifest.';
comment on column public.brand_studio_projects.canonical_manifest_path is 'Portable ICM manifest path; this database row is not the canonical manifest.';
comment on table public.brand_studio_artifact_index is 'Artifact metadata/hash index. It must never be the sole copy of a portable deliverable.';
comment on table public.brand_studio_approvals is 'Append-only human decision ledger.';
comment on table public.brand_studio_activity_events is 'Append-only operational event ledger; never store secrets in payload.';

commit;
