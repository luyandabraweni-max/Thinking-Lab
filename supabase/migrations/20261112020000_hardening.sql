-- Hardening after the first deploy, from Supabase's security and performance advisors.
-- 1. Supabase grants every API role broad rights on new tables and functions by default. Narrow them to exactly what
--    the platform uses, so access never depends on row-level security alone.
-- 2. Access rules read the caller's id once per query, not once per row ((select auth.uid())), so they scale.
-- 3. Indexes for every foreign key, so deletes and joins stay fast as data grows.

-- ---------- 1. Least privilege ----------
revoke all on all tables in schema public from anon, authenticated;
grant select, insert, update on public.profiles, public.learners, public.learner_consent, public.goals to authenticated;
grant select, insert, update, delete on public.learner_team to authenticated;
grant select, insert on public.messages, public.message_reads, public.goal_observations, public.notes, public.attempts, public.sync_applied to authenticated;
grant select on public.organisations, public.sites, public.groups, public.memberships, public.learner_guardians, public.consent_history to authenticated;
-- Trigger and maintenance functions are never called through the API.
revoke execute on function public.audit(), public.touch(), public.touch_learner(), public.stamp_sender(), public.keep_consent_history(), public.ensure_attempt_partitions(int) from public, anon, authenticated;
-- New partitions get row-level security too, on any Postgres host.
create or replace function public.ensure_attempt_partitions(months_ahead int default 12) returns void
language plpgsql set search_path = '' as $$
declare m date := date_trunc('month', now())::date; name text;
begin
  for i in 0..months_ahead loop
    name := 'attempts_' || to_char(m, 'YYYY_MM');
    if to_regclass('public.' || name) is null then
      execute format('create table public.%I partition of public.attempts for values from (%L) to (%L)', name, m, (m + interval '1 month')::date);
      execute format('alter table public.%I enable row level security', name);
      execute format('revoke all on public.%I from anon, authenticated', name);
    end if;
    m := (m + interval '1 month')::date;
  end loop;
end $$;
revoke execute on function public.ensure_attempt_partitions(int) from public, anon, authenticated;

-- ---------- 2. Read the caller's id once per query ----------
alter policy own_update on public.profiles using (id = (select auth.uid())) with check (id = (select auth.uid()));
alter policy own on public.memberships using (user_id = (select auth.uid()));
alter policy member on public.organisations using (exists (select 1 from public.memberships m where m.org_id = id and m.user_id = (select auth.uid())));
alter policy family_share on public.learner_team with check (public.is_guardian(learner_id) and granted_by = (select auth.uid()));
alter policy family_consent on public.learner_consent using (public.is_guardian(learner_id)) with check (public.is_guardian(learner_id) and updated_by = (select auth.uid()));
alter policy send on public.messages with check (public.can_see_learner(learner_id) and from_id = (select auth.uid()));
alter policy mark on public.message_reads with check (user_id = (select auth.uid()) and exists (select 1 from public.messages m where m.id = message_id and public.can_see_learner(m.learner_id)));
alter policy team on public.goals with check (public.is_team(learner_id) and created_by = (select auth.uid()));
alter policy team on public.goal_observations with check (public.is_team(learner_id) and observed_by = (select auth.uid()));
alter policy team on public.notes with check (public.is_team(learner_id) and author_id = (select auth.uid()));
alter policy record on public.attempts with check (public.can_see_learner(learner_id) and recorded_by = (select auth.uid()));
alter policy family on health.medications with check (public.is_guardian(learner_id) and created_by = (select auth.uid()));
alter policy own on public.sync_applied using (user_id = (select auth.uid()));
alter policy own_insert on public.sync_applied with check (user_id = (select auth.uid()));
alter policy own on safeguarding.leads using (user_id = (select auth.uid()));

-- ---------- 3. Foreign key indexes ----------
create index if not exists sites_org on public.sites (org_id);
create index if not exists groups_site on public.groups (site_id);
create index if not exists memberships_site on public.memberships (site_id);
create index if not exists learners_created_by on public.learners (created_by);
create index if not exists learner_team_granted_by on public.learner_team (granted_by);
create index if not exists learner_consent_updated_by on public.learner_consent (updated_by);
create index if not exists messages_from on public.messages (from_id);
create index if not exists goals_created_by on public.goals (created_by);
create index if not exists goal_observations_learner on public.goal_observations (learner_id);
create index if not exists goal_observations_by on public.goal_observations (observed_by);
create index if not exists notes_author on public.notes (author_id);
create index if not exists attempts_recorded_by on public.attempts (recorded_by);
create index if not exists medications_created_by on health.medications (created_by);
create index if not exists doses_medication on health.doses (medication_id);
create index if not exists concerns_recorded_by on safeguarding.concerns (recorded_by);
create index if not exists concerns_closed_by on safeguarding.concerns (closed_by);
create index if not exists leads_appointed_by on safeguarding.leads (appointed_by);
