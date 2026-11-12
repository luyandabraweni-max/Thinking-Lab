-- The organisation admin's view (ported from the live portal's school admin screen): totals and staff, never an
-- individual learner's records. Admins appoint safeguarding leads with set_safeguarding_lead (20261112010000).

create function public.org_overview(p_org uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare staff uuid[]; learners uuid[];
begin
  if not exists (select 1 from public.memberships m where m.user_id = (select auth.uid()) and m.org_id = p_org and m.role in ('org_admin', 'site_admin')) then
    raise exception 'Only the organisation''s admin can see this';
  end if;
  select coalesce(array_agg(distinct m.user_id), '{}') into staff from public.memberships m where m.org_id = p_org and m.role in ('teacher', 'specialist');
  -- The organisation's learners: registered with it, or shared with its staff.
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
      from public.profiles p where p.id = any (staff)), '[]'));
end $$;
revoke all on function public.org_overview(uuid) from public, anon;
grant execute on function public.org_overview(uuid) to authenticated;
