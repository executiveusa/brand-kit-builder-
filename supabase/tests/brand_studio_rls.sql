begin;

-- Execute on an isolated Supabase development branch after the Phase 3 migration.
-- The transaction rolls back all test users and tenant data.

do $$
begin
  if not exists (select 1 from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname='brand_studio_organizations') then
    raise exception 'brand_studio migration is not installed';
  end if;
end $$;

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
values
  ('10000000-0000-0000-0000-000000000001','authenticated','authenticated','phase3-owner-a@example.invalid','',now(),now(),now(),'{}','{}'),
  ('10000000-0000-0000-0000-000000000002','authenticated','authenticated','phase3-editor-a@example.invalid','',now(),now(),now(),'{}','{}'),
  ('20000000-0000-0000-0000-000000000001','authenticated','authenticated','phase3-owner-b@example.invalid','',now(),now(),now(),'{}','{}');

set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001', true);

insert into public.brand_studio_organizations (id,name,slug,created_by)
values ('aaaaaaaa-0000-0000-0000-000000000001','Tenant A','phase3-tenant-a','10000000-0000-0000-0000-000000000001');

-- Organization creation must bootstrap the creator as the active owner.
do $$
begin
  if (select count(*) from public.brand_studio_memberships where organization_id='aaaaaaaa-0000-0000-0000-000000000001') <> 1 then
    raise exception 'owner bootstrap failed';
  end if;
end $$;

insert into public.brand_studio_memberships (organization_id,user_id,role,status)
values ('aaaaaaaa-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000002','editor','active');

insert into public.brand_studio_projects (id,organization_id,slug,name,canonical_manifest_path,created_by)
values (
  'aaaaaaaa-1000-0000-0000-000000000001',
  'aaaaaaaa-0000-0000-0000-000000000001',
  'project-a',
  'Project A',
  'studio/projects/phase3-tenant-a/project-a/manifest.json',
  '10000000-0000-0000-0000-000000000001'
);

insert into public.brand_studio_work_orders (id,organization_id,project_id,requested_by,intent)
values (
  'aaaaaaaa-2000-0000-0000-000000000001',
  'aaaaaaaa-0000-0000-0000-000000000001',
  'aaaaaaaa-1000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'Create the launch brand kit.'
);

-- Invalid status jumps must fail.
do $$
begin
  begin
    update public.brand_studio_work_orders
      set status='completed'
      where id='aaaaaaaa-2000-0000-0000-000000000001';
    raise exception 'invalid work-order transition unexpectedly succeeded';
  exception when others then
    if sqlerrm = 'invalid work-order transition unexpectedly succeeded' then raise; end if;
  end;
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','20000000-0000-0000-0000-000000000001', true);

insert into public.brand_studio_organizations (id,name,slug,created_by)
values ('bbbbbbbb-0000-0000-0000-000000000001','Tenant B','phase3-tenant-b','20000000-0000-0000-0000-000000000001');

insert into public.brand_studio_projects (id,organization_id,slug,name,canonical_manifest_path,created_by)
values (
  'bbbbbbbb-1000-0000-0000-000000000001',
  'bbbbbbbb-0000-0000-0000-000000000001',
  'project-b',
  'Project B',
  'studio/projects/phase3-tenant-b/project-b/manifest.json',
  '20000000-0000-0000-0000-000000000001'
);

-- Tenant B must not see Tenant A.
do $$
begin
  if exists (select 1 from public.brand_studio_projects where id='aaaaaaaa-1000-0000-0000-000000000001') then
    raise exception 'cross-tenant project read leaked';
  end if;
end $$;

-- Tenant B must not be able to insert into Tenant A.
do $$
begin
  begin
    insert into public.brand_studio_work_orders (organization_id,project_id,requested_by,intent)
    values (
      'aaaaaaaa-0000-0000-0000-000000000001',
      'aaaaaaaa-1000-0000-0000-000000000001',
      '20000000-0000-0000-0000-000000000001',
      'This must be rejected by RLS.'
    );
    raise exception 'cross-tenant work-order write unexpectedly succeeded';
  exception when others then
    if sqlerrm = 'cross-tenant work-order write unexpectedly succeeded' then raise; end if;
  end;
end $$;

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub','10000000-0000-0000-0000-000000000001', true);

insert into public.brand_studio_approvals (
  id,organization_id,project_id,work_order_id,decided_by,subject_type,subject_ref,decision,rationale
) values (
  'aaaaaaaa-3000-0000-0000-000000000001',
  'aaaaaaaa-0000-0000-0000-000000000001',
  'aaaaaaaa-1000-0000-0000-000000000001',
  'aaaaaaaa-2000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'work_order',
  'aaaaaaaa-2000-0000-0000-000000000001',
  'approved',
  'Phase 3 test approval.'
);

-- Approval and activity ledgers are append-only to authenticated clients.
do $$
begin
  begin
    update public.brand_studio_approvals set rationale='tampered' where id='aaaaaaaa-3000-0000-0000-000000000001';
    raise exception 'approval mutation unexpectedly succeeded';
  exception when insufficient_privilege then null;
  when others then
    if sqlerrm = 'approval mutation unexpectedly succeeded' then raise; end if;
  end;
end $$;

insert into public.brand_studio_activity_events (
  organization_id,project_id,work_order_id,actor_user_id,event_type,payload
) values (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'aaaaaaaa-1000-0000-0000-000000000001',
  'aaaaaaaa-2000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001',
  'phase3.test',
  '{"safe":"metadata-only"}'::jsonb
);

do $$
begin
  if (select count(*) from public.brand_studio_activity_events where event_type='phase3.test') <> 1 then
    raise exception 'activity append failed';
  end if;
end $$;

-- Owner protection: the sole active owner cannot demote themselves.
do $$
begin
  begin
    update public.brand_studio_memberships
      set role='admin'
      where organization_id='aaaaaaaa-0000-0000-0000-000000000001'
        and user_id='10000000-0000-0000-0000-000000000001';
    raise exception 'last-owner protection unexpectedly allowed demotion';
  exception when others then
    if sqlerrm = 'last-owner protection unexpectedly allowed demotion' then raise; end if;
  end;
end $$;

-- Static RLS invariant: every Brand Studio base table has RLS enabled.
reset role;
do $$
declare
  unsecured integer;
begin
  select count(*) into unsecured
  from pg_class c
  join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public'
    and c.relkind='r'
    and c.relname like 'brand_studio_%'
    and not c.relrowsecurity;
  if unsecured <> 0 then raise exception '% Brand Studio tables lack RLS', unsecured; end if;
end $$;

rollback;
