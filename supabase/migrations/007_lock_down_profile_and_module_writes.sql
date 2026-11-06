-- Users could update every profile column through the public anon key,
-- including is_admin, plan, and stripe_customer_id. Only full_name is
-- user-editable; everything else is written by the service role.
revoke update on public.profiles from anon, authenticated;
grant update (full_name) on public.profiles to authenticated;

-- Users could insert modules directly and skip the inventory check in
-- /api/modules/register. Registration now only goes through that route.
drop policy if exists "Users can manage own modules" on public.modules;
create policy "Users can view own modules" on public.modules
  for select using (auth.uid() = user_id);
