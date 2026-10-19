/* NUVOTAP: fills empty checkout fields from the signed-in customer's saved details. Loads the sign-in library only if a saved session exists. */
(function () {
  'use strict';
  var cfg = window.NUVOTAP_SUPABASE || {};
  if (!cfg.url) return;
  var has = false;
  try { for (var i = 0; i < localStorage.length; i++) { if (/^sb-.*-auth-token$/.test(localStorage.key(i))) has = true; } } catch (e) {}
  if (!has) return;
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
  s.onload = function () {
    var db = window.supabase.createClient(cfg.url, cfg.publishableKey);
    db.auth.getSession().then(function (r) {
      var u = r.data.session && r.data.session.user; if (!u) return;
      var set = function (name, v) { var el = document.querySelector('#checkout-form [name="' + name + '"]'); if (el && v && !el.value) el.value = v; };
      set('email', u.email);
      db.from('nuvotap_customers').select('*').eq('user_id', u.id).maybeSingle().then(function (x) {
        var d = x.data; if (!d) return; var a = d.address || {};
        set('name', d.full_name); set('business', d.business_name); set('phone', d.phone);
        ['street', 'address2', 'town', 'region', 'postcode'].forEach(function (k) { set(k, a[k]); });
      });
    });
  };
  document.head.appendChild(s);
})();
