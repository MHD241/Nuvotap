-- Apply to the dedicated Nuvotap Supabase project only.
-- The admin dashboard accesses data as authenticated, not as service_role.
grant usage on schema public to authenticated;
grant select on public.nuvotap_admins to authenticated;
grant select, update on public.nuvotap_submissions to authenticated;

drop policy if exists "Read own admin membership" on public.nuvotap_admins;
create policy "Read own admin membership" on public.nuvotap_admins
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "Admins read profile submissions" on public.nuvotap_submissions;
create policy "Admins read profile submissions" on public.nuvotap_submissions
  for select to authenticated
  using (exists (select 1 from public.nuvotap_admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins update profile submissions" on public.nuvotap_submissions;
create policy "Admins update profile submissions" on public.nuvotap_submissions
  for update to authenticated
  using (exists (select 1 from public.nuvotap_admins a where a.user_id = (select auth.uid())))
  with check (exists (select 1 from public.nuvotap_admins a where a.user_id = (select auth.uid())));
drop policy if exists "Admins view private profile images" on storage.objects;
create policy "Admins view private profile images" on storage.objects
  for select to authenticated
  using (bucket_id = 'nuvotap-profile-uploads' and
    exists (select 1 from public.nuvotap_admins a where a.user_id = (select auth.uid())));

-- After creating a Supabase Auth user for the verified site owner, explicitly
-- insert that user's auth.users UUID into public.nuvotap_admins from SQL editor.
-- Never grant admin rights to every registered user.
