-- Support-plan goals, observations against them, and notes (docs/system-design.md, section 5: Individual Support Plans).
-- The tables came with the first migration; this lets them sync, and matches the goal states the portal uses.

alter table public.goals drop constraint goals_status_check;
alter table public.goals add constraint goals_status_check check (status in ('todo', 'doing', 'done', 'paused'));
alter table public.goals alter column status set default 'todo';
alter table public.goal_observations add column received_at timestamptz not null default now(); -- for sync: devices can be offline for weeks
alter table public.notes add column received_at timestamptz not null default now();
create index goals_updated on public.goals (updated_at);
create index goal_observations_received on public.goal_observations (received_at);
create index notes_received on public.notes (received_at);
-- Goal text and the observation note are written by professionals: keep them a sensible length.
alter table public.goal_observations add constraint goal_observations_note_length check (length(note) <= 400);

create or replace function public.sync_push(entries jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare e jsonb; r jsonb; me uuid := auth.uid(); applied uuid[] := '{}'; rejected jsonb := '[]';
begin
  for e in select * from jsonb_array_elements(entries) loop
    begin
      if exists (select 1 from public.sync_applied s where s.entry_id = (e ->> 'id')::uuid) then
        applied := applied || (e ->> 'id')::uuid; continue; -- sent before: already applied
      end if;
      r := e -> 'row';
      case e ->> 'table'
        when 'messages' then
          insert into public.messages (id, learner_id, from_id, from_name, from_role, audience, body, created_at)
          values ((r ->> 'id')::uuid, (r ->> 'learnerId')::uuid, me, '', case when r ->> 'fromRole' = 'learner' then 'learner' else '' end,
                  r ->> 'audience', r ->> 'body', (r ->> 'createdAt')::timestamptz) -- sender filled in by stamp_sender
          on conflict (id) do nothing; -- messages are append only
          if r -> 'readBy' ? me::text then
            insert into public.message_reads (message_id, user_id) values ((r ->> 'id')::uuid, me) on conflict do nothing;
          end if;
        when 'medications' then
          insert into health.medications (id, learner_id, name, dose, schedule, reason, started_on, stopped_on, created_by)
          values ((r ->> 'id')::uuid, (r ->> 'learnerId')::uuid, r ->> 'name', r ->> 'dose', r ->> 'schedule', r ->> 'reason', (r ->> 'startedOn')::date, (r ->> 'stoppedOn')::date, me)
          on conflict (id) do update set stopped_on = excluded.stopped_on; -- the only change after creation
        when 'doses' then
          insert into health.doses (id, learner_id, medication_id, given_at, given_by, note)
          values ((r ->> 'id')::uuid, (r ->> 'learnerId')::uuid, (r ->> 'medicationId')::uuid, (r ->> 'givenAt')::timestamptz, r ->> 'givenBy', coalesce(r ->> 'note', ''))
          on conflict (id) do nothing;
        when 'health_log' then
          insert into health.log (id, learner_id, at, by_name, text)
          values ((r ->> 'id')::uuid, (r ->> 'learnerId')::uuid, (r ->> 'at')::timestamptz, r ->> 'by', r ->> 'text')
          on conflict (id) do nothing;
        when 'goals' then -- created by the team; status changes later (latest wins)
          insert into public.goals (id, learner_id, text, area, status, target, created_by, created_at)
          values ((r ->> 'id')::uuid, (r ->> 'learnerId')::uuid, r ->> 'text', r ->> 'area', r ->> 'status', nullif(r ->> 'target', '')::date, me, (r ->> 'createdAt')::timestamptz)
          on conflict (id) do update set status = excluded.status, text = excluded.text, target = excluded.target;
        when 'observations' then
          insert into public.goal_observations (id, goal_id, learner_id, level, note, observed_by, observed_at)
          values ((r ->> 'id')::uuid, (r ->> 'goalId')::uuid, (r ->> 'learnerId')::uuid, r ->> 'level', coalesce(r ->> 'note', ''), me, (r ->> 'at')::timestamptz)
          on conflict (id) do nothing; -- append only
        when 'notes' then
          insert into public.notes (id, learner_id, author_id, body, share_family, created_at)
          values ((r ->> 'id')::uuid, (r ->> 'learnerId')::uuid, me, r ->> 'body', coalesce((r ->> 'shareFamily')::boolean, false), (r ->> 'createdAt')::timestamptz)
          on conflict (id) do nothing; -- append only
        when 'concerns' then
          perform public.sync_push_concern(r); -- safeguarding (20261112010000_safeguarding.sql)
        when 'attempts' then
          insert into public.attempts (id, learner_id, activity_id, status, mode, hints, flags, reflection, occurred_at, recorded_by)
          values ((r ->> 'id')::uuid, (r ->> 'learnerId')::uuid, r ->> 'activityId', r ->> 'status', r ->> 'mode', (r ->> 'hints')::smallint,
                  nullif(r -> 'flags', 'null'::jsonb), coalesce(r ->> 'reflection', ''), (r ->> 'occurredAt')::timestamptz, me)
          on conflict (id, occurred_at) do nothing; -- append only
        when 'learners' then -- the device only changes consent; the server decides everything else
          update public.learner_consent set guardian = (r -> 'consent' ->> 'guardian')::boolean, support = (r -> 'consent' ->> 'support')::boolean,
            share = (r -> 'consent' ->> 'share')::boolean, health = (r -> 'consent' ->> 'health')::boolean, updated_by = me
          where learner_id = (r ->> 'id')::uuid;
          if not found then raise exception 'not allowed'; end if;
          update public.learner_team t set health_access = (m ->> 'healthAccess')::boolean
          from jsonb_array_elements(r -> 'team') m
          where t.learner_id = (r ->> 'id')::uuid and t.user_id = (m ->> 'userId')::uuid and t.health_access is distinct from (m ->> 'healthAccess')::boolean;
        else raise exception 'unknown table %', e ->> 'table';
      end case;
      insert into public.sync_applied (entry_id, user_id) values ((e ->> 'id')::uuid, me);
      applied := applied || (e ->> 'id')::uuid;
    exception when others then
      rejected := rejected || jsonb_build_object('id', e ->> 'id', 'reason', sqlerrm);
    end;
  end loop;
  return jsonb_build_object('applied', to_jsonb(applied), 'rejected', rejected);
end $$;

create or replace function public.sync_pull(since timestamptz default null) returns jsonb
language plpgsql security invoker stable set search_path = '' as $$
declare s timestamptz := coalesce(since, '-infinity'::timestamptz); cursor timestamptz := now() - interval '5 seconds';
begin
  return jsonb_build_object('cursor', cursor, 'changes', jsonb_build_object(
    'learners', coalesce((select jsonb_agg(jsonb_build_object(
        'id', l.id, 'orgId', l.org_id, 'nickname', l.nickname, 'cohort', l.cohort, 'curriculum', l.curriculum, 'level', l.level,
        'guardianIds', coalesce((select jsonb_agg(g.user_id) from public.learner_guardians g where g.learner_id = l.id), '[]'),
        'team', coalesce((select jsonb_agg(jsonb_build_object('userId', t.user_id, 'healthAccess', t.health_access)) from public.learner_team t where t.learner_id = l.id), '[]'),
        'consent', (select jsonb_build_object('guardian', c.guardian, 'support', c.support, 'share', c.share, 'health', c.health, 'law', c.law, 'updatedAt', c.updated_at)
                    from public.learner_consent c where c.learner_id = l.id)))
      from public.learners l where l.updated_at > s), '[]'),
    'accounts', coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'name', p.name, 'email', p.email, 'profession', p.profession,
        'role', public.account_role(p.id) ->> 'role', 'orgId', public.account_role(p.id) ->> 'orgId'))
      from public.profiles p where p.updated_at > s), '[]'),
    'messages', coalesce((select jsonb_agg(jsonb_build_object('id', m.id, 'learnerId', m.learner_id, 'fromId', m.from_id, 'fromName', m.from_name,
        'fromRole', m.from_role, 'audience', m.audience, 'body', m.body, 'createdAt', m.created_at,
        'readBy', coalesce((select jsonb_agg(r.user_id) from public.message_reads r where r.message_id = m.id), '[]')))
      from public.messages m where m.updated_at > s or exists (select 1 from public.message_reads r where r.message_id = m.id and r.read_at > s)), '[]'),
    'medications', coalesce((select jsonb_agg(jsonb_build_object('id', x.id, 'learnerId', x.learner_id, 'name', x.name, 'dose', x.dose, 'schedule', x.schedule,
        'reason', x.reason, 'startedOn', x.started_on, 'stoppedOn', x.stopped_on, 'createdBy', x.created_by)) from health.medications x where x.updated_at > s), '[]'),
    'doses', coalesce((select jsonb_agg(jsonb_build_object('id', d.id, 'learnerId', d.learner_id, 'medicationId', d.medication_id, 'givenAt', d.given_at,
        'givenBy', d.given_by, 'note', d.note)) from health.doses d where d.updated_at > s), '[]'),
    'health_log', coalesce((select jsonb_agg(jsonb_build_object('id', h.id, 'learnerId', h.learner_id, 'at', h.at, 'by', h.by_name, 'text', h.text))
      from health.log h where h.updated_at > s), '[]'),
    'goals', coalesce((select jsonb_agg(jsonb_build_object('id', g.id, 'learnerId', g.learner_id, 'text', g.text, 'area', g.area, 'status', g.status,
        'target', g.target, 'createdBy', g.created_by, 'createdAt', g.created_at)) from public.goals g where g.updated_at > s), '[]'),
    'observations', coalesce((select jsonb_agg(jsonb_build_object('id', o.id, 'goalId', o.goal_id, 'learnerId', o.learner_id, 'level', o.level, 'note', o.note,
        'by', o.observed_by, 'byName', (select p.name from public.profiles p where p.id = o.observed_by), 'at', o.observed_at))
      from public.goal_observations o where o.received_at > s), '[]'),
    'notes', coalesce((select jsonb_agg(jsonb_build_object('id', n.id, 'learnerId', n.learner_id, 'authorId', n.author_id,
        'authorName', (select p.name from public.profiles p where p.id = n.author_id), 'body', n.body, 'shareFamily', n.share_family, 'createdAt', n.created_at))
      from public.notes n where n.received_at > s), '[]'),
    -- Attempts never change once made, so only new ones are sent (by when they were recorded on the server).
    'attempts', coalesce((select jsonb_agg(jsonb_build_object('id', a.id, 'learnerId', a.learner_id, 'activityId', a.activity_id, 'status', a.status,
        'mode', a.mode, 'hints', a.hints, 'flags', a.flags, 'reflection', a.reflection, 'occurredAt', a.occurred_at))
      from public.attempts a where a.received_at > s), '[]')));
end $$;
