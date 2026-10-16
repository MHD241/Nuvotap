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
