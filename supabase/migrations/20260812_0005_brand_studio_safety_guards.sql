begin;

-- Phase 3 safety hardening layered after the initial operating schema.

-- Organizations are archived through project/workflow policy, not browser-deleted.
drop policy if exists brand_studio_org_delete on public.brand_studio_organizations;
revoke delete on public.brand_studio_organizations from authenticated;

create or replace function public.brand_studio_preserve_last_owner()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  active_owner_count integer;
begin
  if old.role <> 'owner' or old.status <> 'active' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_op = 'UPDATE' and new.role = 'owner' and new.status = 'active' then
    return new;
  end if;

  select count(*) into active_owner_count
  from public.brand_studio_memberships m
  where m.organization_id = old.organization_id
    and m.role = 'owner'
    and m.status = 'active'
    and m.id <> old.id;

  if active_owner_count = 0 then
    raise exception 'brand_studio organization must retain at least one active owner';
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

  if old.status = 'needs_approval' and new.status = 'completed' and not exists (
    select 1
    from public.brand_studio_approvals a
    where a.work_order_id = old.id
      and a.subject_type = 'work_order'
      and a.subject_ref = old.id::text
      and a.decision = 'approved'
  ) then
    raise exception 'brand_studio work order requires an approval decision before completion';
  end if;

  return new;
end;
$$;

commit;
