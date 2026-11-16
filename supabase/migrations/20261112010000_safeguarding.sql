-- Safeguarding concerns (docs/system-design.md, section 13).
-- When a learner says they feel unsafe, a restricted record goes to the designated safeguarding lead: not to all
-- teachers, and not to the family automatically. Records live in their own schema, are never synced to devices or put
-- in reports, can't be read directly through the API, and every read is logged.

create schema safeguarding;

-- Who is a designated safeguarding lead, for which organisation. Appointed by the organisation's admin.
create table safeguarding.leads (
  org_id uuid not null references public.organisations on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  appointed_by uuid not null references public.profiles,
  appointed_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index leads_user on safeguarding.leads (user_id);

create table safeguarding.concerns (
  id uuid primary key, -- made on the device, so a concern sent twice is saved once
  learner_id uuid not null references public.learners on delete cascade,
  raised_at timestamptz not null,
  raised_from text not null check (raised_from in ('home', 'lesson', 'talk board', 'tell us', 'help')),
  recorded_by uuid not null references public.profiles, -- the adult whose device synced it
  status text not null default 'open' check (status in ('open', 'followed up')),
  action text not null default '' check (length(action) <= 2000),
  closed_by uuid references public.profiles,
  closed_at timestamptz
);
create index concerns_learner on safeguarding.concerns (learner_id, raised_at);
create index concerns_open on safeguarding.concerns (status) where status = 'open';

-- A lead sees concerns about learners in their organisation, and about learners they support on the learner's team.
create function safeguarding.leads_for(l uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from safeguarding.leads s join public.learners x on x.id = l
    where s.user_id = auth.uid() and (s.org_id = x.org_id or public.is_team(l)))
$$;

alter table safeguarding.leads enable row level security;
alter table safeguarding.concerns enable row level security;
-- No policies on concerns: the API can't read or write them directly, only through the functions below.
create policy own on safeguarding.leads for select using (user_id = auth.uid());

create trigger audit after insert or update or delete on safeguarding.concerns for each row execute function public.audit();
create trigger audit after insert or update or delete on safeguarding.leads for each row execute function public.audit();

-- Reading concerns: only through this function, which returns what the caller leads on and logs each read.
create function public.safeguarding_concerns() returns table (id uuid, learner_id uuid, nickname text, raised_at timestamptz, raised_from text, status text, action text, closed_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.audit_log (actor, action, table_name, row_id, learner_id)
  select auth.uid(), 'read', 'safeguarding.concerns', c.id::text, c.learner_id from safeguarding.concerns c where safeguarding.leads_for(c.learner_id);
  return query select c.id, c.learner_id, l.nickname, c.raised_at, c.raised_from, c.status, c.action, c.closed_at
    from safeguarding.concerns c join public.learners l on l.id = c.learner_id
    where safeguarding.leads_for(c.learner_id) order by c.status, c.raised_at desc;
end $$;

create function public.follow_up_concern(p_id uuid, p_action text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  update safeguarding.concerns set status = 'followed up', action = left(p_action, 2000), closed_by = auth.uid(), closed_at = now()
  where id = p_id and safeguarding.leads_for(learner_id);
  if not found then raise exception 'Not allowed'; end if;
end $$;

-- An organisation admin appoints or removes a lead from their organisation's teachers and specialists.
create function public.set_safeguarding_lead(p_org uuid, p_user uuid, p_on boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.memberships m where m.user_id = auth.uid() and m.org_id = p_org and m.role in ('org_admin', 'site_admin')) then raise exception 'Only the organisation''s admin can do this'; end if;
  if p_on then
    if not exists (select 1 from public.memberships m where m.user_id = p_user and m.org_id = p_org and m.role in ('teacher', 'specialist')) then raise exception 'A safeguarding lead must be a teacher or specialist in the organisation'; end if;
    insert into safeguarding.leads (org_id, user_id, appointed_by) values (p_org, p_user, auth.uid()) on conflict do nothing;
  else
    delete from safeguarding.leads where org_id = p_org and user_id = p_user;
  end if;
end $$;

-- Concerns arrive through the normal sync outbox. Security definer, because skipping a duplicate needs read access
-- that the API never gets; the function checks the caller may see the learner instead.
create function public.sync_push_concern(r jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.can_see_learner((r ->> 'learnerId')::uuid) then raise exception 'Not allowed'; end if;
  insert into safeguarding.concerns (id, learner_id, raised_at, raised_from, recorded_by)
  values ((r ->> 'id')::uuid, (r ->> 'learnerId')::uuid, (r ->> 'at')::timestamptz, r ->> 'where', auth.uid())
  on conflict (id) do nothing;
end $$;

grant usage on schema safeguarding to authenticated;
grant select on safeguarding.leads to authenticated;
revoke all on function public.safeguarding_concerns, public.follow_up_concern, public.set_safeguarding_lead, public.sync_push_concern, safeguarding.leads_for from public, anon;
grant execute on function public.safeguarding_concerns, public.follow_up_concern, public.set_safeguarding_lead, public.sync_push_concern, safeguarding.leads_for to authenticated;
