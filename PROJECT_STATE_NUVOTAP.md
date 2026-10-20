# NUVOTAP Project State — 19 October 2026, evening (whole project since the start)

## 1. What NUVOTAP is
NFC Google-review cards, blank NFC cards, digital profiles (stands not yet on the site). Sam is helping his son build it; local Fife launch. Site: nuvotap.com (static HTML/CSS/JS on GitHub Pages, repo MHD241/Nuvotap, branch main, local clone /home/claude/nuvotap). English site plus French mirror under fr/. Backend: Supabase project "Nuvotap" (id tkuqhjlkmzzdmcnqyjuq, eu-west-1). Payments: Stripe (TEST mode only so far).

## 2. Live prices and rules
- Review cards (white/black) £9.99; blank £4.99; blank + new profile £9.99 (profile add-on £5; own-URL programming £0.50/card).
- Multi-buy on review cards: 2 cards 10%, 3 cards 15%, 4-10 cards 20%. Code WELCOME10 = 10%. 11+ cards quoted separately.
- Delivery UK: £2.99 flat per order, free when total after discounts is £30+. Carrier chosen per order, normally the fastest suitable.
- Same pricing logic in app.js, supabase/functions/order-enquiry (v3) and create-checkout (v1).

## 3. What has been done (by area)
**Website:** repo connected; prices lowered and aligned site-wide (EN/FR) and in Supabase; site redesign and animation; Websites page (EN only); 3D NFC demo page (EN/FR); terms, returns, privacy pages; order enquiry form; basket and checkout. 19 Oct: orphan product.html deleted; "Digital profiles" and "Studio" removed from the header (studio.html still exists, linked from blank+profile product pages); header re-aligned on desktop/tablet/phone (pages.css v=3); all pages checked at phone width EN/FR, no overflow/errors. Header menu now: Home, Products, How it works, FAQ, Guide, Account (Websites on the top bar and in the mobile menu).
**Stripe (test mode, working end to end):** basket -> checkout -> "Pay by card" (loading overlay while redirecting, EN/FR) -> create-checkout function (server-side price check, saves order pending, creates Stripe Checkout Session) -> Stripe -> stripe-webhook marks order paid/confirmed (signature + amount checked) -> order-success page clears basket. Button hidden unless pay-config.js has enabled:true (preview with ?paytest=1); currently enabled:false. Supabase secrets set (test): STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET. Webhook "captivating-bliss" in the Stripe sandbox. Test orders deleted earlier.
**Guarantee and guide:** 30-Day Review Guarantee = 10 new genuine Google reviews in 30 days or card taken back and the card price refunded. Conditions: set up within 3 days, ask at least 9 in 10 customers, reply to every review within 3 days, keep log + day-1/day-30 screenshots, claim within 14 days after day 30 at hello@nuvotap.com; owner/staff/family/friends or paid/rewarded reviews don't count; we collect the card in Fife or pay return postage; refund within 14 days of getting the card. Never claim the card posts reviews by itself; no incentivised or gated reviews. guide.html (EN, noindex, not in sitemap): full 30-day guide, built-in daily log (device storage, CSV download, printable blank log), Google Sheet copy link as a computer backup, "Save as PDF". returns.html EN/FR fixed (they said "no voluntary 30-day scheme") and now describe the guarantee.
**One-page guarantee (A4, printable):** https://claude.ai/artifact/LBiQZdHXDGScumHP3NVCyT — has a QR code to nuvotap.com/guide.html. Seller line is a placeholder until the trading name/address is decided: do not print before that.
**Customer accounts, phase 1:** account.html + account.js (sign up/in, forgot/reset password, tabs Daily log, Orders, My details, Card links placeholder); account-prefill.js fills empty checkout fields; privacy page EN/FR has a Customer accounts section. DB: nuvotap_customers, nuvotap_review_logs (RLS: own rows only), nuvotap_orders.user_id, functions nuvotap_my_orders() and nuvotap_claim_my_orders() (links orders by CONFIRMED email). Payment functions untouched. supabase-js pinned 2.45.4. Tested only with a stubbed sign-in library; real Supabase sign-up NOT yet tested.
**Marketing:** target is Halbeath Retail Park: Pets at Home, Halfords, Wickes, Asda pharmacy (all chains; ask who decides on local reviews); Sam does NOT want barbers/salons. Pitch order: value sentence, price, guarantee; free 7-day trial card only if they hesitate (guarantee and trial are separate things). Goal: 3 paying customers in 30 days. Walk-in plan doc (30 steps by week, pitch, objections, Halbeath scenarios, tracking): https://claude.ai/code/artifact/b4867aa3-faf1-49af-9b63-207be76b2bda . Four role-play rounds done with feedback (Pets at Home, Wickes, Asda pharmacy, Halfords). Other docs: Review Growth Guide https://claude.ai/code/artifact/37594297-3d26-4ddb-b439-490dfb56b9f0 ; older barber-based plan https://claude.ai/code/artifact/7e473a97-4a67-4cff-bba8-4a38bcb23901 (outdated) ; proof sheet https://docs.google.com/spreadsheets/d/1R_qSV0u9BVDfE7AR2kR9TqaZk2ooMLFD1xqZj8-0VwE/edit?usp=sharing

