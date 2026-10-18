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
- Stripe test Payment Links added (pay-config.js + pay.js; white …q00, black …q01, blank …q02, blank+profile …q03). Hidden from visitors until `enabled:true`; preview any product page with `?paytest=1`. To go live: create live-mode links, paste into pay-config.js, set enabled true, and update terms/checkout wording (they still say no card payments are taken on the site).
- 18 Oct (later) SUPERSEDES the Payment Link plan: basket → Stripe Checkout. Supabase function `create-checkout` (v1, source in supabase/functions/create-checkout/index.ts) recalculates prices server-side (same rules as order-enquiry), saves the order as payment_status=pending, creates a Stripe Checkout Session (gross line items, one coupon for multi-buy + code, UK delivery £2.99 or free from £30, address passed through) and returns the Stripe URL. `pay-checkout.js` adds a "Pay by card" button on checkout.html / fr/checkout.html; hidden unless `pay-config.js` has enabled:true or the URL has ?paytest=1. `order-success.html` (EN/FR) clears the basket. Secret STRIPE_SECRET_KEY set in Supabase (test key; it was pasted in chat once, test mode only, rotate it). Payment Link buttons/pay.js removed.
- Not done yet: Stripe webhook (to mark orders paid automatically; needs STRIPE_WEBHOOK_SECRET), live-mode restricted key, terms/checkout wording ("no card payments are processed through this website"), end-to-end test (shell cannot reach Supabase; user tests with ?paytest=1).
- 18 Oct (night) Stripe TEST flow verified end to end: basket → create-checkout → Stripe → stripe-webhook marks order paid/confirmed (amount-checked). Webhook destination "captivating-bliss" (Stripe sandbox) with 4 checkout.session events; secrets STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET set in Supabase. 3 old test orders remain in nuvotap_orders (delete before launch). Remaining before live: update terms/checkout wording (still says no card payments), live Stripe account activation, live restricted key + live webhook + secrets, set pay-config.js enabled:true, roll the sandbox key pasted in chat.

## 18 Oct (late) updates
- Wording aligned ("No payment is taken when you add to your basket"); 4 test orders deleted (orders table = 0 rows).
- Walk-in marketing plan doc (Docs): https://claude.ai/code/artifact/b4867aa3-faf1-49af-9b63-207be76b2bda — guarantee-led pitch (value, price, guarantee; trial only if they hesitate), 30 steps by week, objections, tracking + week 4 review.
- Sam does NOT want barbers/salons. Target = Halbeath Retail Park: Pets at Home, Halfords, Wickes, Asda pharmacy (all chains; ask who decides on local reviews). Cafe and Currys removed. Scenarios written for those four.
- Plan to do tomorrow (19 Oct): polish website, activate Stripe live, open for business.
- Go-live checklist: activate Stripe account; live restricted key -> STRIPE_SECRET_KEY in Supabase; live webhook -> STRIPE_WEBHOOK_SECRET; set pay-config.js enabled:true last; roll the sandbox key pasted in chat; add legal operator name/address to terms.
- Still open: stand price, product.html orphan (£20), nuvotap-marketing skill old prices, Supabase leaked-password protection, French Websites page, customer contact channel, minimum-customers condition for guarantee.
