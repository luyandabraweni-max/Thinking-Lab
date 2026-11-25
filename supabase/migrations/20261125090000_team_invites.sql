-- A family adds a teacher or specialist to their child's team by email. Someone who already has a teacher or
-- specialist account joins the team at once; anyone else joins when they register with that email. Only the child's
-- parent or guardian can do this. Health records stay off until the family switches them on for that person.
-- No email is sent from here; the family tells the person. A cancelled or used invitation is kept, marked closed.

create table public.team_invites (
  learner_id uuid not null references public.learners on delete cascade,
  email text not null check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  invited_by uuid not null references public.profiles,
  invited_at timestamptz not null default now(),
  closed_at timestamptz,
  closed_why text check (closed_why in ('cancelled', 'used')),
  primary key (learner_id, email)
);
create index team_invites_email on public.team_invites (email) where closed_at is null;
create index team_invites_by on public.team_invites (invited_by);
alter table public.team_invites enable row level security; -- no policies: only the functions below touch it

/** Returns "added" (they have a teacher or specialist account and are now on the team) or "invited" (they join when they register). */
create function public.invite_to_team(p_learner uuid, p_email text) returns text
language plpgsql security definer set search_path = '' as $$
declare e text := lower(trim(p_email)); who uuid;
begin
  if not public.is_guardian(p_learner) then raise exception 'Only the child''s parent or guardian can add people to the team'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Please check the email address'; end if;
  select p.id into who from public.profiles p where lower(p.email) = e;
  if who is not null then
    if who = auth.uid() then raise exception 'That''s your own email address'; end if;
    if not exists (select 1 from public.memberships m where m.user_id = who and m.role in ('teacher', 'specialist')) then
      raise exception 'That email belongs to a family account. Only teachers and specialists can join a child''s team';
    end if;
    insert into public.learner_team (learner_id, user_id, granted_by) values (p_learner, who, auth.uid()) on conflict do nothing;
    return 'added';
  end if;
  insert into public.team_invites (learner_id, email, invited_by) values (p_learner, e, auth.uid())
  on conflict (learner_id, email) do update set invited_by = excluded.invited_by, invited_at = now(), closed_at = null, closed_why = null;
  return 'invited';
end $$;

create function public.cancel_team_invite(p_learner uuid, p_email text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_guardian(p_learner) then raise exception 'Only the child''s parent or guardian can do this'; end if;
  update public.team_invites set closed_at = now(), closed_why = 'cancelled'
  where learner_id = p_learner and email = lower(trim(p_email)) and closed_at is null;
end $$;

/** The child's waiting invitations, for the family only. */
create function public.team_invites_for(p_learner uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_guardian(p_learner) then raise exception 'Only the child''s parent or guardian can see this'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('email', i.email, 'at', i.invited_at) order by i.invited_at)
    from public.team_invites i where i.learner_id = p_learner and i.closed_at is null), '[]');
end $$;

-- Registering accepts waiting team invitations too, for teachers and specialists (a family account never joins a team).
create or replace function public.register_adult(p_name text, p_role public.adult_role, p_profession text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); org uuid; my_email text;
begin
  if me is null then raise exception 'Sign in first'; end if;
  if p_role not in ('guardian', 'teacher', 'specialist') then raise exception 'School and organisation admins are set up when the organisation joins'; end if;
  select lower(u.email) into my_email from auth.users u where u.id = me;
  insert into public.profiles (id, name, email, profession)
  values (me, p_name, coalesce(my_email, ''), p_profession)
  on conflict (id) do update set name = excluded.name, profession = excluded.profession;
  -- Waiting invitations are accepted first; an independent organisation is made only when none applies.
  insert into public.memberships (user_id, org_id, role)
    select me, i.org_id, i.role from public.staff_invites i where i.email = my_email and i.closed_at is null on conflict do nothing;
  update public.staff_invites set closed_at = now(), closed_why = 'used' where email = my_email and closed_at is null;
  if not exists (select 1 from public.memberships m where m.user_id = me and m.role = p_role) then
    insert into public.organisations (name, kind) values (case when p_role = 'guardian' then 'Families' else p_name || ' (independent)' end, 'families') returning id into org;
    insert into public.memberships (user_id, org_id, role) values (me, org, p_role);
  end if;
  if exists (select 1 from public.memberships m where m.user_id = me and m.role in ('teacher', 'specialist')) then
    insert into public.learner_team (learner_id, user_id, granted_by)
      select i.learner_id, me, i.invited_by from public.team_invites i where i.email = my_email and i.closed_at is null on conflict do nothing;
    update public.team_invites set closed_at = now(), closed_why = 'used' where email = my_email and closed_at is null;
  end if;
end $$;

revoke all on function public.invite_to_team(uuid, text), public.cancel_team_invite(uuid, text), public.team_invites_for(uuid) from public, anon;
grant execute on function public.invite_to_team(uuid, text), public.cancel_team_invite(uuid, text), public.team_invites_for(uuid) to authenticated;
