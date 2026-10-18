# NUVOTAP Project State — 16 October 2026

## Bilingual version 8.5
- Generated EN/FR mirror website pages (all 10 HTML pages under `fr/`), EN / FR navigation switch on every page and mobile/desktop responsive layout in `bilingual.css`.
- Removed the large standalone home-page Studio promotional section (including its button). Navigation still links to the Studio itself.
- Applied French translations to static storefront/product/Studio/checkout/admin/legal page content. `locale-fr.js` translates dynamic cart, consent notice, search and admin messages after render; some rare server-generated errors may remain untranslated.
- Preserved official NUVOTAP logo and favicon supplied in V8.4 brand package, existing Supabase configuration, English cart and checkout functions, existing products and pricing.
- French pages retain local page navigation; asset/script paths use `../` to load from the common asset directory.
- Verified: JS files with Node syntax checks; local src/href target checks across EN/FR; bilingual static text audit. Browser-based visual checks could NOT complete because local site URLs are blocked by the browser test environment.
- Deliverable ZIP not uploaded to GitHub; the LIVE website was NOT changed.

## Open work unrelated to language
- Supabase order-enquiry endpoint exists; full order > admin > Google Sheets automated sync and live card payments are not implemented end-to-end. No payment provider connected.
- Consent-aware analytics, anti-abuse protections and full end-to-end customer testing outstanding.
- Legal operator identity, legal policy details, profile hosting terms and legal review still needed before taking live payments.

## Next step
- Extract the bilingual ZIP to a test deployment, check the EN/FR selector and visual layout on Safari on desktop/mobile, then publish after approval.

## Update — 18 October 2026 (supersedes older price/delivery notes above)
- Prices live: review cards £9.99, blank £4.99, blank + new profile £9.99 (profile add-on £5, URL programming £0.50/card). Site (EN/FR) and Supabase `order-enquiry` function (v3, source in `supabase/functions/order-enquiry/index.ts`) match.
- Delivery (UK only): flat £2.99 per order, free when total after discounts is £30 or more; orders of 11+ cards quoted separately. Carrier chosen per order, normally the fastest suitable (Royal Mail Tracked 48 Large Letter ≈ £2.85 online, April 2026). Basket, checkout, terms (EN/FR) and function show/store `delivery_gbp`.
- Stripe: test-mode account only; no Payment Links created yet. Plan: four products (white £9.99, black £9.99, blank £4.99, blank + profile £9.99), Payment Links with quantity, UK shipping, flat £2.99 shipping rate (free over £30 needs separate handling), custom field for business/URL. Waiting for the user to send links. Basket discounts are not applied by Payment Links.
- Open: stand products not on site; `product.html` is an old orphan page showing £20; Supabase leaked-password protection off; Stripe live activation and legal review before live payments.
