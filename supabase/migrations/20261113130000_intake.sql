-- The multidisciplinary intake (Pholoso Afrika Foundation, Multidisciplinary Neurodevelopmental Intake v2.0).
--  * family_intakes: what the family and the person being assessed wrote. Only the family changes it. The learner's
--    team sees it only with health consent and health access, and once the family agreed in the intake itself that it
--    may be shared with the team (consent item 3, key "c3").
--  * intake_team: the clinical team's part (formulation, safety review, professional view, reviews, goals). Team
--    members with health access only; the family hears the conclusions in a feedback meeting.
--  * support_profiles: "How to support me", a one-page snapshot the family shares with the whole team, written from
--    the family's device only when they agreed to share with the school (consent item 4).
-- No names, identity numbers, addresses, phone numbers or medical aid numbers are asked for.

create table public.family_intakes (
  learner_id uuid primary key references public.learners on delete cascade,
  data jsonb not null default '{}' check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 2000000),
  updated_by uuid references public.profiles,
  updated_at timestamptz not null default now()
);
create table public.intake_team (
  learner_id uuid primary key references public.learners on delete cascade,
  data jsonb not null default '{}' check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 2000000),
  updated_by uuid references public.profiles,
  updated_at timestamptz not null default now()
);
create table public.support_profiles (
  learner_id uuid primary key references public.learners on delete cascade,
  data jsonb not null default '{}' check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 200000),
  shared_by text not null default '',
  updated_by uuid references public.profiles,
  updated_at timestamptz not null default now()
);
create index family_intakes_updated on public.family_intakes (updated_at);
create index family_intakes_updated_by on public.family_intakes (updated_by);
create index intake_team_updated on public.intake_team (updated_at);
create index intake_team_updated_by on public.intake_team (updated_by);
create index support_profiles_updated on public.support_profiles (updated_at);
create index support_profiles_updated_by on public.support_profiles (updated_by);
alter table public.family_intakes enable row level security;
alter table public.intake_team enable row level security;
alter table public.support_profiles enable row level security;

create function public.can_see_intake(l uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_guardian(l) or (public.is_team(l) and public.can_see_health(l)
    and exists (select 1 from public.family_intakes f where f.learner_id = l and coalesce(f.data ->> 'c3', '') like 'Yes%'))
$$;
create function public.can_keep_intake_team(l uuid) returns boolean
language sql stable security definer set search_path = '' as $$ select public.is_team(l) and public.can_see_health(l) $$;
revoke all on function public.can_see_intake(uuid), public.can_keep_intake_team(uuid) from public, anon;
grant execute on function public.can_see_intake(uuid), public.can_keep_intake_team(uuid) to authenticated;

create policy see on public.family_intakes for select using (public.can_see_intake(learner_id));
create policy change on public.family_intakes for insert with check (public.is_guardian(learner_id) and updated_by = (select auth.uid()));
create policy change_update on public.family_intakes for update using (public.is_guardian(learner_id)) with check (public.is_guardian(learner_id) and updated_by = (select auth.uid()));
create policy see on public.intake_team for select using (public.can_keep_intake_team(learner_id));
create policy change on public.intake_team for insert with check (public.can_keep_intake_team(learner_id) and updated_by = (select auth.uid()));
create policy change_update on public.intake_team for update using (public.can_keep_intake_team(learner_id)) with check (public.can_keep_intake_team(learner_id) and updated_by = (select auth.uid()));
create policy see on public.support_profiles for select using (public.can_see_learner(learner_id));
create policy change on public.support_profiles for insert with check (public.is_guardian(learner_id) and updated_by = (select auth.uid()));
create policy change_update on public.support_profiles for update using (public.is_guardian(learner_id)) with check (public.is_guardian(learner_id) and updated_by = (select auth.uid()));
grant select, insert, update on public.family_intakes, public.intake_team, public.support_profiles to authenticated;
create trigger touch before update on public.family_intakes for each row execute function public.touch();
create trigger touch before update on public.intake_team for each row execute function public.touch();
create trigger touch before update on public.support_profiles for each row execute function public.touch();
create trigger audit after insert or update on public.family_intakes for each row execute function public.audit();
create trigger audit after insert or update on public.intake_team for each row execute function public.audit();
create trigger audit after insert or update on public.support_profiles for each row execute function public.audit();

-- Answers are merged key by key; the support profile is replaced whole (it is a snapshot).
create function public.sync_push_family_intakes(r jsonb) returns void
language sql security invoker set search_path = '' as $$
  insert into public.family_intakes as x (learner_id, data, updated_by) values ((r ->> 'id')::uuid, coalesce(r -> 'data', '{}'), (select auth.uid()))
  on conflict (learner_id) do update set data = x.data || excluded.data, updated_by = excluded.updated_by
$$;
create function public.sync_push_intake_team(r jsonb) returns void
language sql security invoker set search_path = '' as $$
  insert into public.intake_team as x (learner_id, data, updated_by) values ((r ->> 'id')::uuid, coalesce(r -> 'data', '{}'), (select auth.uid()))
  on conflict (learner_id) do update set data = x.data || excluded.data, updated_by = excluded.updated_by
$$;
create function public.sync_push_support_profiles(r jsonb) returns void
language sql security invoker set search_path = '' as $$
  insert into public.support_profiles as x (learner_id, data, shared_by, updated_by) values ((r ->> 'id')::uuid, coalesce(r -> 'data', '{}'), coalesce(r ->> 'by', ''), (select auth.uid()))
  on conflict (learner_id) do update set data = excluded.data, shared_by = excluded.shared_by, updated_by = excluded.updated_by
$$;
create function public.sync_pull_family_intakes(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('family_intakes', coalesce(jsonb_agg(jsonb_build_object('id', x.learner_id, 'data', x.data)), '[]'))
  from public.family_intakes x where x.updated_at > since
$$;
create function public.sync_pull_intake_team(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('intake_team', coalesce(jsonb_agg(jsonb_build_object('id', x.learner_id, 'data', x.data)), '[]'))
  from public.intake_team x where x.updated_at > since
$$;
create function public.sync_pull_support_profiles(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('support_profiles', coalesce(jsonb_agg(jsonb_build_object('id', x.learner_id, 'data', x.data, 'by', x.shared_by, 'at', x.updated_at)), '[]'))
  from public.support_profiles x where x.updated_at > since
$$;
revoke all on function public.sync_push_family_intakes(jsonb), public.sync_push_intake_team(jsonb), public.sync_push_support_profiles(jsonb),
  public.sync_pull_family_intakes(timestamptz), public.sync_pull_intake_team(timestamptz), public.sync_pull_support_profiles(timestamptz) from public, anon;
grant execute on function public.sync_push_family_intakes(jsonb), public.sync_push_intake_team(jsonb), public.sync_push_support_profiles(jsonb),
  public.sync_pull_family_intakes(timestamptz), public.sync_pull_intake_team(timestamptz), public.sync_pull_support_profiles(timestamptz) to authenticated;

-- Devices also learn whose intakes they may still keep, so an intake leaves a device when sharing is withdrawn.
create or replace function public.sync_pull_visible(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('visible', jsonb_build_object(
    'learners', coalesce((select jsonb_agg(l.id) from public.learners l), '[]'),
    'health', coalesce((select jsonb_agg(l.id) from public.learners l where public.can_see_health(l.id)), '[]'),
    'profiles', coalesce((select jsonb_agg(l.id) from public.learners l where public.can_keep_profile(l.id)), '[]'),
    'intakes', coalesce((select jsonb_agg(l.id) from public.learners l where public.can_see_intake(l.id)), '[]')))
$$;
