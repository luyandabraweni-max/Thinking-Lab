-- The curriculum a learner follows (CAPS, IEB, Cambridge and so on), when the family or the team changes it after the
-- learner was added; until then the learner's own (learners.curriculum) applies. Their lessons follow it.

alter table public.learner_settings add column curriculum text check (curriculum is null or length(curriculum) between 1 and 40);

create or replace function public.sync_push_learner_settings(r jsonb) returns void
language sql security invoker set search_path = '' as $$
  insert into public.learner_settings as x (learner_id, adapt_auto, adapt_off, levels, decisions, log, plan, last_plan, avatar, prefs, maths_subject, curriculum, updated_by)
  values ((r ->> 'id')::uuid, coalesce((r ->> 'adaptAuto')::boolean, true), coalesce(r -> 'adaptOff', '{}'), coalesce(r -> 'levels', '{}'),
          coalesce(r -> 'decisions', '{}'), coalesce(r -> 'log', '[]'), nullif(r -> 'plan', 'null'::jsonb), nullif(r -> 'lastPlan', 'null'::jsonb),
          nullif(r -> 'avatar', 'null'::jsonb), nullif(r -> 'prefs', 'null'::jsonb), r ->> 'mathsSubject', r ->> 'curriculum', (select auth.uid()))
  on conflict (learner_id) do update set
    adapt_auto = case when r ? 'adaptAuto' then excluded.adapt_auto else x.adapt_auto end,
    adapt_off = case when r ? 'adaptOff' then excluded.adapt_off else x.adapt_off end,
    levels = case when r ? 'levels' then excluded.levels else x.levels end,
    decisions = x.decisions || excluded.decisions,
    plan = case when r ? 'plan' then excluded.plan else x.plan end,
    last_plan = case when r ? 'lastPlan' then excluded.last_plan else x.last_plan end,
    avatar = case when r ? 'avatar' then coalesce(excluded.avatar, x.avatar) else x.avatar end,
    prefs = case when r ? 'prefs' then excluded.prefs else x.prefs end,
    maths_subject = case when r ? 'mathsSubject' then excluded.maths_subject else x.maths_subject end,
    curriculum = case when r ? 'curriculum' then excluded.curriculum else x.curriculum end,
    updated_by = excluded.updated_by,
    log = (select coalesce(jsonb_agg(distinct v order by v), '[]') from jsonb_array_elements(x.log || excluded.log) v)
$$;
create or replace function public.sync_pull_learner_settings(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('learner_settings', coalesce(jsonb_agg(jsonb_build_object('id', x.learner_id, 'adaptAuto', x.adapt_auto, 'adaptOff', x.adapt_off,
    'levels', x.levels, 'decisions', x.decisions, 'log', x.log, 'plan', x.plan, 'lastPlan', x.last_plan, 'avatar', x.avatar, 'prefs', x.prefs, 'mathsSubject', x.maths_subject, 'curriculum', x.curriculum)), '[]'))
  from public.learner_settings x where x.updated_at > since
$$;
