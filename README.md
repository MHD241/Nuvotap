# NUVOTAP — GitHub Pages storefront

A full responsive **preview storefront** using HTML, CSS and JavaScript. No build tools required.

## What works right now
- Responsive home page and detailed product popups
- Single (£20) and Duo (£30) product options
- Working basket: add, remove, quantity, subtotal, persistent in your browser using localStorage
- Checkout contact, business and delivery details form with browser-side validation
- Order summary; FAQs; policy preview panels; mobile navigation
- An enquiry email can be prepared once you configure a real business email

## Important: payments are NOT live
GitHub Pages is static hosting and cannot safely process bank-card numbers or create authenticated payment transactions by itself. This website intentionally **does not ask for or store card numbers**. Never add Stripe secret keys or PayPal secrets to this GitHub repository. There is no charge or completed purchase when someone uses this checkout preview.

To take real payments, a parent/guardian or eligible business account holder needs to set up an appropriate payment service and confirm the business's legal, tax, privacy, delivery and returns arrangements. An actual checkout integration will require either (a) hosted payment links with suitable cart limitations or (b) a secure backend/serverless function that creates order-specific checkout sessions. Do not simply turn off the preview warning without implementing and testing a real payment integration.

## Publish on GitHub Pages
1. Unzip the download.
2. Create a GitHub repository, for example `nuvotap`.
3. Upload **the contents of** `NUVOTAP-GitHub` into the repository root (not an extra nested folder).
4. Commit the files.
5. In your repository open **Settings → Pages**, choose **Deploy from a branch**, branch **main**, folder **/(root)**, then save.
6. Wait for GitHub to show the public URL, usually `https://YOUR-USERNAME.github.io/nuvotap/`.
7. Test the site on mobile: menu, product detail, basket, checkout and email enquiry.

## Setup before inviting customers
- Change `contactEmail` in `config.js` to a monitored **business** email (not a personal school email). The checkout enquiry uses the visitor's local email app; it **does not send automatically**.
- Replace the concept product visuals with photos of your real tested cards after you have them. The current visuals are illustrative HTML/CSS renders.
- Confirm the advertised £20 / £30 prices and supplier charges.
- Update the privacy policy, delivery/returns terms, contact details, and product specs before any real sales.
- Add a compliant, real hosted payment checkout only after the payment-provider setup is complete.
- Check that `nuvotap` name and branding do not infringe others' registered marks.

## Files
- `index.html`: page structure and checkout
- `styles.css`: responsive styling and CSS product visuals
- `app.js`: basket, modals and enquiry handling
- `config.js`: contact configuration; checkout remains preview-only
- `assets/nuvotap-logo.png`: uploaded logo reference (preserved in assets)
- `assets/favicon.svg`: small temporary vector favicon

This is a development prototype, not a production-ready payment shop.
