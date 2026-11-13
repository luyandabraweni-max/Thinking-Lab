-- Specialists review the adaptation rules (docs/adaptation-rules.md; ported from the live portal's rule review).
-- One review per rule per person, changed as often as they like. Colleagues in the same organisation see each other's
-- reviews; the 2to.iQ team reads them all from the database when it revises the rules.

create table public.rule_reviews (
  user_id uuid not null references public.profiles on delete cascade default auth.uid(),
  rule text not null check (rule ~ '^[a-z]{2,20}$'),
  verdict text not null check (verdict in ('agree', 'change', 'unsure')),
  comment text not null default '' check (length(comment) <= 800),
  updated_at timestamptz not null default now(),
  primary key (user_id, rule)
);
create index rule_reviews_updated on public.rule_reviews (updated_at);
alter table public.rule_reviews enable row level security;

-- Teachers and specialists only (families and admins don't review the rules).
create function public.is_professional() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.memberships m where m.user_id = (select auth.uid()) and m.role in ('teacher', 'specialist'))
$$;
create function public.shares_org(other uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.memberships a join public.memberships b on a.org_id = b.org_id
                 where a.user_id = (select auth.uid()) and b.user_id = other and b.role in ('teacher', 'specialist'))
$$;
revoke all on function public.is_professional(), public.shares_org(uuid) from public, anon;
grant execute on function public.is_professional(), public.shares_org(uuid) to authenticated;

create policy see on public.rule_reviews for select using (user_id = (select auth.uid()) or public.shares_org(user_id));
create policy add on public.rule_reviews for insert with check (user_id = (select auth.uid()) and public.is_professional());
create policy change on public.rule_reviews for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and public.is_professional());
grant select, insert, update on public.rule_reviews to authenticated;
create trigger touch before update on public.rule_reviews for each row execute function public.touch();

-- Sync (see 20261112050000_learner_settings.sql): the device keeps one row per review, with id "<rule>:<user id>".
create function public.sync_push_rule_reviews(r jsonb) returns void
language sql security invoker set search_path = '' as $$
  insert into public.rule_reviews as x (user_id, rule, verdict, comment)
  values ((select auth.uid()), r ->> 'rule', r ->> 'verdict', coalesce(r ->> 'comment', ''))
  on conflict (user_id, rule) do update set verdict = excluded.verdict, comment = excluded.comment
$$;
create function public.sync_pull_rule_reviews(since timestamptz) returns jsonb
language sql security invoker stable set search_path = '' as $$
  select jsonb_build_object('rule_reviews', coalesce(jsonb_agg(jsonb_build_object('id', x.rule || ':' || x.user_id, 'rule', x.rule, 'verdict', x.verdict,
    'comment', x.comment, 'by', x.user_id, 'byName', p.name, 'profession', coalesce(p.profession, ''), 'date', x.updated_at::date)), '[]'))
  from public.rule_reviews x join public.profiles p on p.id = x.user_id where x.updated_at > since
$$;
revoke all on function public.sync_push_rule_reviews(jsonb), public.sync_pull_rule_reviews(timestamptz) from public, anon;
grant execute on function public.sync_push_rule_reviews(jsonb), public.sync_pull_rule_reviews(timestamptz) to authenticated;