## 4. Open problems and to do
1. 🔴 Operator trading name + address for terms, privacy and the one-pager (Sam will not use his home address; leaning to a virtual office address; not chosen). Blocks taking paid orders and printing the one-pager.
2. 🔴 Stripe live: activate account, live restricted key -> STRIPE_SECRET_KEY, live webhook -> STRIPE_WEBHOOK_SECRET in Supabase, set pay-config.js enabled:true LAST, then roll the sandbox key pasted in chat. To be done with Sam's dad.
3. 🔴 Accounts: set custom SMTP for Supabase Auth emails (default sender is heavily rate-limited), keep "Confirm email" ON, add https://nuvotap.com to Site URL/redirect URLs, then Sam signs up with his own email to test.
4. 🟢 Test orders deleted (20 Oct); nuvotap_orders empty.
5. 🟠 Not built: card-link management (needs cards programmed to a NUVOTAP redirect link; phase 2), French guide and account pages, self-service account deletion (email request for now).
6. 🟠 Not decided: stand products/price, customer contact channel, whether the refund covers delivery (currently card price only), minimum-customers condition for the guarantee.
7. Housekeeping: Supabase leaked-password protection off (paid feature); nuvotap-marketing skill out of date vs this file (says £20 cards, Square payments, barbers/salons in research list, replies in Arabic) — not edited, needs Sam's OK; empty-src image on the Studio page; guide text lives in guide.html and the Review Growth Guide doc separately (keep in sync); Sam's real-phone check of the site not done.

## 4b. Account migration (20 Oct 2026)
- 🟢 Moved to new Claude account. Skill nuvotap-marketing installed (original text unchanged) and showing as available. Repackaged upload zip: /home/claude/nuvotap-marketing.zip (skill description is 208 chars; help page says 200 max, but upload worked).
- This file lives at /home/claude/PROJECT_STATE.md (temporary session folder — send Sam the updated copy at session end).
- 🟢 GitHub linked (20 Oct, push works). 🟢 Supabase tools available in session. Stripe not connected (being replaced by Square). Connect GitHub in claude.ai Settings → Connectors before any website work.
- 🟢 Repo is public: cloned read-only to /home/claude/nuvotap (latest commit fcebe75, 19 Oct). Pushing still needs GitHub connected.
- 20 Oct site review (no changes made): 🟢 no JS errors, dead links, 404s or phone overflow on any EN/FR page; prices correct. Findings for Sam to decide: (a) policy pop-up blocks every first visit before browsing; (b) homepage never mentions the 30-Day Review Guarantee, multi-buy discounts, free delivery over £30 or Fife; (c) hero copy is general, not aimed at local businesses wanting reviews; (d) footer has no business name/address (known blocker); (e) Studio page empty image (known).
- 🟠 Artifact links in section 3 were made on the old account; not checked whether they open from the new one.

## 5. How to work with Sam
Short replies, one step at a time, plain language; ask for screenshots when guiding; give an honest evaluation of his ideas before building; tell him if something contradicts what was agreed; 🔴 = needs his decision or confirmed problem, 🟠 = doubt or unverified, 🟢 = verified success; update this file after each work phase.

