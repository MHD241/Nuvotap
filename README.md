# NUVOTAP V3 — GitHub Pages website

## Files
- `index.html` — neon homepage
- `product.html` — one product and two-photo gallery, with quantity discounts
- `checkout.html` — **order enquiry only**, not a payment checkout
- `styles.css` — responsive neon dark/light theme
- `app.js` — basket, pricing, theme preferences and enquiry preparation
- `config.js` — editable prices and eventual business contact email
- `assets/` — original user-supplied logo and two product reference images, converted to WebP

## Install on GitHub
1. Extract the ZIP. Upload **all files and the `assets` folder contents** to the root of your GitHub repository; replace old files of the same names. Do not upload the ZIP directly as the website.
2. GitHub → Settings → Pages → Deploy from a branch → main → /(root).
3. Open `https://mhd241.github.io/Nuvotap/` after deployment. Hard-refresh if the old design is cached.
4. If you connect `nuvotap.com`, configure its DNS separately. Do not overwrite mail MX records.

## Pricing
One tag £20; 2 tags 10% off (£36 total); 3 tags 15% off (£51 total); 4–10 tags 20% off (e.g. 4 = £64, 10 = £160). 11+ tags are routed to `hello@nuvotap.com` for a custom quote (no fixed price promised). Same calculation on product, basket, and checkout.

## Important about ordering
GitHub Pages only serves static files. **There is no real payment processor and no server-side order submission.** The order enquiry form either prepares an email via `mailto:` if `config.js` has a valid contactEmail, or displays copyable enquiry text. Current `config.js` is set to `hello@nuvotap.com`; the email account must be active to receive orders. It never stores or transmits payment card information. Do not advertise this as an operational paid shop until you have selected and tested a compliant hosted payment provider and arranged any required adult account holder.

To enable mail enquiries once ready, edit the `contactEmail` value in `config.js`, commit and deploy. Test sending from your own device and inbox. Email enquiry is not reliable as a guaranteed delivery service, and it is not a server-side order database.

## Product images
Both product images were supplied as TIFFs and converted to WebP for fast loading. They illustrate Google review NFC tags but have not been independently verified as final NUVOTAP inventory. The website labels them illustrative. The logo comes from the user's uploaded brand example.

## Pre-launch checklist
Verify supplier stock and specs, test NFC tags on phones, confirm Google review URLs, publish lawful contact/returns/privacy policies, confirm delivery charges, and configure secure payments only through an approved provider. Never store payment card data in front-end code.

## Address information
Enquiry asks for street address, optional second line, town/city, county/region, postcode, UK country, optional phone, customer name, email and business details. The address is included in a mailto draft; the user must actually send it.

**Bulk orders**: 11+ tags open an email draft addressed to hello@nuvotap.com, not a normal checkout. Email clients must be configured to open mailto links.
