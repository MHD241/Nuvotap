# NUVOTAP admin activation — required account-owner steps

The connected Supabase integration blocked automated DDL requests and Edge Function admin deployment. **The admin grants/policies are not applied yet.** Do not expose profile submissions publicly until this is completed and tested.

1. Open https://supabase.com/dashboard/project/tkuqhjlkmzzdmcnqyjuq/sql/new and review/paste `supabase/migrations/20261015_nuvotap_admin_rls.sql`. Run it in the **Nuvotap** project only. This script is idempotent (re-running drops/recreates only named NUVOTAP policies).
2. Under Supabase Authentication > Users, create or invite **your own** account with an email address you control, and verify that it belongs to you. Never send passwords in chat.
3. Copy that user UUID. In SQL Editor run: `insert into public.nuvotap_admins(user_id) values ('THE-VERIFIED-AUTH-USER-UUID') on conflict (user_id) do nothing;` replacing the placeholder. Never use a UUID you haven't verified.
4. Publish `admin.html`, `admin.js`, `supabase-config.js` with the rest of the approved site and log in at `https://nuvotap.com/admin.html`. The public publishable key is safe in frontend source; never add service-role keys.
5. Test logged-out/unknown-user access is denied; admin can read submissions and obtain a temporary signed photo URL; admin can update submission status.
6. Before promoting Studio to production, add anti-abuse controls and complete an end-to-end submission test; confirm privacy operator/retention, service term/renewal and payment details.

Current database: protected tables and private upload bucket exist; public profile-submit function deployed. Admin permissions pending. No successful end-to-end test.
