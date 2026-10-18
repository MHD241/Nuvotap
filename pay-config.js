/* NUVOTAP card-payment links (Stripe Payment Links). These are TEST links.
   Buttons stay hidden for visitors until enabled is true; add ?paytest=1 to a product page URL to preview them.
   To go live: create the same links in Stripe LIVE mode, paste them here and set enabled to true. */
window.NUVOTAP_PAY = {
  enabled: false,
  links: {
    white: 'https://buy.stripe.com/test_14A7sNfs64co1tO5ekfbq00',
    black: 'https://buy.stripe.com/test_dRmfZj93IgZa6O89uAfbq01',
    blank: 'https://buy.stripe.com/test_aFa7sNcfUdMYb4ofSYfbq02',
    blankProfile: 'https://buy.stripe.com/test_cNibJ393IdMYegA9uAfbq03'
  }
};
