# NUVOTAP Project State — 19 October 2026 (consolidated, latest decisions only)

## What it is
NUVOTAP sells NFC Google-review cards, blank NFC cards, digital profiles (stands not yet on the site). Site: nuvotap.com (static HTML/CSS/JS on GitHub Pages, repo MHD241/Nuvotap, branch main, English + French mirror under `fr/`). Backend: Supabase project "Nuvotap" (id tkuqhjlkmzzdmcnqyjuq, eu-west-1). Local launch in Fife. Sam is helping his son build it.

## Prices and rules (live)
- Review cards (white/black) £9.99; blank £4.99; blank + new profile £9.99 (profile add-on £5; URL programming £0.50/card).
- Multi-buy on review cards: 2 cards 10%, 3 cards 15%, 4-10 cards 20%. Code WELCOME10 = 10%. 11+ cards quoted separately.
- Delivery UK: £2.99 flat per order, free when total after discounts is £30+. Carrier chosen per order, normally the fastest suitable.
- Same logic in app.js, supabase/functions/order-enquiry (v3), create-checkout (v1).

## Payments (Stripe) — test flow works, live not yet
- Flow: basket -> checkout page -> "Pay by card" -> `create-checkout` function (recalculates prices server-side, saves order as pending, creates Stripe Checkout Session) -> Stripe -> `stripe-webhook` marks order paid/confirmed (signature + amount checked) -> order-success page clears basket.
- Loading overlay shown during redirect to Stripe (EN/FR).
- Button hidden unless `pay-config.js` has enabled:true (preview with ?paytest=1). Currently enabled:false.
- Supabase secrets set (test mode): STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET. Webhook "captivating-bliss" in Stripe sandbox. Orders table is empty (test orders deleted).

## Website work done
- Prices/wording aligned site-wide (EN/FR); terms, returns, privacy pages; 3D NFC demo page; Websites page (EN only); order enquiry form.
- 19 Oct: orphan product.html deleted; "Digital profiles" and "Studio" removed from header on all 25 pages (studio.html still exists, linked from blank+profile product pages); header re-aligned (pages.css v=3); all pages checked at phone width EN/FR: no overflow/errors.

## Marketing
- Guarantee: 10 new genuine Google reviews in 30 days or card taken back with full refund. Conditions: set up within 3 days, ask at least 9 in 10 customers, reply to every review within 3 days, keep log + day-1/day-30 screenshots, claim within 14 days after day 30 at hello@nuvotap.com. Reviews by owner/staff/family/friends or paid/rewarded do not count. Never claim the card leaves reviews by itself; no incentivised or gated reviews (Google rules).
- Pitch order: value sentence, price, guarantee; free trial card only if they hesitate.
- Walk-in plan doc (30 steps by week, pitch, objections, tracking): https://claude.ai/code/artifact/b4867aa3-faf1-49af-9b63-207be76b2bda
- Target: Halbeath Retail Park — Pets at Home, Halfords, Wickes, Asda pharmacy (all chains: ask who decides on local reviews). NOT barbers/salons (Sam's decision). Goal: 3 paying customers in 30 days.
- Other docs: Review Growth Guide https://claude.ai/code/artifact/37594297-3d26-4ddb-b439-490dfb56b9f0 ; earlier 30-Day Marketing Plan https://claude.ai/code/artifact/7e473a97-4a67-4cff-bba8-4a38bcb23901 (older, barber-based); proof sheet https://docs.google.com/spreadsheets/d/1R_qSV0u9BVDfE7AR2kR9TqaZk2ooMLFD1xqZj8-0VwE/edit?usp=sharing

## 19 Oct (later): guide page + one-page guarantee
- guide.html (EN only, noindex, not in sitemap): full 30-day review guide, "Get your proof sheet" button (Google Sheet /copy link), "Save as PDF" (print). "Guide" link added to header nav on all pages (FR pages link to ../guide.html).
- returns.html + fr/returns.html FIXED: they said "no voluntary 30-day scheme"; now describe the 30-Day Review Guarantee and point to the guide.
- One-page A4 guarantee (Design artifact): https://claude.ai/artifact/LBiQZdHXDGScumHP3NVCyT — has QR to nuvotap.com/guide.html; seller line is a placeholder until trading name/address is decided. Print only after that. Not yet visually checked by Sam.
- Open: refund of delivery cost under guarantee (card price only for now); no FR guide page; the pasted guide text lives in guide.html and the Review Growth Guide doc separately (keep in sync).
- Role-play practice done (Pets at Home, Wickes, Asda pharmacy, Halfords). Trial length used: 7 days (plan said a week); guarantee = 30-day money back, separate from trial.

## Open / to do
1. Operator name + address for terms (Sam will not use home address; leaning virtual office; not chosen; terms keep a placeholder). Blocks taking paid orders.
2. Stripe live: activate account, live restricted key -> STRIPE_SECRET_KEY, live webhook -> STRIPE_WEBHOOK_SECRET, then set pay-config.js enabled:true (last), then roll the sandbox key pasted in chat.
3. Real-phone check by Sam; empty-src image on Studio page not investigated.
4. Not decided: stand price/products, customer contact channel, "minimum customers served" condition for the guarantee.
5. Housekeeping: Supabase leaked-password protection off; nuvotap-marketing skill still lists old prices; French Websites page missing; Halbeath scripts not yet rewritten in the agreed order; first-touch scripts for chains need a fifth unit if wanted.

## Rules for working with Sam
Short replies, one step at a time, plain language; ask for screenshots when guiding; tell him if something contradicts what was agreed; update this file after each work phase.

## Next step
Stripe live activation (Sam at Stripe, step by step), then go live.
