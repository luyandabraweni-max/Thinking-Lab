-- The school learner profile (Pholoso Afrika Foundation, School Neurodevelopmental Learner Profile v2.0): what the
-- school observes, rated for impact on access to learning and for the support needed now, the learner's own words,
-- the support plan and the term reviews. One row per learner.
--
-- Kept only by the learner's teachers and specialists (the family shared the learner with them), and only once the
-- family agreed to support needs being recorded. The family's own pages come later, in a separate table.
-- No real names, identity numbers, dates of birth, health conditions or contact details are kept here: health stays
-- in the health schema under its own consent.

create table public.school_profiles (
  learner_id uuid primary key references public.learners on delete cascade,
  answers jsonb not null default '{}' check (jsonb_typeof(answers) = 'object'), -- the profile and school context
  voice jsonb not null default '{}' check (jsonb_typeof(voice) = 'object'),     -- in the learner's own words
  ratings jsonb not null default '{}' check (jsonb_typeof(ratings) = 'object'), -- observations, by item id
  plan jsonb not null default '{}' check (jsonb_typeof(plan) = 'object'),       -- the support plan, by row id
  reviews jsonb not null default '{}' check (jsonb_typeof(reviews) = 'object'), -- baseline and term reviews
  updated_by uuid references public.profiles,
  updated_at timestamptz not null default now(),
  constraint school_profile_size check (pg_column_size(answers) + pg_column_size(voice) + pg_column_size(ratings) + pg_column_size(plan) + pg_column_size(reviews) < 2000000)
);
create index school_profiles_updated on public.school_profiles (updated_at);
create index school_profiles_updated_by on public.school_profiles (updated_by);
alter table public.school_profiles enable row level security;

create function public.can_keep_profile(l uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_team(l) and exists (select 1 from public.learner_consent c where c.learner_id = l and c.support)
$$;
revoke all on function public.can_keep_profile(uuid) from public, anon;
grant execute on function public.can_keep_profile(uuid) to authenticated;

create policy see on public.school_profiles for select using (public.can_keep_profile(learner_id));
create policy change on public.school_profiles for insert with check (public.can_keep_profile(learner_id) and updated_by = (select auth.uid()));
create policy change_update on public.school_profiles for update using (public.can_keep_profile(learner_id))
  with check (public.can_keep_profile(learner_id) and updated_by = (select auth.uid()));
grant select, insert, update on public.school_profiles to authenticated;
create trigger touch before update on public.school_profiles for each row execute function public.touch();
create trigger audit after insert or update on public.school_profiles for each row execute function public.audit();

-- Each part is merged key by key: a device sends only the keys it changed, so two teachers rating different
-- observations, or writing different plan rows, never overwrite each other. The latest change to the same key wins.
create function public.sync_push_school_profiles(r jsonb) returns void
language sql security invoker set search_path = '' as $$
  insert into public.school_profiles as x (learner_id, answers, voice, ratings, plan, reviews, updated_by)
  values ((r ->> 'id')::uuid, coalesce(r -> 'answers', '{}'), coalesce(r -> 'voice', '{}'), coalesce(r -> 'ratings', '{}'),
          coalesce(r -> 'plan', '{}'), coalesce(r -> 'reviews', '{}'), (select auth.uid()))
  on conflict (learner_id) do update set
    answers = x.answers || excluded.answers,
    voice = x.voice || excluded.voice,
    ratings = x.ratings || excluded.ratings,
    plan = x.plan || excluded.plan,
    reviews = x.reviews || excluded.reviews,
    updated_by = excluded.updated_by
$$;
create function public.sync_pull_school_profiles(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('school_profiles', coalesce(jsonb_agg(jsonb_build_object('id', x.learner_id, 'answers', x.answers, 'voice', x.voice,
    'ratings', x.ratings, 'plan', x.plan, 'reviews', x.reviews)), '[]'))
  from public.school_profiles x where x.updated_at > since
$$;
revoke all on function public.sync_push_school_profiles(jsonb), public.sync_pull_school_profiles(timestamptz) from public, anon;
grant execute on function public.sync_push_school_profiles(jsonb), public.sync_pull_school_profiles(timestamptz) to authenticated;

-- Devices also learn whose profiles they may still keep, so a profile is removed from a device as soon as the family
-- stops sharing or withdraws consent to record support needs (packages/data/src/sync.ts).
create or replace function public.sync_pull_visible(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('visible', jsonb_build_object(
    'learners', coalesce((select jsonb_agg(l.id) from public.learners l), '[]'),
    'health', coalesce((select jsonb_agg(l.id) from public.learners l where public.can_see_health(l.id)), '[]'),
    'profiles', coalesce((select jsonb_agg(l.id) from public.learners l where public.can_keep_profile(l.id)), '[]')))
$$;
