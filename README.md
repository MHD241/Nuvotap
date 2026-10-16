# NUVOTAP V8.3 — backend-connected staging

Customer order enquiries now submit to the live Supabase `order-enquiry` Edge Function, which independently validates products, unit prices and quantity discounts, and records orders as `enquiry`/`unpaid`. No payment is taken. Website form presents its order reference only after confirmed server success.

Profile submissions use the deployed `profile-submit` v2 endpoint and social URLs are optional. Header search, consent notice, policies, and admin UI included.

**Not production-ready**: Order admin SELECT/UPDATE RLS policies are not confirmed applied (database tool blocks writes). Analytics collector and Google Sheets automatic sync are not operational. Payment processor and payment verification do not exist. Anti-abuse rate limiting/CAPTCHA and real browser E2E still needed.

Manual Supabase editor: apply `supabase/migrations/20261016_v8_admin_access.sql` (check current policies first). Google Sheet belongs to NUVOTAP account, formatting must not be changed.

Prices: review cards £19.99, blank £7, digital profile addition £5, URL programming £0.50/card. Never interpret enquiries as paid orders.

## V8.3 (16 Oct) update
- Deployed ACTIVE Supabase Edge Function `order-enquiry` v1; checkout now calls it with server-validated items and records unpaid enquiries on success.
- Admin dashboard now includes private CSV export for order reconciliation.
- Supabase orders and analytics admin permissions **still blocked** (verified no SELECT/UPDATE grants). Apply `supabase/migrations/20261016_v8_admin_access.sql` manually before testing admin data view.
- The Google Sheet is untouched. CSV import/export is not automatic synchronisation.
- Production is **not** ready: CAPTCHA/rate limiting, real payment provider, approved privacy-consent analytics, automatic Google Sheets sync and browser E2E remain missing.
