-- Invitations are closed, not deleted, when cancelled or used: the record of who invited whom is kept.

alter table public.staff_invites add column closed_at timestamptz, add column closed_why text check (closed_why in ('cancelled', 'used'));

create or replace function public.invite_staff(p_org uuid, p_email text, p_role public.adult_role) returns text
language plpgsql security definer set search_path = '' as $$
declare e text := lower(trim(p_email)); who uuid;
begin
  if not public.is_org_admin(p_org) then raise exception 'Only the organisation''s admin can add staff'; end if;
  if p_role not in ('teacher', 'specialist') then raise exception 'Staff are teachers or specialists'; end if;
  if e !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'Please check the email address'; end if;
  select p.id into who from public.profiles p where lower(p.email) = e;
  if who is not null then
    insert into public.memberships (user_id, org_id, role) values (who, p_org, p_role) on conflict do nothing;
    return 'added';
  end if;
  insert into public.staff_invites (org_id, email, role, invited_by) values (p_org, e, p_role, auth.uid())
  on conflict (org_id, email) do update set role = excluded.role, invited_by = excluded.invited_by, invited_at = now(), closed_at = null, closed_why = null;
  return 'invited';
end $$;

create function public.cancel_staff_invite(p_org uuid, p_email text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_org_admin(p_org) then raise exception 'Only the organisation''s admin can do this'; end if;
  update public.staff_invites set closed_at = now(), closed_why = 'cancelled' where org_id = p_org and email = lower(trim(p_email)) and closed_at is null;
end $$;

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
end $$;

create or replace function public.org_overview(p_org uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare staff uuid[]; learners uuid[];
begin
  if not public.is_org_admin(p_org) then raise exception 'Only the organisation''s admin can see this'; end if;
  select coalesce(array_agg(distinct m.user_id), '{}') into staff from public.memberships m where m.org_id = p_org and m.role in ('teacher', 'specialist');
  select coalesce(array_agg(distinct l.id), '{}') into learners from public.learners l
    where l.org_id = p_org or exists (select 1 from public.learner_team t where t.learner_id = l.id and t.user_id = any (staff));
  return jsonb_build_object(
    'name', (select o.name from public.organisations o where o.id = p_org),
    'learners', cardinality(learners),
    'active30', (select count(distinct a.learner_id) from public.attempts a where a.learner_id = any (learners) and a.occurred_at > now() - interval '30 days'),
    'openConcerns', (select count(*) from safeguarding.concerns c where c.learner_id = any (learners) and c.status = 'open'),
    'staff', coalesce((select jsonb_agg(jsonb_build_object('id', p.id, 'name', p.name, 'email', p.email, 'profession', p.profession,
        'learners', (select count(*) from public.learner_team t where t.user_id = p.id and t.learner_id = any (learners)),
        'lead', exists (select 1 from safeguarding.leads s where s.org_id = p_org and s.user_id = p.id)) order by p.name)
      from public.profiles p where p.id = any (staff)), '[]'),
    'invites', coalesce((select jsonb_agg(jsonb_build_object('email', i.email, 'role', i.role, 'at', i.invited_at) order by i.invited_at)
      from public.staff_invites i where i.org_id = p_org and i.closed_at is null), '[]'));
end $$;

revoke all on function public.cancel_staff_invite(uuid, text) from public, anon;
grant execute on function public.cancel_staff_invite(uuid, text) to authenticated;
