begin;

-- Transaction-scoped Phase 3 guardrail suite. All synthetic rows are rolled back.
create temp table zte_results(test text primary key, passed boolean, detail text);
grant insert, select on zte_results to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_namespace where nspname='brand_studio'
  ) then raise exception 'brand_studio schema is not installed'; end if;
  if not exists (
    select 1 from pg_namespace where nspname='brand_studio_private'
  ) then raise exception 'brand_studio_private schema is not installed'; end if;
end $$;

insert into auth.users(id,is_sso_user,is_anonymous,created_at,updated_at)
values
 ('00000000-0000-0000-0000-00000000a001',false,false,now(),now()),
 ('00000000-0000-0000-0000-00000000b002',false,false,now(),now());

insert into brand_studio.organizations(id,name,created_by) values
 ('10000000-0000-0000-0000-00000000a001','Tenant A','00000000-0000-0000-0000-00000000a001'),
 ('20000000-0000-0000-0000-00000000b002','Tenant B','00000000-0000-0000-0000-00000000b002');
insert into brand_studio.memberships(organization_id,user_id,role,status) values
 ('10000000-0000-0000-0000-00000000a001','00000000-0000-0000-0000-00000000a001','owner','active'),
 ('20000000-0000-0000-0000-00000000b002','00000000-0000-0000-0000-00000000b002','owner','active');
insert into brand_studio.projects(id,organization_id,name,created_by) values
 ('11000000-0000-0000-0000-00000000a001','10000000-0000-0000-0000-00000000a001','Project A','00000000-0000-0000-0000-00000000a001'),
 ('22000000-0000-0000-0000-00000000b002','20000000-0000-0000-0000-00000000b002','Project B','00000000-0000-0000-0000-00000000b002');

set local role authenticated;
set local "request.jwt.claim.sub"='00000000-0000-0000-0000-00000000a001';
insert into zte_results values(
 'tenant_a_only_sees_a',
 (select count(*)=1 and max(id::text)='10000000-0000-0000-0000-00000000a001' from public.brand_studio_list_organizations()),
 'RPC organization list is tenant-scoped'
);
insert into zte_results values(
 'tenant_a_cannot_list_b_projects',
 (select count(*)=0 from public.brand_studio_list_projects('20000000-0000-0000-0000-00000000b002')),
 'Cross-tenant project read returns zero rows'
);
reset role;

set local role authenticated;
set local "request.jwt.claim.sub"='00000000-0000-0000-0000-00000000b002';
insert into zte_results values(
 'tenant_b_only_sees_b',
 (select count(*)=1 and max(id::text)='20000000-0000-0000-0000-00000000b002' from public.brand_studio_list_organizations()),
 'RPC organization list is tenant-scoped'
);
reset role;

insert into zte_results values(
 'authenticated_no_schema_usage',
 not has_schema_privilege('authenticated','brand_studio','USAGE'),
 'Authenticated browser role has no direct data-schema usage'
);
insert into zte_results values(
 'anon_no_rpc_execute',
 not has_function_privilege('anon','public.brand_studio_create_organization(text)','EXECUTE'),
 'Anonymous role cannot call create-organization RPC'
);
insert into zte_results values(
 'authenticated_rpc_execute',
 has_function_privilege('authenticated','public.brand_studio_create_organization(text)','EXECUTE'),
 'Authenticated role can call controlled RPC'
);

DO $$
begin
  begin
    delete from brand_studio.memberships where organization_id='10000000-0000-0000-0000-00000000a001';
    insert into zte_results values('last_owner_guard',false,'Deletion unexpectedly succeeded');
  exception when others then
    insert into zte_results values('last_owner_guard',true,'Last active owner deletion rejected');
  end;
end $$;

insert into brand_studio.work_orders(id,organization_id,project_id,requested_by,intent,requires_approval,status)
values(
 '13000000-0000-0000-0000-00000000a001',
 '10000000-0000-0000-0000-00000000a001',
 '11000000-0000-0000-0000-00000000a001',
 '00000000-0000-0000-0000-00000000a001',
 'Test approval gate',true,'running'
);

DO $$
begin
  begin
    update brand_studio.work_orders set status='completed' where id='13000000-0000-0000-0000-00000000a001';
    insert into zte_results values('approval_required_guard',false,'Completion unexpectedly succeeded without approval');
  exception when others then
    insert into zte_results values('approval_required_guard',true,'Completion rejected without approval');
  end;
end $$;

insert into brand_studio.approvals(organization_id,work_order_id,decision,scope_hash,decided_by)
values(
 '10000000-0000-0000-0000-00000000a001',
 '13000000-0000-0000-0000-00000000a001',
 'approved','12345678','00000000-0000-0000-0000-00000000a001'
);
update brand_studio.work_orders set status='completed' where id='13000000-0000-0000-0000-00000000a001';
insert into zte_results values(
 'approved_completion_succeeds',
 (select status='completed' from brand_studio.work_orders where id='13000000-0000-0000-0000-00000000a001'),
 'Approved work order may complete'
);

DO $$
begin
  begin
    update brand_studio.approvals set note='tamper' where work_order_id='13000000-0000-0000-0000-00000000a001';
    insert into zte_results values('approval_append_only',false,'Approval mutation unexpectedly succeeded');
  exception when others then
    insert into zte_results values('approval_append_only',true,'Approval mutation rejected');
  end;
end $$;

DO $$
begin
  if exists(select 1 from zte_results where not passed) then
    raise exception 'Brand Studio guardrail suite failed';
  end if;
end $$;

select * from zte_results order by test;
rollback;
