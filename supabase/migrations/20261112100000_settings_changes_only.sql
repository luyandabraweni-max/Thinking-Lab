-- Devices now send only the settings they changed (packages/data: writeChanges), so an older copy on one device never
-- undoes a newer change made on another. A field that isn't sent keeps its value. Also: the learner's My way choices
-- (prefs), so they follow the learner between the family's and the team's devices.

alter table public.learner_settings add column prefs jsonb check (prefs is null or (jsonb_typeof(prefs) = 'object' and length(prefs::text) <= 2000));

create or replace function public.sync_push_learner_settings(r jsonb) returns void
language sql security invoker set search_path = '' as $$
  insert into public.learner_settings as x (learner_id, adapt_auto, adapt_off, levels, decisions, log, plan, last_plan, avatar, prefs, updated_by)
  values ((r ->> 'id')::uuid, coalesce((r ->> 'adaptAuto')::boolean, true), coalesce(r -> 'adaptOff', '{}'), coalesce(r -> 'levels', '{}'),
          coalesce(r -> 'decisions', '{}'), coalesce(r -> 'log', '[]'), nullif(r -> 'plan', 'null'::jsonb), nullif(r -> 'lastPlan', 'null'::jsonb),
          nullif(r -> 'avatar', 'null'::jsonb), nullif(r -> 'prefs', 'null'::jsonb), (select auth.uid()))
  on conflict (learner_id) do update set
    adapt_auto = case when r ? 'adaptAuto' then excluded.adapt_auto else x.adapt_auto end,
    adapt_off = case when r ? 'adaptOff' then excluded.adapt_off else x.adapt_off end,
    levels = case when r ? 'levels' then excluded.levels else x.levels end,
    decisions = x.decisions || excluded.decisions,
    plan = case when r ? 'plan' then excluded.plan else x.plan end,
    last_plan = case when r ? 'lastPlan' then excluded.last_plan else x.last_plan end,
    avatar = case when r ? 'avatar' then coalesce(excluded.avatar, x.avatar) else x.avatar end,
    prefs = case when r ? 'prefs' then excluded.prefs else x.prefs end,
    updated_by = excluded.updated_by,
    log = (select coalesce(jsonb_agg(distinct v order by v), '[]') from jsonb_array_elements(x.log || excluded.log) v)
$$;
create or replace function public.sync_pull_learner_settings(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('learner_settings', coalesce(jsonb_agg(jsonb_build_object('id', x.learner_id, 'adaptAuto', x.adapt_auto, 'adaptOff', x.adapt_off,
    'levels', x.levels, 'decisions', x.decisions, 'log', x.log, 'plan', x.plan, 'lastPlan', x.last_plan, 'avatar', x.avatar, 'prefs', x.prefs)), '[]'))
  from public.learner_settings x where x.updated_at > since
$$;
