/* NUVOTAP: adds "Pay by card" buttons (Stripe Payment Links) to the three product pages. Nothing here touches the basket. */
(function () {
  'use strict';
  var cfg = window.NUVOTAP_PAY;
  if (!cfg || !cfg.links) return;
  var preview = /[?&]paytest=1\b/.test(location.search);
  if (!cfg.enabled && !preview) return;
  var section = document.querySelector('[data-product]');
  var form = document.getElementById('product-form');
  if (!section || !form) return;
  var type = section.getAttribute('data-product');
  var fr = document.documentElement.lang === 'fr';
  var T = fr ? {
    head: 'Ou payez maintenant par carte',
    note: 'Paiement sécurisé par Stripe. Livraison au Royaume-Uni : 2,99 £. Indiquez le nom de votre entreprise ou votre lien à la dernière étape.',
    test: 'MODE TEST : aucun vrai paiement.',
    white: 'Payer par carte — carte blanche · 9,99 £',
    black: 'Payer par carte — carte noire · 9,99 £',
    blank: 'Payer par carte — carte vierge · 4,99 £',
    blankProfile: 'Payer par carte — carte vierge + profil numérique · 9,99 £'
  } : {
    head: 'Or pay by card now',
    note: 'Secure payment by Stripe. UK delivery £2.99. Enter your business name or link at the last step.',
    test: 'TEST MODE: no real payment is taken.',
    white: 'Pay by card — white card · £9.99',
    black: 'Pay by card — black card · £9.99',
    blank: 'Pay by card — blank card · £4.99',
    blankProfile: 'Pay by card — blank card + digital profile · £9.99'
  };
  var keys = type === 'blank' ? ['blank', 'blankProfile'] : [type];
  var box = document.createElement('div');
  box.className = 'estimate';
  box.style.marginTop = '1.25rem';
  var h = document.createElement('strong');
  h.textContent = T.head;
  h.style.cssText = 'display:block;font-family:inherit;font-size:1.1rem';
  box.appendChild(h);
  keys.forEach(function (k) {
    if (!cfg.links[k]) return;
    var a = document.createElement('a');
    a.className = 'btn secondary wide';
    a.style.display = 'block';
    a.style.marginTop = '.6rem';
    a.href = cfg.links[k];
    a.rel = 'noopener';
    a.textContent = T[k] + ' ↗';
    box.appendChild(a);
  });
  var p = document.createElement('p');
  p.className = 'small muted';
  p.textContent = T.note + (cfg.enabled ? '' : ' ' + T.test);
  box.appendChild(p);
  form.parentNode.insertBefore(box, form.nextSibling);
})();
