-- A parent or guardian deletes their child's profile (POPIA section 24: the right to have personal information deleted).
-- Everything about the child goes with it: messages, goals, notes, sessions, settings, health records. Not while a
-- safeguarding concern about the child is still open: the safeguarding lead closes it first. Devices remove their copies
-- at the next sync (20261112110000_sync_visible.sql). Kept apart because it deletes rows, which needs the owner to apply.

create function public.delete_learner(p_learner uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_guardian(p_learner) then raise exception 'Only the child''s parent or guardian can delete their profile'; end if;
  if exists (select 1 from safeguarding.concerns c where c.learner_id = p_learner and c.status = 'open') then
    raise exception 'A safeguarding concern about this child is still open. The safeguarding lead needs to close it before the profile can be deleted.';
  end if;
  delete from public.learners where id = p_learner;
end $$;
revoke all on function public.delete_learner(uuid) from public, anon;
grant execute on function public.delete_learner(uuid) to authenticated;
