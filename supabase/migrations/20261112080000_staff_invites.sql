-- School admins add staff (docs/system-design.md, section 4). The admin enters a colleague's email and role:
-- someone who already has an account joins at once; anyone else joins when they register with that email.
-- No email is sent from here, so the platform's email limits don't apply.

create table public.staff_invites (
  org_id uuid not null references public.organisations on delete cascade,
  email text not null check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role public.adult_role not null check (role in ('teacher', 'specialist')),
  invited_by uuid not null references public.profiles,
  invited_at timestamptz not null default now(),
  primary key (org_id, email)
);
create index staff_invites_email on public.staff_invites (email);
create index staff_invites_by on public.staff_invites (invited_by);
alter table public.staff_invites enable row level security; -- no policies: only the functions below touch it

create function public.is_org_admin(p_org uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.memberships m where m.user_id = (select auth.uid()) and m.org_id = p_org and m.role in ('org_admin', 'site_admin'))
$$;

/** Returns "added" (they had an account and are now staff) or "invited" (they join when they register). */
create function public.invite_staff(p_org uuid, p_email text, p_role public.adult_role) returns text
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
  on conflict (org_id, email) do update set role = excluded.role, invited_by = excluded.invited_by, invited_at = now();
  return 'invited';
end $$;

-- The admin's overview now lists waiting invitations too.
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
      from public.staff_invites i where i.org_id = p_org), '[]'));
end $$;

revoke all on function public.is_org_admin(uuid), public.invite_staff(uuid, text, public.adult_role) from public, anon;
grant execute on function public.is_org_admin(uuid), public.invite_staff(uuid, text, public.adult_role) to authenticated;
