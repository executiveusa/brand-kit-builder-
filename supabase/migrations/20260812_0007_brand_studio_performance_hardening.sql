begin;

create index if not exists brand_studio_activity_actor_idx on brand_studio.activity_events(actor_user_id);
create index if not exists brand_studio_activity_project_idx on brand_studio.activity_events(project_id);
create index if not exists brand_studio_approvals_decided_by_idx on brand_studio.approvals(decided_by);
create index if not exists brand_studio_approvals_org_idx on brand_studio.approvals(organization_id);
create index if not exists brand_studio_artifact_created_by_idx on brand_studio.artifact_index(created_by);
create index if not exists brand_studio_artifact_project_fk_idx on brand_studio.artifact_index(project_id);
create index if not exists brand_studio_artifact_work_order_idx on brand_studio.artifact_index(work_order_id);
create index if not exists brand_studio_job_runs_work_order_fk_idx on brand_studio.job_runs(work_order_id);
create index if not exists brand_studio_org_created_by_idx on brand_studio.organizations(created_by);
create index if not exists brand_studio_projects_created_by_idx on brand_studio.projects(created_by);
create index if not exists brand_studio_sessions_project_idx on brand_studio.sessions(project_id);
create index if not exists brand_studio_sessions_user_idx on brand_studio.sessions(user_id);
create index if not exists brand_studio_sync_org_idx on brand_studio.sync_state(organization_id);
create index if not exists brand_studio_work_orders_project_fk_idx on brand_studio.work_orders(project_id);
create index if not exists brand_studio_work_orders_requested_by_idx on brand_studio.work_orders(requested_by);
create index if not exists brand_studio_work_orders_session_idx on brand_studio.work_orders(session_id);

drop policy if exists sessions_insert on brand_studio.sessions;
create policy sessions_insert on brand_studio.sessions for insert to authenticated
with check (brand_studio_private.is_member(organization_id) and user_id = (select auth.uid()));

drop policy if exists sessions_update on brand_studio.sessions;
create policy sessions_update on brand_studio.sessions for update to authenticated
using (brand_studio_private.is_member(organization_id) and user_id = (select auth.uid()))
with check (brand_studio_private.is_member(organization_id) and user_id = (select auth.uid()));

drop policy if exists work_orders_insert on brand_studio.work_orders;
create policy work_orders_insert on brand_studio.work_orders for insert to authenticated
with check (
  brand_studio_private.has_role(organization_id, array['owner','admin','editor'])
  and requested_by = (select auth.uid())
);

drop policy if exists approvals_insert on brand_studio.approvals;
create policy approvals_insert on brand_studio.approvals for insert to authenticated
with check (
  brand_studio_private.has_role(organization_id, array['owner','admin','reviewer'])
  and decided_by = (select auth.uid())
);

drop policy if exists activity_insert on brand_studio.activity_events;
create policy activity_insert on brand_studio.activity_events for insert to authenticated
with check (
  brand_studio_private.is_member(organization_id)
  and (actor_user_id is null or actor_user_id = (select auth.uid()))
);

drop policy if exists sync_write on brand_studio.sync_state;
create policy sync_insert on brand_studio.sync_state for insert to authenticated
with check (brand_studio_private.has_role(organization_id, array['owner','admin','editor']));
create policy sync_update on brand_studio.sync_state for update to authenticated
using (brand_studio_private.has_role(organization_id, array['owner','admin','editor']))
with check (brand_studio_private.has_role(organization_id, array['owner','admin','editor']));
create policy sync_delete on brand_studio.sync_state for delete to authenticated
using (brand_studio_private.has_role(organization_id, array['owner','admin']));

commit;
