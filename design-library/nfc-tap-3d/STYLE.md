# NUVOTAP 3D tap animation: saved style

Saved copy of the animation on how-nfc-works.html. Open `index.html` on its own to see it.

## What it is
A phone flies in over an NFC card on a 3D table, lands on it, a "Card detected" message pops, and the page the card opens appears on the screen. The four steps beside it light up in time. One loop is 9 seconds.

## The look
- Dark navy scene (#080d20) with a soft blue glow behind the table; panels #101a35 with thin #283b65 borders.
- Accent: cyan #58eeff and blue #6290ff. Used for tap ripples, the active step border and the main button.
- Fonts: Manrope (headings and on-screen text), DM Sans (body).
- The card is white with a tiny blue signal icon; the phone is near-black with a thin blue-grey edge.

## How the 3D works (pure CSS, no libraries)
- The stage uses `perspective:1300px`. Inside it, one `.nfc-world` is tilted with `rotateX(56deg) rotateZ(-30deg)`.
- Each object sits at a different `translateZ` height: table -2px, card 6px, rings 14px, phone 170px, down to 16px when it lands.
- Stacked `box-shadow` lines under the card and phone fake thickness.
- A blurred dark shape follows the phone and gets darker as it lands.

## Motion rules
- Slow ease for the fly-in (`cubic-bezier(.45,.05,.3,1)`), then a short hold while the rings pulse out.
- Three cyan rings expand and fade, 0.35s apart.
- The message and the page appear one after the other, never together.
- Visitors who ask their device for reduced motion see the finished tap as a still picture.
- Dragging the stage turns the view; "Pause animation" and "Reset view" buttons sit under the steps.

## Reuse it
Swap the card text and the page shown on the phone screen (`.nfc-card`, `.nfc-page`) to demo any product or link. The timing lives in the `@keyframes nfc-*` rules; change `9s` in one place per rule to speed it up or slow it down.
