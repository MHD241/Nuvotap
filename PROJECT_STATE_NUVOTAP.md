# NUVOTAP project state — 2026-10-15

## Approved prices
Google review white/black £19.99 each; blank NFC card £7; digital profile add-on £5 per profile (blank + profile £12); optional standalone programming £0.50 per item. Google review products do not upsell the digital business profile. UK statutory returns policy Option A, change-of-mind return postage paid by customer where properly disclosed and legally permitted; faulty-goods postage covered as legally required.

## Build
V7.3 source: `/mnt/data/NUVOTAP-V7`. Polished header/logo and SVG icons, responsive Studio with main/secondary/accent colours, privacy/terms/returns pages, basket and email enquiry checkout.

## Supabase
Existing Nuvotap project `tkuqhjlkmzzdmcnqyjuq` (eu-west-1). Two RLS tables and private uploads bucket CREATED; customer `profile-submit` Edge Function DEPLOYED active. `supabase-config.js` public credentials configured. `admin-profiles` deployment BLOCKED; zero admin users. No end-to-end verification yet. Spam controls and notifications not implemented; do not open public submissions until fixed and tested. Website code not pushed to GitHub.

## Next
Deploy and verify admin-profiles function, enrol authorised admin, implement rate limiting/anti-bot protection; test anonymous submit, uploaded image, unauthorised read and admin actions; then deploy site to GitHub and test in Safari. Confirm hosting/edit terms and legally required operator details before public launch.

## 2026-10-15 additional attempt
Admin Edge Function deploy and RLS policy migration requests were blocked by the connector security checks. Neither was deployed/applied. Prepared `admin.js` RLS-based alternative and SQL file `supabase/migrations/20261015_nuvotap_admin_rls.sql` locally, pending application. No admin account yet, and no public deployment. Do not claim ready.

## 2026-10-15 V7.5
Verified current live project tables `nuvotap_admins`, `nuvotap_submissions` RLS enabled, both empty; only `profile-submit` Edge Function active. Admin function and admin grants/policies still NOT deployed; automated attempts explicitly blocked by connector security checks. Local Playwright page loads blocked by `ERR_BLOCKED_BY_ADMINISTRATOR`; no browser functional test claims. Prepared idempotent admin RLS migration and `ADMIN_ACTIVATION_STEPS.md`; packaged V7.5 ZIP. Next action requires project owner to run the reviewed RLS SQL in Supabase SQL Editor and create/verify admin auth user, add verified UUID to admins table; then test unauthorised access and end-to-end functionality. Anti-spam controls still missing. Do not deploy as production-ready.
