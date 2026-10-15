# NUVOTAP V6 — Fresh rebuild

Fully static GitHub Pages-ready preview. Upload **contents** of this folder to your repository root. Keep CNAME and `.nojekyll`. No npm/build tooling required.

## Features
- Separate product pages for white review cards, black review cards and blank NFC cards
- Large logo, neon/navy styling and light/dark theme
- Basket with distinct configurations; details stay in browser localStorage
- Optional URL programming at £0.50 per card, unlocked/locked settings
- Optional new digital business profile request at £5 per profile configuration
- Private WELCOME10 promo code, never advertised on public pages
- Historical automatic review-card multi-buy tiers (2=10%, 3=15%, 4-10=20%), visible in calculations but not publicly marketed
- Blank-card prices and 11+ orders are quoted, not invented
- Email enquiry checkout; no card-number capture, no claim of actual order submission
- Sample digital profile with a downloadable sample vCard

## Important
This is a storefront demonstration. No payment processor, stock verification, shipping calculator, database or real automatic order submission is connected. Do not use it for paid sales until these and legal policies are implemented. GitHub Pages may not be suitable as long-term commercial e-commerce hosting.

## Debugging
The HTML contains all visible content without JavaScript. JavaScript handles only interactivity. If a browser blocks scripts, product browsing still works.


V6.1 SAFARI FIX, 15 Oct 2026
- Retains V6 look and functionality, separates static homepage rendering from basket initialization.
- Removes automatic changes to the document's colour mode on load; user toggle remains.
- Does not render basket/cart HTML until basket is opened or changed.
- Cache-busts app.js and styles.css using versioned resource URLs.
- Keeps existing CNAME and .nojekyll files.
- Note: real card payments and server-side order storage are not connected.
- Safari behaviour requires verification on the user's machine; the exact original Safari fault was not independently reproduced.
