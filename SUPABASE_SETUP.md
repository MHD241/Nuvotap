# NUVOTAP Supabase status — 15 October 2026

Existing dedicated project: `Nuvotap` (`tkuqhjlkmzzdmcnqyjuq`).

## Confirmed completed
- `public.nuvotap_admins` and `public.nuvotap_submissions` created, RLS enabled and direct client grants revoked.
- Private storage bucket `nuvotap-profile-uploads` configured.
- `profile-submit` Edge Function deployed and reported ACTIVE (version 1).
- `supabase-config.js` contains **only** project URL and public publishable key.
- Studio's secure submission button is wired to Supabase.

## Still incomplete — do not accept production customer requests yet
- `admin-profiles` Edge Function deployment was blocked and is **not deployed**. The local source is in `supabase/functions/admin-profiles/index.ts`. It needs deployment with JWT verification disabled because the function validates the bearer token and checks `nuvotap_admins` itself.
- There are currently 0 authorised admins; provision an auth user and insert that user's UUID into `public.nuvotap_admins` after verifying identity.
- Anonymous submissions need spam protection / server-side rate limiting and monitoring before public launch.
- No live email notifications, live payments, public profile publication, or automated card programming.
- Real end-to-end browser and security tests are not yet complete.
- Legal policies require confirmation of real legal business operator and data retention information.

**Do not commit secret keys to GitHub.** Supabase service-role keys remain only in server-side Edge Function environment.

## Local files
Website: `studio.html`, `admin.html`, `supabase-config.js`, `supabase-studio.js`, `admin.js`. SQL migration at `supabase/migrations/20261015_nuvotap.sql`. Edge Functions at `supabase/functions/`.

## V7.4 alternative admin connection (not yet applied to live Supabase)
The admin Edge Function deployment was blocked twice. `admin.js` now uses Supabase Auth + native Row Level Security. Apply `supabase/migrations/20261015_nuvotap_admin_rls.sql` to the dedicated project through the Supabase SQL Editor, then create an Auth user for the owner and insert that verified user UUID into `public.nuvotap_admins`. No admin members exist at preparation time. Do not deploy this to production until authorisation and submission tests have passed.
