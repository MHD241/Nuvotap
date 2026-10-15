# NUVOTAP V5 — GitHub Pages preview

This is a **separate redesign package**, not an update to the live repository until you upload it.

## Pages
- `index.html` — neon storefront, three products, FAQ, and mobile navigation
- `white-review.html` — white printed Google review NFC card
- `black-review.html` — black printed Google review NFC card
- `blank-nfc.html` — blank NFC card
- `checkout.html` — delivery details and order enquiry

## Pricing and functionality
- Review cards currently displayed at £20 each; blank-card price is **not final**, so those orders request a quote.
- Quantity discounts retained in the preview (2: 10%, 3: 15%, 4+: 20% for priced review cards). Orders with over ten cards require a quote.
- Link writing costs £0.50 per programmed physical card.
- Permanent lock or unlocked selection. **Do not permanently lock until the chip has been tested.**
- Optional new digital business profile request: £5 per profile request/cart line; one such profile may be used by multiple cards on that line. Distinct profile requests are charged separately. Business name optional; profile name, social URL and email or phone required.
- Existing promo code remains supported by checkout, but is not advertised on the storefront.
- Basket uses this browser's localStorage. Checkout creates an email draft with the requested options; it does not save orders to a server or charge payment cards.

## Known limitations / do not launch paid checkout yet
- No payment processor, server-side order storage, automatic emails, profile hosting or customer-facing `/p/...` pages yet.
- Blank-card selling price, delivery costs, digital-profile hosting duration and later edit fees are unconfirmed.
- Customer-uploaded logo/photo is not implemented yet; collect these manually for profile setup.
- Final stock and product specifications must be confirmed with the supplier.
- Test browser behaviour and full purchase flows on desktop and mobile before launching.
- Promotional and pricing rules currently run in the browser, so they must be revalidated server-side before accepting real payment.

## Deploy to GitHub Pages
Unzip and upload **the contents** to your repository root. Keep the `CNAME` file containing `nuvotap.com`. The existing live website will be replaced only if you commit this package.

## Contact
hello@nuvotap.com


## V5.1 deployment and profile demonstration
- `.nojekyll` lets GitHub Pages serve everything as static files without Jekyll processing.
- Upload the **contents** of this ZIP at the repository root (not a nested V5.1 folder). Verify that `index.html`, `styles.css`, `app.js`, `CNAME`, `assets/` and `p/` are all present on `main`.
- The new `/p/sample-business/` page is a **demo only**. Its Save Contact link downloads a valid, explicitly labelled sample vCard.
- To publish a real customer profile, copy `p/sample-business/` to `p/customer-name/`, replace all sample content with owner-approved details, generate their real vCard and test links. Do not publish personal customer details without permission. This process is **manual**, not a customer self-service profile builder.
- No automatic permanent profile hosting, edit service, backend order storage or payment processing is included. Confirm hosting/edit terms before taking money for profile services.
- Website styles and scripts work with **relative paths**, so both `mhd241.github.io/Nuvotap/` and the `nuvotap.com` custom domain should serve them when the repository is deployed correctly.
- If a white screen appears, check `https://nuvotap.com/styles.css`, `https://nuvotap.com/app.js` and Pages deployment; a failed asset upload or old cached version can cause missing UI. Do not reset DNS to fix missing CSS.
