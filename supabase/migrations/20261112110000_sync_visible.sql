-- When a family stops sharing a learner (or turns off health sharing), the server stops sending those records, but a
-- device may still hold copies. Each sync now also says which learners this person may see, and whose health records;
-- the device removes everything else it holds (packages/data/src/sync.ts). Reads only: nothing is deleted here.
create function public.sync_pull_visible(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('visible', jsonb_build_object(
    'learners', coalesce((select jsonb_agg(l.id) from public.learners l), '[]'),
    'health', coalesce((select jsonb_agg(l.id) from public.learners l where public.can_see_health(l.id)), '[]')))
$$;
revoke all on function public.sync_pull_visible(timestamptz) from public, anon;
grant execute on function public.sync_pull_visible(timestamptz) to authenticated;