## 5b. Proposed website checklist (20 Oct) — NOT approved or started; Sam paused to do something else first
Before: [ ] connect GitHub in claude.ai Settings → Connectors; [ ] Sam picks which items and order.
Suggested order:
1. [ ] Homepage section for the 30-Day Review Guarantee, linking to full terms.
2. [ ] Stop the policy pop-up blocking first visits (keep agreement at checkout).
3. [ ] Homepage: multi-buy discounts (10–20%) and free delivery over £30.
4. [ ] "Local Fife business" line.
5. [ ] New headline aimed at local businesses — show 2–3 options, Sam picks.
6. [ ] Fix empty image on Studio page.
7. [ ] Same changes on French pages.
After each change: test phone + desktop EN/FR; show Sam screenshots; publish only on his OK; update this file and send it.
Not in this list (waiting on decisions): business name/address; Stripe live + SMTP with dad; update nuvotap-marketing skill (prices, Stripe, Halbeath).

## 5c. NEW DECISION 20 Oct: Square everywhere (replaces Stripe)
- 🔴 Sam chose Square for both in-person (has account + reader) AND the website, dropping Stripe. Supersedes section 3 Stripe plan and open problem 2 (Stripe live). Stripe test setup stays in place until Square web checkout is built and tested; pay-config.js stays enabled:false.
- Phase A (now): pair the Square Reader with the Square Point of Sale app (no website change). Status: guiding Sam, step 1.
- Phase B (later, needs GitHub connected): Square developer app, access token + webhook signature key as Supabase secrets, rewrite create-checkout and stripe-webhook for Square, test in Square sandbox, then live.

## 5d. Address decision 20 Oct (middle ground, Sam approved)
- For now show trading name + town + email (e.g. "NUVOTAP, Dunfermline, Fife · hello@nuvotap.com") while testing with a few trial customers; get a virtual office address BEFORE taking real paid orders in volume. Exact wording/town not yet confirmed by Sam.
- Told Sam: online/email orders legally need a geographic address (Consumer Contracts Regs + E-Commerce Regs); in-person sales have no duty to display one, but trading as "NUVOTAP" means his name + an address are expected on invoices/receipts and must be given if a customer asks (Business Names rules). Not legal advice; Business Gateway Fife can confirm free.
- Square payment setup paused at: Sam asked "why developer"; options given (developer app = keeps basket/discounts/auto-paid, recommended; or no-code payment links = loses discounts/automation). Waiting for his choice.

## 5e. Terms & Conditions rewrite (20 Oct)
- Sam supplied ZipNFC's T&Cs as a model. Agreed approach: same section layout/order and plain style, NUVOTAP's own wording (no verbatim copying — declined for copyright), NUVOTAP's real rules kept.
- Draft: /home/claude/drafts/NUVOTAP_Terms_draft_v1.md — NOT live, terms.html unchanged. Kept from our terms over ZipNFC: UK-only delivery, 14-day cancellation, programmed standard cards still returnable, Consumer Rights Act 2015 (not Sale of Goods Act 1979), Scots law, prices incl. any VAT.
- [CONFIRM] items in draft: 🟢 VAT: Sam not VAT registered (confirmed 20 Oct; draft says no VAT charged); 🟢 payment provider named as Square only (Sam, 20 Oct) — note: site's Stripe checkout is switched off (enabled:false), so no conflict while live; publish terms together with or after Square checkout ideally; town = Dunfermline (🟢 confirmed by Sam 20 Oct, contact line "NUVOTAP, Dunfermline, Fife, Scotland"); 🟢 legal operator name confirmed 20 Oct: Mohammed Shnina (draft says "NUVOTAP is a trading name of Mohammed Shnina."); postal address (virtual office) still needed before real paid orders, per 5d — not shown in draft for now.
- v2 (20 Oct): /home/claude/drafts/NUVOTAP_Terms_v2.md — internal note removed, phone made optional (matches checkout, phone field not required), "Last updated: 20 October 2026" (change to real go-live date when published). No placeholders left. Waiting for Sam's read-through/approval. Sam said: DON'T publish anything yet.
- Self-audit of v2 (20 Oct), told Sam: NEW in v2 (not from existing NUVOTAP pages/decisions): UK-only delivery stated outright; Scots law + Advice Direct Scotland; "we reply as soon as we can on working days"; "we try to send orders quickly"; may offer alternative if out of stock; may change address before dispatch; "or another payment method we have confirmed"; terms-at-order-time apply; N-Mark line (from ZipNFC, probably unneeded). DROPPED by mistake from current terms: Studio note (design tool, submissions by email) — restore. Sam decided (20 Oct): KEEP 1,2,3,5,6,7; REMOVED 4 (alternative offer → now just "we will tell you and refund in full") and 8 (N-Mark). Studio note restored in Digital profiles. Done in v2 file. Final proofread fixes: date on its own line; cancellation refund "original payment method" (matches other methods); removed repeated "published automatically". Triple check (20 Oct): prices, multi-buy tiers, WELCOME10, £2.99/£30 delivery, 11+ quote match app.js AND create-checkout; checkout requires name/email/address + terms tickbox, phone optional (matches); guarantee wording matches guide.html/returns.html; legal points (14+14 days, refund timing, outbound delivery refund, personalised exemption, CRA 2015, UK courts) correct. One fix: change-of-mind limited to "as a consumer" to match approved returns.html. Notes for later: order-success.html, pay-checkout.js (EN/FR) still say Stripe — update when Square checkout is built; privacy.html names no payment provider — add Square when doing privacy policy; terms have no business-buyer clauses (most customers are shops) — Sam to decide if wanted. 🟢 Wording complete — ready for Sam's approval; then make EN/FR terms.html (don't publish until Sam says).
- Legal check told to Sam: no tracking/analytics cookies (privacy page says so) 🟢; gaps: no geographic address (knowing middle-ground choice), live terms.html still says "proposed trading terms", privacy page not reviewed this session, policy pop-up asks agreement before browsing (not illegal, unusual). Not legal advice.
- After approval: put into terms.html + fr/terms.html, test phone/desktop, publish (needs GitHub connected).
- (Sam originally asked for the privacy policy; file he sent was T&Cs — privacy policy still to do if wanted.)

