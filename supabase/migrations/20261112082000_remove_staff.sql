-- School admins remove staff. Kept apart because it deletes rows (a membership and any safeguarding lead role),
-- which needs the project owner's approval to apply.

-- Removing someone from the school ends their staff role there and any safeguarding lead role. Learners that families
-- shared with them personally stay shared: that is the family's choice.
create function public.remove_staff(p_org uuid, p_user uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_org_admin(p_org) then raise exception 'Only the organisation''s admin can do this'; end if;
  if p_user = auth.uid() then raise exception 'You can''t remove yourself'; end if;
  delete from safeguarding.leads where org_id = p_org and user_id = p_user;
  delete from public.memberships where org_id = p_org and user_id = p_user and role in ('teacher', 'specialist');
end $$;

revoke all on function public.remove_staff(uuid, uuid) from public, anon;
grant execute on function public.remove_staff(uuid, uuid) to authenticated;
