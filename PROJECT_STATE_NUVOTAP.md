# NUVOTAP project state — 16 October 2026

## Verified completed
- Supabase project `tkuqhjlkmzzdmcnqyjuq` exists. Administrator UID `1ebc7918-1ab7-4769-97ae-d8a1ec32de1b` already authorised for prior profile-submission tables.
- `profile-submit` Edge Function v2 accepts optional social URLs; profiles are private pending admin approval.
- `order-enquiry` Edge Function v1 deployed ACTIVE. It validates and prices products server-side and inserts unpaid enquiries (not payments).
- `nuvotap_orders` and `nuvotap_events` tables created with RLS enabled; no order records when checked. Admin read/update privileges for these newer tables are **not applied** (verified false for all three permissions).
- Site V8.3 staging source: checkout now calls order-enquiry securely, shows reference only on success, preserves basket on failure; admin orders CSV export. Studio form editor, colours, optional social URLs, search, legal pages and one-time terms agreement remain included.
- NUVOTAP Google Sheet `1pAEmNoWgRmcGl170ad_3kOd8DGOrMlX8A-TfjZ0yvmI` exists, private in `nuvotap@gmail.com`. User edited layout: NEVER resize existing rows or columns.

## Open / blockers
1. Supabase connector blocked DDL for new admin RLS. User must apply and verify `supabase/migrations/20261016_v8_admin_access.sql` in SQL Editor. Do not claim activated yet.
2. No production payment provider; payment collection and verified paid state absent.
3. Google Sheets automatic sync absent: requires secure Google auth outside chat connector. CSV export is temporary, manual.
4. Analytics ingestion (visits/clicks/wishlists) and privacy consent framework need secure implementation and tests.
5. Anti-spam/bot controls missing on anonymous submission functions. No browser end-to-end test or actual successful submission confirmed. NOT production ready.
6. Policy text requires legal and business-operator review. Profile hosting duration/edit pricing undecided.

## Next step
Apply V8 admin SQL in dedicated NUVOTAP project; verify grants and policies. Then test admin sign-in and harmless test order, add abuse protection, payment provider and sheet sync. Do not upload staging package live prematurely.