## 5f. In-person selling readiness check (20 Oct) — given to Sam
Ready: products/prices, Square account + reader, Halbeath plan + 4 role-plays, guarantee + guide.html live, website, hello@nuvotap.com.
To do before visits: (1) update one-pager seller line to "NUVOTAP, Dunfermline, Fife · trading name of Mohammed Shnina" then print (old-account artifact may not open — may need rebuilding); (2) Square: items + prices, multi-buy discounts, business name NUVOTAP, no home address on receipts/profile; (3) publish new terms (live page says "proposed trading terms").
Unknown (Sam to confirm): HMRC self-employed registration (needed once trading income > £1,000 trading allowance in a tax year); cards in stock + NFC programming app/phone; unlocked trial cards ready; public liability insurance (optional); separate bank account (optional).

## 5f2. Terms pages built (20 Oct) — Sam approved terms v2 and asked to update the website
- terms.html + fr/terms.html rebuilt from /home/claude/drafts/NUVOTAP_Terms_v2.md and NUVOTAP_Terms_v2_FR.md (build script: scratchpad build_terms.py). Tested phone/desktop EN/FR: no overflow, no JS errors, links OK.
- 🟢 LIVE 20 Oct ~13:22: GitHub linked to new account; pushed 613b0e1 (terms) + 91c12ff (this file saved in repo as PROJECT_STATE_NUVOTAP.md). Verified on nuvotap.com/terms.html and /fr/terms.html (date, seller lines, Square). Repo clone /home/claude/nuvotap now has push access.
- Next document after terms: Privacy Policy (Sam to supply model/next doc).

## 5f3. Privacy Policy draft (20 Oct) — NOT live
- Model from Sam: generic Magento shop privacy template (attachment). Followed its sections/order, NUVOTAP's own wording; kept all UK-GDPR items from current privacy.html (controller, legal grounds, sharing, rights, ICO).
- Draft: /home/claude/drafts/NUVOTAP_Privacy_v1.md. Facts checked in code: no cookies, no analytics/visit tracking on public pages (admin reads nuvotap_events but nothing writes it); localStorage keys nuvotap-v7-basket, -v7-code, -theme, -terms-v1, -v7-design, -guide-log-v1, Supabase sign-in token; Supabase eu-west-1 (Ireland); Square named.
- Left out from template (wrong for NUVOTAP): Data Protection Act 1998 + "small fee" (now UK GDPR/DPA 2018, free), promo/market-research emails, fax, "traffic log cookies", Magento cookie list.
- 🟢 Retention approved by Sam 20 Oct: orders = as long as UK tax law requires, at least 5 years (no card details ever kept); accounts/logs until deletion requested; enquiries 12 months; unused Studio 12 months; guarantee claims with order records. Email provider is Spacemail (by Spaceship), but Sam chose to keep it general in the policy ("our email provider"); also general per Sam: "our database provider" (Supabase, still says servers in Ireland, EU), "our website hosting provider" (GitHub), "Sign-in token". Only Square is named. Self-audit given to Sam (new lines not from existing page/code: in-person mention, "we do not sell your information", delivery company gets name+address only, reply within one month, "tell us first" before ICO); fixed: browser log is sent to us if saved to account. No open items; waiting for Sam's approval to build EN/FR privacy pages.

