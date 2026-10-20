/* NUVOTAP: small one-time policy notice. Does not block browsing; agreement to the terms is taken at checkout. */
(()=>{'use strict';
  const KEY='nuvotap-terms-v1';
  if(document.getElementById('nv-notice'))return;
  let seen=false;try{seen=!!JSON.parse(localStorage.getItem(KEY)||'null')?.accepted}catch(_){}
  if(seen)return;
  const fr=(document.documentElement.lang||'').toLowerCase().startsWith('fr');
  const t=fr
    ?{msg:'Pas de cookies publicitaires ni de suivi. Lisez nos',terms:'Conditions',privacy:'Confidentialité',returns:'Retours',and:'et',ok:'OK',label:'Avis sur nos politiques'}
    :{msg:'No advertising cookies or tracking. Read our',terms:'Terms',privacy:'Privacy',returns:'Returns',and:'and',ok:'OK',label:'Policy notice'};
  const bar=document.createElement('div');bar.id='nv-notice';bar.className='nv-notice';bar.setAttribute('role','region');bar.setAttribute('aria-label',t.label);
  bar.innerHTML=`<p>${t.msg} <a href="terms.html">${t.terms}</a>, <a href="privacy.html">${t.privacy}</a> ${t.and} <a href="returns.html">${t.returns}</a>.</p><button type="button" class="btn secondary">${t.ok}</button>`;
  bar.querySelector('button').addEventListener('click',()=>{try{localStorage.setItem(KEY,JSON.stringify({accepted:true,at:new Date().toISOString()}))}catch(_){}bar.remove()});
  const css=document.createElement('style');
  css.textContent='.nv-notice{position:fixed;left:12px;right:12px;bottom:12px;z-index:60;display:flex;align-items:center;gap:12px;max-width:640px;margin:0 auto;padding:10px 12px 10px 16px;background:#0d1830;color:#bfcce2;border:1px solid #36527d;border-radius:14px;box-shadow:0 12px 40px #0008;font-size:13px;line-height:1.45}.nv-notice p{margin:0;flex:1}.nv-notice a{color:#85ddfb;text-decoration:underline;text-underline-offset:3px}.nv-notice .btn{flex:none;padding:8px 16px;min-height:0;font-size:13px}';
  const add=()=>{document.head.append(css);document.body.append(bar)};
  document.body?add():document.addEventListener('DOMContentLoaded',add);
})();
