-- The next-session plan (ported from the live portal's "Plan the next session"): an adult picks up to 5 steps,
-- and the learner sees them as "My plan today" when their next session starts. Taking the plan clears it.

alter table public.learner_settings
  add column plan jsonb,       -- {"steps": [{"key": "x:light", "pic": "☀️", "label": "Light the Village"}], "by": "Ms Dube", "at": "..."}
  add column last_plan jsonb,  -- the plan last taken, with "used" (a date)
  add constraint learner_settings_plan_steps check (plan is null or jsonb_array_length(plan -> 'steps') between 1 and 5);

-- Latest change wins for the plan, as for the switches.
create or replace function public.sync_push_learner_settings(r jsonb) returns void
language sql security invoker set search_path = '' as $$
  insert into public.learner_settings as x (learner_id, adapt_auto, adapt_off, levels, decisions, log, plan, last_plan, updated_by)
  values ((r ->> 'id')::uuid, coalesce((r ->> 'adaptAuto')::boolean, true), coalesce(r -> 'adaptOff', '{}'), coalesce(r -> 'levels', '{}'),
          coalesce(r -> 'decisions', '{}'), coalesce(r -> 'log', '[]'), nullif(r -> 'plan', 'null'::jsonb), nullif(r -> 'lastPlan', 'null'::jsonb), (select auth.uid()))
  on conflict (learner_id) do update set adapt_auto = excluded.adapt_auto, adapt_off = excluded.adapt_off, levels = excluded.levels,
    decisions = x.decisions || excluded.decisions, plan = excluded.plan, last_plan = coalesce(excluded.last_plan, x.last_plan), updated_by = excluded.updated_by,
    log = (select coalesce(jsonb_agg(distinct v order by v), '[]') from jsonb_array_elements(x.log || excluded.log) v)
$$;
create or replace function public.sync_pull_learner_settings(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('learner_settings', coalesce(jsonb_agg(jsonb_build_object('id', x.learner_id, 'adaptAuto', x.adapt_auto, 'adaptOff', x.adapt_off,
    'levels', x.levels, 'decisions', x.decisions, 'log', x.log, 'plan', x.plan, 'lastPlan', x.last_plan)), '[]'))
  from public.learner_settings x where x.updated_at > since
$$;