- 🟢 Sam approved privacy policy (kept all 5 new lines) and asked to push. Built privacy.html + fr/privacy.html from drafts NUVOTAP_Privacy_v1.md / _FR.md (scratchpad build_privacy.py); tested phone/desktop EN/FR OK. 🟢 LIVE: pushed ea59b7d, verified on nuvotap.com/privacy.html and /fr/privacy.html (20 Oct ~13:50).

## 5h. Homepage fixes (20 Oct ~14:15) — built + tested, NOT pushed (waiting for Sam's OK on screenshots)
- Checklist 5b items 1 + 2. Guarantee section (#guarantee) added to index.html + fr/index.html before Products: heading "10 new Google reviews in 30 days, or we refund the card.", 3 steps (set up in 3 days / ask 9 in 10 + reply in 3 days / fewer than 10 → card back, refund price paid), exclusions line, buttons Read the guide (guide.html) + Full conditions (returns.html). Wording from approved guarantee only.
- consent.js rewritten: blocking "I agree" pop-up replaced by slim bottom notice bar ("No advertising cookies or tracking. Read our Terms, Privacy and Returns." + OK), EN/FR, same storage key nuvotap-terms-v1; doesn't block browsing; terms agreement still taken at checkout tickbox. consent.js?v=8.3.0 in all 25 pages.
- Tests: full EN/FR crawl phone+desktop no errors/overflow; notice shows, page usable without dismissing, OK hides it for good. Previews: /home/claude/outputs/preview/*.png

## 5g. One-page guarantee rebuilt (20 Oct)
- Sam's Guarantee_A4.pdf was a flat image; rebuilt same text/layout as /home/claude/outputs/NUVOTAP_Guarantee_A4.pdf (source: scratchpad sheet/sheet.html, logo.png, qr_small.png). Added Sam's logo (glowing N + "nuvotap" on dark navy, rounded tile top-left). Seller line now: "NUVOTAP, Dunfermline, Fife, Scotland · a trading name of Mohammed Shnina". QR verified decoding to https://nuvotap.com/guide.html. Wording otherwise unchanged.
- 🟠 Footer points to nuvotap.com/terms.html — live page is still the old "proposed" terms until new terms are published.
- Logo file from Sam: uploaded PNG 1254x1254 (dark background). Not yet added to the website.

## 6. Next step
(20 Oct ~13:55) Terms + Privacy live. returns.html + fr/returns.html kept as-is, only date changed to 20 Oct 2026 (Sam's instruction). Sam to name the next task.
(20 Oct ~14:00) Small things: 🟢 both test orders (19 Oct 08:32 'Edbf' unpaid; 19 Oct 09:55 'Moh' Stripe test paid) deleted by Sam in Supabase dashboard; verified nuvotap_orders is now EMPTY (20 Oct 14:00). Marketing skill update proposed (card, needs Sam to press Save): replies in English (Sam's choice), prices £9.99/£4.99, multi-buy 4-10 + 11+ quote, WELCOME10, delivery, not VAT registered, Square for everything, guarantee, Halbeath target + no barbers/salons, goal 3 customers/30 days, 7-day trial only if hesitant. Rest of skill kept. Square website checkout and checklist 5b still waiting.
(20 Oct) Sam is doing another task first; when back, ask which checklist items in 5b to do and in what order. Older plan below still stands:
Sam picks the business address; with his dad: Stripe live activation and SMTP setup; then Sam tests account sign-up, prints the one-pager and starts the Halbeath visits. (Names like Julie, Dave and Karen in the role-plays were made up for practice.)
