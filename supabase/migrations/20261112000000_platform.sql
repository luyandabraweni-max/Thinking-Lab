-- Thinking Lab platform: schema, access rules, audit and sync.
-- Plain PostgreSQL (16+), so it runs on Supabase today and on any Postgres host later. The only Supabase-specific
-- pieces are auth.users, auth.uid() and the "authenticated" role, which a self-hosted setup provides the same way.
-- Design: docs/system-design.md, sections 9 to 11. Sizing: docs/architecture/capacity.md.

-- ---------- Organisations: platform > organisation > site > group ----------
create type public.adult_role as enum ('guardian', 'teacher', 'specialist', 'site_admin', 'org_admin');
create type public.law as enum ('POPIA', 'GDPR');

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 200),
  kind text not null default 'families' check (kind in ('families', 'school', 'network', 'district', 'ngo', 'employer')),
  country char(2) not null default 'ZA',
  law public.law not null default 'POPIA',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations on delete cascade,
  name text not null check (length(name) between 1 and 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.groups (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites on delete cascade,
  name text not null check (length(name) between 1 and 200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Adults. Children never have an auth account with an email (section 11).
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null check (length(name) between 1 and 200),
  email text not null,
  profession text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.memberships (
  user_id uuid not null references public.profiles on delete cascade,
  org_id uuid not null references public.organisations on delete cascade,
  site_id uuid references public.sites on delete cascade,
  role public.adult_role not null,
  created_at timestamptz not null default now(),
  primary key (user_id, org_id, role)
);
create index memberships_org on public.memberships (org_id);

-- ---------- Learners: pseudonymous; health data kept apart in the health schema ----------
create table public.learners (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organisations on delete restrict,
  group_id uuid references public.groups on delete set null,
  nickname text not null check (length(nickname) between 1 and 60),
  cohort text not null check (cohort in ('early', 'child', 'teen', 'adult')),
  curriculum text not null default 'CAPS',
  level text not null default '',
  created_by uuid not null references public.profiles,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index learners_org on public.learners (org_id);
create index learners_group on public.learners (group_id);
create index learners_updated on public.learners (updated_at);

create table public.learner_guardians (
  learner_id uuid not null references public.learners on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (learner_id, user_id)
);
create index learner_guardians_user on public.learner_guardians (user_id);

-- Teachers and specialists the family shared the learner with. Health access is granted separately, per person.
create table public.learner_team (
  learner_id uuid not null references public.learners on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  health_access boolean not null default false,
  granted_by uuid not null references public.profiles,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (learner_id, user_id)
);
create index learner_team_user on public.learner_team (user_id);

create table public.learner_consent (
  learner_id uuid primary key references public.learners on delete cascade,
  guardian boolean not null default false,
  support boolean not null default false,
  share boolean not null default false,
  health boolean not null default false,
  law public.law not null default 'POPIA',
  updated_by uuid references public.profiles,
  updated_at timestamptz not null default now()
);
-- Every consent change is kept: who, what and when (section 12).
create table public.consent_history (
  id bigint generated always as identity primary key,
  learner_id uuid not null references public.learners on delete cascade,
  consent jsonb not null,
  changed_by uuid,
  changed_at timestamptz not null default now()
);
create index consent_history_learner on public.consent_history (learner_id, changed_at);

-- ---------- Team working ----------
create table public.messages (
  id uuid primary key, -- made on the device, so a message sent twice is saved once
  learner_id uuid not null references public.learners on delete cascade,
  from_id uuid not null references public.profiles,
  from_name text not null,
  from_role text not null,
  audience text not null check (audience in ('team', 'learner')),
  body text not null check (length(body) between 1 and 4000),
  created_at timestamptz not null,
  updated_at timestamptz not null default now()
);
create index messages_learner on public.messages (learner_id, created_at);
create index messages_updated on public.messages (updated_at);
create table public.message_reads (
  message_id uuid not null references public.messages on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  read_at timestamptz not null default now(),
  primary key (message_id, user_id)
);
create index message_reads_user on public.message_reads (user_id);
create index message_reads_read on public.message_reads (read_at);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners on delete cascade,
  text text not null check (length(text) between 1 and 500),
  area text not null,
  status text not null default 'doing' check (status in ('doing', 'done', 'paused')),
  target date,
  created_by uuid not null references public.profiles,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index goals_learner on public.goals (learner_id);
create table public.goal_observations (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals on delete cascade,
  learner_id uuid not null references public.learners on delete cascade,
  level text not null check (level in ('notyet', 'support', 'alone')),
  note text not null default '',
  observed_by uuid not null references public.profiles,
  observed_at timestamptz not null default now()
);
create index goal_observations_goal on public.goal_observations (goal_id, observed_at);
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learners on delete cascade,
  author_id uuid not null references public.profiles,
  body text not null check (length(body) between 1 and 4000),
  share_family boolean not null default false,
  created_at timestamptz not null default now()
);
create index notes_learner on public.notes (learner_id, created_at);

-- ---------- Progress: append only, partitioned by month so it stays fast as it grows ----------
create table public.attempts (
  id uuid not null,
  learner_id uuid not null references public.learners on delete cascade,
  activity_id text not null,
  status text not null check (status in ('alone', 'support', 'notyet', 'open')),
  mode text not null default 'tap',
  hints smallint not null default 0,
  flags jsonb,
  reflection text not null default '',
  occurred_at timestamptz not null,
  recorded_by uuid not null references public.profiles,
  primary key (id, occurred_at)
) partition by range (occurred_at);
create index attempts_learner on public.attempts (learner_id, occurred_at);
create table public.attempts_default partition of public.attempts default;

-- Creates the monthly partitions from this month on. Run monthly (Supabase: pg_cron) to stay ahead.
create function public.ensure_attempt_partitions(months_ahead int default 12) returns void
language plpgsql set search_path = '' as $$
declare m date := date_trunc('month', now())::date; name text;
begin
  for i in 0..months_ahead loop
    name := 'attempts_' || to_char(m, 'YYYY_MM');
    if to_regclass('public.' || name) is null then
      execute format('create table public.%I partition of public.attempts for values from (%L) to (%L)', name, m, (m + interval '1 month')::date);
    end if;
    m := (m + interval '1 month')::date;
  end loop;
end $$;
select public.ensure_attempt_partitions(12);

-- ---------- Health: a separate schema with stricter access (section 10) ----------
create schema health;
create table health.medications (
  id uuid primary key,
  learner_id uuid not null references public.learners on delete cascade,
  name text not null check (length(name) between 1 and 200),
  dose text not null check (length(dose) between 1 and 100),
  schedule text not null default '',
  reason text not null default '',
  started_on date not null,
  stopped_on date,
  created_by uuid not null references public.profiles,
  updated_at timestamptz not null default now()
);
create index medications_learner on health.medications (learner_id);
create index medications_updated on health.medications (updated_at);
create table health.doses (
  id uuid primary key,
  learner_id uuid not null references public.learners on delete cascade,
  medication_id uuid not null references health.medications on delete cascade,
  given_at timestamptz not null,
  given_by text not null,
  note text not null default '',
  updated_at timestamptz not null default now()
);
create index doses_learner on health.doses (learner_id, given_at);
create index doses_updated on health.doses (updated_at);
create table health.log (
  id uuid primary key,
  learner_id uuid not null references public.learners on delete cascade,
  at timestamptz not null,
  by_name text not null,
  text text not null check (length(text) between 1 and 1000),
  updated_at timestamptz not null default now()
);
create index health_log_learner on health.log (learner_id, at);
create index health_log_updated on health.log (updated_at);

-- ---------- Audit: append only; nobody can read it through the API ----------
create table public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor uuid,
  action text not null,
  table_name text not null,
  row_id text,
  learner_id uuid
);
create index audit_log_learner on public.audit_log (learner_id, at);

create function public.audit() returns trigger
language plpgsql security definer set search_path = '' as $$
declare r jsonb := to_jsonb(coalesce(new, old));
begin
  insert into public.audit_log (actor, action, table_name, row_id, learner_id)
  values (auth.uid(), lower(tg_op), tg_table_schema || '.' || tg_table_name,
          coalesce(r ->> 'id', r ->> 'learner_id'), nullif(coalesce(r ->> 'learner_id', case when tg_table_name = 'learners' then r ->> 'id' end), '')::uuid);
  return coalesce(new, old);
end $$;
create trigger audit after insert or update or delete on health.medications for each row execute function public.audit();
create trigger audit after insert or update or delete on health.doses for each row execute function public.audit();
create trigger audit after insert or update or delete on public.learner_consent for each row execute function public.audit();
create trigger audit after insert or update or delete on public.learner_team for each row execute function public.audit();
create trigger audit after insert or update or delete on public.learner_guardians for each row execute function public.audit();
create trigger audit after insert or delete on public.learners for each row execute function public.audit();

create function public.keep_consent_history() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.consent_history (learner_id, consent, changed_by)
  values (new.learner_id, jsonb_build_object('guardian', new.guardian, 'support', new.support, 'share', new.share, 'health', new.health, 'law', new.law), auth.uid());
  return new;
end $$;
create trigger history after insert or update on public.learner_consent for each row execute function public.keep_consent_history();

-- updated_at drives sync: every change moves the row past the device's cursor.
create function public.touch() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at := now(); return new; end $$;
create trigger touch before update on public.organisations for each row execute function public.touch();
create trigger touch before update on public.sites for each row execute function public.touch();
create trigger touch before update on public.groups for each row execute function public.touch();
create trigger touch before update on public.profiles for each row execute function public.touch();
create trigger touch before update on public.learners for each row execute function public.touch();
create trigger touch before update on public.learner_team for each row execute function public.touch();
create trigger touch before update on public.learner_consent for each row execute function public.touch();
create trigger touch before update on public.goals for each row execute function public.touch();
create trigger touch before update on health.medications for each row execute function public.touch();
-- A team or consent change also changes what the learner card shows.
create function public.touch_learner() returns trigger language plpgsql security definer set search_path = '' as $$
begin update public.learners set updated_at = now() where id = coalesce(new.learner_id, old.learner_id); return coalesce(new, old); end $$;
create trigger touch_learner after insert or update or delete on public.learner_team for each row execute function public.touch_learner();
create trigger touch_learner after insert or update or delete on public.learner_guardians for each row execute function public.touch_learner();
create trigger touch_learner after insert or update on public.learner_consent for each row execute function public.touch_learner();

-- The server, not the device, says who sent a message.
create function public.stamp_sender() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  new.from_id := auth.uid();
  if new.from_role = 'learner' then -- a learner's reply, synced by an adult on their team who opened the learner's space
    select l.nickname into new.from_name from public.learners l where l.id = new.learner_id;
    return new;
  end if;
  select p.name into new.from_name from public.profiles p where p.id = auth.uid();
  new.from_role := case when exists (select 1 from public.learner_guardians g where g.learner_id = new.learner_id and g.user_id = auth.uid()) then 'guardian'
    else coalesce((select m.role::text from public.memberships m where m.user_id = auth.uid() and m.role in ('teacher', 'specialist') order by m.created_at limit 1), 'specialist') end;
  return new;
end $$;
create trigger stamp_sender before insert on public.messages for each row execute function public.stamp_sender();

-- ---------- Access rules ----------
-- Security definer so the checks can read the link tables without going round in circles through their own rules.
create function public.is_guardian(l uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.learner_guardians g where g.learner_id = l and g.user_id = auth.uid())
$$;
create function public.is_team(l uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.learner_team t join public.learner_consent c on c.learner_id = t.learner_id
                 where t.learner_id = l and t.user_id = auth.uid() and c.share)
$$;
create function public.can_see_learner(l uuid) returns boolean
language sql stable set search_path = '' as $$ select public.is_guardian(l) or public.is_team(l) $$;
create function public.can_see_health(l uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select public.is_guardian(l) or exists (
    select 1 from public.learner_team t join public.learner_consent c on c.learner_id = t.learner_id
    where t.learner_id = l and t.user_id = auth.uid() and t.health_access and c.share and c.health)
$$;
-- Adults can see each other's names only when they share a learner.
create function public.knows(other uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select other = auth.uid() or exists (
    select 1 from (select learner_id, user_id from public.learner_guardians union all select learner_id, user_id from public.learner_team) a
    join (select learner_id, user_id from public.learner_guardians union all select learner_id, user_id from public.learner_team) b on a.learner_id = b.learner_id
    where a.user_id = auth.uid() and b.user_id = other)
$$;

-- Another adult's role and organisation, only for people who share a learner with the caller.
create function public.account_role(u uuid) returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('role', m.role, 'orgId', m.org_id) from public.memberships m
  where m.user_id = u and public.knows(u) order by m.created_at limit 1
$$;

alter table public.organisations enable row level security;
alter table public.sites enable row level security;
alter table public.groups enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.learners enable row level security;
alter table public.learner_guardians enable row level security;
alter table public.learner_team enable row level security;
alter table public.learner_consent enable row level security;
alter table public.consent_history enable row level security;
alter table public.messages enable row level security;
alter table public.message_reads enable row level security;
alter table public.goals enable row level security;
alter table public.goal_observations enable row level security;
alter table public.notes enable row level security;
alter table public.attempts enable row level security;
alter table public.audit_log enable row level security;
alter table health.medications enable row level security;
alter table health.doses enable row level security;
alter table health.log enable row level security;

create policy own on public.profiles for select using (public.knows(id));
create policy own_update on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy own on public.memberships for select using (user_id = auth.uid());
create policy member on public.organisations for select using (exists (select 1 from public.memberships m where m.org_id = id and m.user_id = auth.uid()));

create policy see on public.learners for select using (public.can_see_learner(id));
create policy family_edit on public.learners for update using (public.is_guardian(id)) with check (public.is_guardian(id));
create policy see on public.learner_guardians for select using (public.can_see_learner(learner_id));
create policy see on public.learner_team for select using (public.can_see_learner(learner_id));
create policy family_share on public.learner_team for insert with check (public.is_guardian(learner_id) and granted_by = auth.uid());
create policy family_change on public.learner_team for update using (public.is_guardian(learner_id)) with check (public.is_guardian(learner_id));
create policy family_unshare on public.learner_team for delete using (public.is_guardian(learner_id));
create policy see on public.learner_consent for select using (public.can_see_learner(learner_id));
create policy family_consent on public.learner_consent for update using (public.is_guardian(learner_id)) with check (public.is_guardian(learner_id) and updated_by = auth.uid());
create policy family on public.consent_history for select using (public.is_guardian(learner_id));

create policy see on public.messages for select using (public.can_see_learner(learner_id));
create policy send on public.messages for insert with check (public.can_see_learner(learner_id) and from_id = auth.uid());
create policy see on public.message_reads for select using (exists (select 1 from public.messages m where m.id = message_id and public.can_see_learner(m.learner_id)));
create policy mark on public.message_reads for insert with check (user_id = auth.uid() and exists (select 1 from public.messages m where m.id = message_id and public.can_see_learner(m.learner_id)));

create policy see on public.goals for select using (public.can_see_learner(learner_id));
create policy team on public.goals for insert with check (public.is_team(learner_id) and created_by = auth.uid());
create policy team_edit on public.goals for update using (public.is_team(learner_id)) with check (public.is_team(learner_id));
create policy see on public.goal_observations for select using (public.can_see_learner(learner_id));
create policy team on public.goal_observations for insert with check (public.is_team(learner_id) and observed_by = auth.uid());
-- Notes: the author and the team always; the family only when shared with them.
create policy see on public.notes for select using (public.is_team(learner_id) or (share_family and public.is_guardian(learner_id)));
create policy team on public.notes for insert with check (public.is_team(learner_id) and author_id = auth.uid());

create policy see on public.attempts for select using (public.can_see_learner(learner_id));
create policy record on public.attempts for insert with check (public.can_see_learner(learner_id) and recorded_by = auth.uid());

create policy see on health.medications for select using (public.can_see_health(learner_id));
create policy family on health.medications for insert with check (public.is_guardian(learner_id) and created_by = auth.uid());
create policy family_edit on health.medications for update using (public.is_guardian(learner_id)) with check (public.is_guardian(learner_id));
create policy see on health.doses for select using (public.can_see_health(learner_id));
create policy family on health.doses for insert with check (public.is_guardian(learner_id));
create policy see on health.log for select using (public.can_see_health(learner_id));
create policy family on health.log for insert with check (public.is_guardian(learner_id));
-- audit_log: no policies, so the API can never read or change it.

-- ---------- Registering an adult after their first sign-in (Google or an email code) ----------
create function public.register_adult(p_name text, p_role public.adult_role, p_profession text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); org uuid;
begin
  if me is null then raise exception 'Sign in first'; end if;
  if p_role not in ('guardian', 'teacher', 'specialist') then raise exception 'School and organisation admins are set up when the organisation joins'; end if;
  insert into public.profiles (id, name, email, profession)
  values (me, p_name, coalesce((select u.email from auth.users u where u.id = me), ''), p_profession)
  on conflict (id) do update set name = excluded.name, profession = excluded.profession;
  if not exists (select 1 from public.memberships m where m.user_id = me and m.role = p_role) then
    -- Families and independent practitioners each get their own organisation; schools add staff to theirs.
    insert into public.organisations (name, kind) values (case when p_role = 'guardian' then 'Families' else p_name || ' (independent)' end, 'families') returning id into org;
    insert into public.memberships (user_id, org_id, role) values (me, org, p_role);
  end if;
end $$;

-- ---------- Registering a learner: the learner, its guardian link and consent in one step ----------
create function public.register_learner(p_nickname text, p_cohort text, p_curriculum text, p_level text, p_org uuid default null)
returns uuid language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); org uuid := p_org; lid uuid;
begin
  if me is null then raise exception 'Sign in first'; end if;
  if org is null then -- families who sign up directly belong to their own "Families" organisation
    select m.org_id into org from public.memberships m where m.user_id = me and m.role = 'guardian' limit 1;
    if org is null then
      insert into public.organisations (name) values ('Families') returning id into org;
      insert into public.memberships (user_id, org_id, role) values (me, org, 'guardian');
    end if;
  elsif not exists (select 1 from public.memberships m where m.user_id = me and m.org_id = org) then
    raise exception 'Not a member of that organisation';
  end if;
  insert into public.learners (org_id, nickname, cohort, curriculum, level, created_by) values (org, p_nickname, p_cohort, p_curriculum, p_level, me) returning id into lid;
  insert into public.learner_guardians (learner_id, user_id) values (lid, me);
  insert into public.learner_consent (learner_id, guardian, updated_by) values (lid, true, me);
  return lid;
end $$;

-- ---------- Sync (section 9): the device's outbox in, changes since its cursor out ----------
create table public.sync_applied (
  entry_id uuid primary key,
  user_id uuid not null,
  applied_at timestamptz not null default now()
);
create index sync_applied_at on public.sync_applied (applied_at); -- old rows can be pruned after 30 days
alter table public.sync_applied enable row level security;
create policy own on public.sync_applied for select using (user_id = auth.uid());
create policy own_insert on public.sync_applied for insert with check (user_id = auth.uid());

-- Security invoker: every write below goes through the caller's own access rules.
create function public.sync_push(entries jsonb) returns jsonb
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

-- Everything the caller may see that changed since the cursor. The 5-second overlap catches changes still
-- committing when the last pull ran; receiving a row twice is harmless.
create function public.sync_pull(since timestamptz default null) returns jsonb
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
      from health.log h where h.updated_at > s), '[]')));
end $$;

-- ---------- What the API roles may touch (row-level security narrows it further) ----------
revoke all on all tables in schema public from anon;
revoke all on all functions in schema public from public, anon;
grant usage on schema health to authenticated;
grant select, insert, update on public.profiles, public.learners, public.learner_consent, public.goals, health.medications to authenticated;
grant select, insert, update, delete on public.learner_team to authenticated;
grant select, insert on public.messages, public.message_reads, public.goal_observations, public.notes, public.attempts,
  health.doses, health.log, public.sync_applied to authenticated;
grant select on public.organisations, public.sites, public.groups, public.memberships, public.learner_guardians, public.consent_history to authenticated;
grant execute on function public.register_adult, public.register_learner, public.sync_push, public.sync_pull, public.can_see_learner, public.can_see_health,
  public.is_guardian, public.is_team, public.knows, public.account_role to authenticated;
