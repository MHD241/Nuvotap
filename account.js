/* NUVOTAP customer account: sign in, daily log, orders, saved details. Uses Supabase Auth + row-level security. */
(function () {
  'use strict';
  var cfg = window.NUVOTAP_SUPABASE || {};
  var $ = function (id) { return document.getElementById(id); };
  var db = null, user = null, logs = [];
  var LOCAL_KEY = 'nuvotap-guide-log-v1';

  function say(id, text, bad) { var el = $(id); if (!el) return; el.textContent = text || ''; el.className = 'small ' + (bad ? 'acc-bad' : 'muted'); }
  function n(x) { x = parseInt(x, 10); return isNaN(x) || x < 0 ? 0 : x; }
  function show(view) { ['view-auth', 'view-app', 'view-reset'].forEach(function (v) { $(v).hidden = v !== view; }); }
  function tab(name) {
    ['log', 'orders', 'details', 'cards'].forEach(function (t) { $('pane-' + t).hidden = t !== name; $('tab-' + t).setAttribute('aria-selected', t === name ? 'true' : 'false'); });
    if (name === 'orders') loadOrders();
  }

  function start() {
    if (!window.supabase || !window.supabase.createClient || !cfg.url) { say('auth-msg', 'Could not load sign-in. Please refresh the page.', true); return; }
    db = window.supabase.createClient(cfg.url, cfg.publishableKey);
    db.auth.onAuthStateChange(function (event, session) {
      if (event === 'PASSWORD_RECOVERY') { show('view-reset'); return; }
      setUser(session && session.user);
    });
    db.auth.getSession().then(function (r) { setUser(r.data.session && r.data.session.user); });
  }

  function setUser(u) {
    var changed = (u && u.id) !== (user && user.id);
    user = u || null;
    if (!user) { show('view-auth'); return; }
    if (!$('view-reset').hidden) return;
    show('view-app');
    $('who').textContent = user.email;
    if (changed) { loadDetails(); loadLogs(); db.rpc('nuvotap_claim_my_orders').then(function () {}); tab(location.hash === '#orders' ? 'orders' : 'log'); }
  }

  /* ---------- auth ---------- */
  $('auth-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var email = $('auth-email').value.trim(), pw = $('auth-pass').value, mode = $('auth-form').getAttribute('data-mode');
    if (pw.length < 8) { say('auth-msg', 'Please use a password of at least 8 characters.', true); return; }
    say('auth-msg', 'One moment...');
    var p = mode === 'signup'
      ? db.auth.signUp({ email: email, password: pw, options: { emailRedirectTo: location.origin + location.pathname } })
      : db.auth.signInWithPassword({ email: email, password: pw });
    p.then(function (r) {
      if (r.error) { say('auth-msg', mode === 'signup' ? 'Could not create the account: ' + r.error.message : 'Email or password not recognised.', true); return; }
      if (mode === 'signup' && !(r.data && r.data.session)) { say('auth-msg', 'Check your email and tap the confirmation link, then come back and sign in.'); return; }
      say('auth-msg', '');
    });
  });
  function setMode(m) {
    $('auth-form').setAttribute('data-mode', m);
    $('auth-submit').textContent = m === 'signup' ? 'Create account' : 'Sign in';
    $('mode-signin').setAttribute('aria-pressed', m === 'signin');
    $('mode-signup').setAttribute('aria-pressed', m === 'signup');
    $('auth-pass').setAttribute('autocomplete', m === 'signup' ? 'new-password' : 'current-password');
    say('auth-msg', '');
  }
  $('mode-signin').addEventListener('click', function () { setMode('signin'); });
  $('mode-signup').addEventListener('click', function () { setMode('signup'); });
  $('forgot').addEventListener('click', function () {
    var email = $('auth-email').value.trim();
    if (!email) { say('auth-msg', 'Type your email above first, then tap "Forgot password".', true); return; }
    db.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname }).then(function (r) {
      say('auth-msg', r.error ? 'Could not send the email. Please try again in a minute.' : 'If that email has an account, we have sent a reset link.', !!r.error);
    });
  });
  $('reset-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var pw = $('reset-pass').value;
    if (pw.length < 8) { say('reset-msg', 'Please use at least 8 characters.', true); return; }
    db.auth.updateUser({ password: pw }).then(function (r) {
      if (r.error) { say('reset-msg', 'Could not change the password: ' + r.error.message, true); return; }
      say('reset-msg', 'Password changed.'); show('view-app'); setUser(user);
    });
  });
  $('signout').addEventListener('click', function () { db.auth.signOut().then(function () { logs = []; user = null; show('view-auth'); }); });

  /* ---------- details ---------- */
  var F = ['name', 'business', 'phone', 'street', 'address2', 'town', 'region', 'postcode'];
  function loadDetails() {
    db.from('nuvotap_customers').select('*').eq('user_id', user.id).maybeSingle().then(function (r) {
      var d = r.data; if (!d) return; var a = d.address || {};
      $('d-name').value = d.full_name || ''; $('d-business').value = d.business_name || ''; $('d-phone').value = d.phone || '';
      ['street', 'address2', 'town', 'region', 'postcode'].forEach(function (k) { $('d-' + k).value = a[k] || ''; });
    });
  }
  $('details-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var v = function (k) { return $('d-' + k).value.trim(); };
    var row = { user_id: user.id, full_name: v('name').slice(0, 120), business_name: v('business').slice(0, 120), phone: v('phone').slice(0, 60),
      address: { street: v('street').slice(0, 180), address2: v('address2').slice(0, 120), town: v('town').slice(0, 120), region: v('region').slice(0, 120), postcode: v('postcode').slice(0, 20) },
      updated_at: new Date().toISOString() };
    db.from('nuvotap_customers').upsert(row).then(function (r) { say('details-msg', r.error ? 'Could not save. Please try again.' : 'Saved. Your details will be filled in at checkout.', !!r.error); });
  });
  $('delete-account-info').addEventListener('click', function () {
    say('details-msg', 'To delete your account and data, email hello@nuvotap.com from this address and we will remove it.');
  });

  /* ---------- daily log ---------- */
  $('l-date').value = (function () { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })();
  function loadLogs() {
    db.from('nuvotap_review_logs').select('*').eq('user_id', user.id).order('log_date').then(function (r) {
      if (r.error) { say('log-msg', 'Could not load your log. Please refresh.', true); return; }
      logs = r.data || []; renderLogs(); offerImport();
    });
  }
  function renderLogs() {
    var body = $('log-body'); body.innerHTML = '';
    var s = 0, k = 0, rp = 0;
    logs.forEach(function (e) {
      s += e.served; k += e.asked; rp += e.replies;
      var tr = document.createElement('tr');
      [e.log_date, e.served, e.asked, e.by_tap, e.by_text, e.replies].forEach(function (x) { var td = document.createElement('td'); td.textContent = x; tr.appendChild(td); });
      var td = document.createElement('td'), b = document.createElement('button');
      b.type = 'button'; b.className = 'log-del'; b.textContent = 'Delete';
      b.addEventListener('click', function () { db.from('nuvotap_review_logs').delete().eq('user_id', user.id).eq('log_date', e.log_date).then(loadLogs); });
      td.appendChild(b); tr.appendChild(td); body.appendChild(tr);
    });
    var pct = s ? Math.round(k / s * 100) : 0;
    $('log-total').textContent = logs.length ? 'Total so far: ' + s + ' served, ' + k + ' asked (' + pct + '%), ' + rp + ' replies. ' + (pct < 90 ? 'Aim to ask at least 9 in every 10 customers (90%).' : 'You are on track for the 9-in-10 rule.') : 'No days saved yet.';
  }
  function save(row) {
    return db.from('nuvotap_review_logs').upsert(Object.assign({ user_id: user.id, updated_at: new Date().toISOString() }, row));
  }
  $('log-form').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var d = $('l-date').value; if (!d) return;
    var row = { log_date: d, served: n($('l-served').value), asked: n($('l-asked').value), by_tap: n($('l-tap').value), by_text: n($('l-text').value), replies: n($('l-replies').value) };
    if (row.asked > row.served) { say('log-msg', 'Customers asked cannot be more than customers served. Please check the numbers.', true); return; }
    save(row).then(function (r) {
      if (r.error) { say('log-msg', 'Could not save. Please try again.', true); return; }
      say('log-msg', 'Saved ' + d + '.'); ['l-served', 'l-asked'].forEach(function (i) { $(i).value = ''; }); ['l-tap', 'l-text', 'l-replies'].forEach(function (i) { $(i).value = '0'; }); loadLogs();
    });
  });
  $('log-download').addEventListener('click', function () {
    if (!logs.length) { say('log-msg', 'Nothing to download yet.'); return; }
    var rows = [['Date', 'Customers served', 'Customers asked', 'Asked by tap', 'Asked by text', 'Replies sent']].concat(logs.map(function (e) { return [e.log_date, e.served, e.asked, e.by_tap, e.by_text, e.replies]; }));
    var csv = '﻿' + rows.map(function (r) { return r.join(','); }).join('\r\n');
    var u = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), a = document.createElement('a');
    a.href = u; a.download = 'nuvotap-review-log.csv'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
  });
  function localEntries() { try { var v = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
  function offerImport() {
    var have = {}; logs.forEach(function (e) { have[e.log_date] = 1; });
    var fresh = localEntries().filter(function (e) { return e && /^\d{4}-\d{2}-\d{2}$/.test(e.date) && !have[e.date] && n(e.asked) <= n(e.served); });
    $('import-box').hidden = !fresh.length;
    $('import-btn').onclick = function () {
      var rows = fresh.map(function (e) { return { user_id: user.id, log_date: e.date, served: n(e.served), asked: n(e.asked), by_tap: n(e.tap), by_text: n(e.text), replies: n(e.replies) }; });
      db.from('nuvotap_review_logs').upsert(rows).then(function (r) { say('log-msg', r.error ? 'Could not import. Please try again.' : 'Imported ' + rows.length + ' day(s) from this device.', !!r.error); loadLogs(); });
    };
  }

  /* ---------- orders ---------- */
  function loadOrders() {
    var box = $('orders-list'); box.textContent = 'Loading...';
    db.rpc('nuvotap_my_orders').then(function (r) {
      box.textContent = '';
      if (r.error) { box.textContent = 'Could not load your orders. Please refresh.'; return; }
      if (!r.data.length) { box.textContent = 'No orders on this account yet. Orders placed with this email address appear here once the email is confirmed.'; return; }
      r.data.forEach(function (o) {
        var card = document.createElement('div'); card.className = 'acc-order';
        var items = (o.items || []).map(function (x) { return x.qty + ' x ' + ({ white: 'White review card', black: 'Black review card', blank: 'Blank NFC card' }[x.type] || x.type); }).join(', ');
        var lines = [
          new Date(o.created_at).toLocaleDateString('en-GB') + ' · ' + items,
          'Total: £' + Number(o.total_gbp).toFixed(2) + ' · Payment: ' + o.payment_status + ' · Status: ' + o.status,
          o.tracking_number ? 'Tracking: ' + (o.courier || '') + ' ' + o.tracking_number : ''
        ].filter(Boolean);
        lines.forEach(function (t, i) { var p = document.createElement(i ? 'div' : 'strong'); p.textContent = t; card.appendChild(p); });
        box.appendChild(card);
      });
    });
  }

  ['log', 'orders', 'details', 'cards'].forEach(function (t) { $('tab-' + t).addEventListener('click', function () { tab(t); }); });

  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
  s.onload = start; s.onerror = function () { say('auth-msg', 'Could not load sign-in. Please check your connection and refresh.', true); };
  document.head.appendChild(s);
})();
