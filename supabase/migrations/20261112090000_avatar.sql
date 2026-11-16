-- The learner's character (2to.iQ Avatar System), kept with their settings so it follows them between the family's
-- and the team's devices. Only option names, colour numbers and a made-up name: never a photo.

alter table public.learner_settings add column avatar jsonb check (avatar is null or (jsonb_typeof(avatar) = 'object' and length(avatar::text) <= 1000));

create or replace function public.sync_push_learner_settings(r jsonb) returns void
language sql security invoker set search_path = '' as $$
  insert into public.learner_settings as x (learner_id, adapt_auto, adapt_off, levels, decisions, log, plan, last_plan, avatar, updated_by)
  values ((r ->> 'id')::uuid, coalesce((r ->> 'adaptAuto')::boolean, true), coalesce(r -> 'adaptOff', '{}'), coalesce(r -> 'levels', '{}'),
          coalesce(r -> 'decisions', '{}'), coalesce(r -> 'log', '[]'), nullif(r -> 'plan', 'null'::jsonb), nullif(r -> 'lastPlan', 'null'::jsonb),
          nullif(r -> 'avatar', 'null'::jsonb), (select auth.uid()))
  on conflict (learner_id) do update set adapt_auto = excluded.adapt_auto, adapt_off = excluded.adapt_off, levels = excluded.levels,
    decisions = x.decisions || excluded.decisions, plan = excluded.plan, last_plan = coalesce(excluded.last_plan, x.last_plan),
    avatar = coalesce(excluded.avatar, x.avatar), updated_by = excluded.updated_by,
    log = (select coalesce(jsonb_agg(distinct v order by v), '[]') from jsonb_array_elements(x.log || excluded.log) v)
$$;
create or replace function public.sync_pull_learner_settings(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('learner_settings', coalesce(jsonb_agg(jsonb_build_object('id', x.learner_id, 'adaptAuto', x.adapt_auto, 'adaptOff', x.adapt_off,
    'levels', x.levels, 'decisions', x.decisions, 'log', x.log, 'plan', x.plan, 'lastPlan', x.last_plan, 'avatar', x.avatar)), '[]'))
  from public.learner_settings x where x.updated_at > since
$$;
