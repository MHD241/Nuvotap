/* NUVOTAP: "Pay by card" on the checkout page. Sends the basket to the create-checkout function, then redirects to Stripe. */
(function () {
  'use strict';
  var form = document.getElementById('checkout-form');
  var submit = document.getElementById('prepare-order');
  if (!form || !submit) return;
  var cfg = window.NUVOTAP_PAY || {};
  var preview = /[?&]paytest=1\b/.test(location.search);
  if (!cfg.enabled && !preview) return;
  var fr = document.documentElement.lang === 'fr';
  var T = fr ? {
    btn: 'Payer par carte →', test: 'MODE TEST : aucun vrai paiement.', wait: 'Redirection vers le paiement sécurisé Stripe…',
    fail: 'Impossible de lancer le paiement', alt: 'Ou envoyez simplement une demande de commande ci-dessous.'
  } : {
    btn: 'Pay by card →', test: 'TEST MODE: no real payment is taken.', wait: 'Taking you to secure Stripe payment…',
    fail: 'Could not start card payment', alt: 'Or just send an order enquiry below.'
  };
  var pay = document.createElement('button');
  pay.type = 'button';
  pay.className = 'btn primary wide';
  pay.id = 'pay-card';
  pay.textContent = T.btn;
  var note = document.createElement('p');
  note.className = 'small muted';
  note.setAttribute('aria-live', 'polite');
  note.textContent = (cfg.enabled ? '' : T.test + ' ') + T.alt;
  submit.parentNode.insertBefore(pay, submit);
  submit.parentNode.insertBefore(note, submit);
  submit.className = 'btn secondary wide';
  pay.addEventListener('click', async function () {
    var cart = [], code = '';
    try { cart = JSON.parse(localStorage.getItem('nuvotap-v7-basket') || '[]'); code = localStorage.getItem('nuvotap-v7-code') || ''; } catch (e) {}
    if (!Array.isArray(cart) || !cart.length || !form.reportValidity()) return;
    var cfgDb = window.NUVOTAP_SUPABASE || {};
    if (!cfgDb.url || !cfgDb.publishableKey) { note.textContent = T.fail; return; }
    var d = Object.fromEntries(new FormData(form).entries());
    pay.disabled = true; submit.disabled = true; note.textContent = T.wait;
    try {
      var payload = {
        name: d.name, email: d.email, business: d.business || '', phone: d.phone || '', notes: d.notes || '',
        agree: d.termsAgreement === 'on', coupon: code, lang: fr ? 'fr' : 'en', website: '',
        address: { street: d.street, address2: d.address2 || '', town: d.town, region: d.region || '', postcode: d.postcode },
        items: cart.map(function (x) { return { type: x.type, qty: x.qty, programming: x.programming, lock: x.lock, destination: x.destination || '', newProfile: !!x.newProfile }; })
      };
      var res = await fetch(cfgDb.url + '/functions/v1/create-checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json', apikey: cfgDb.publishableKey }, body: JSON.stringify(payload)
      });
      var out = await res.json();
      if (!res.ok || !out.url) throw new Error(out.error || T.fail);
      window.location.href = out.url;
    } catch (err) {
      note.textContent = T.fail + ': ' + err.message;
      pay.disabled = false; submit.disabled = false;
    }
  });
})();
