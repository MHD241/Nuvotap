/* NUVOTAP: one-time terms notice. Statutory consumer rights remain unaffected. */
(()=>{'use strict';
  const KEY='nuvotap-terms-v1';
  if(document.getElementById('nv-terms-dialog'))return;
  const modal=document.createElement('dialog');modal.id='nv-terms-dialog';modal.className='nv-terms-dialog';
  modal.setAttribute('aria-labelledby','nv-terms-title');
  modal.innerHTML=`<div class="nv-terms-inner"><div class="nv-terms-icon" aria-hidden="true"><svg fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" width="24" height="24"><path d="M12 3 4 7v6c0 4 3 6.5 8 8 5-1.5 8-4 8-8V7l-8-4Z"/><path d="m8.7 12 2.3 2.3 4.6-4.6"/></svg></div><h2 id="nv-terms-title">Welcome to NUVOTAP</h2><p>Before browsing, please review our policies. By choosing <strong>I agree</strong>, you confirm you've had an opportunity to read them. Your statutory consumer rights are always protected.</p><div class="nv-terms-links"><a href="terms.html" target="_blank" rel="noopener">Terms &amp; Conditions</a><a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a><a href="returns.html" target="_blank" rel="noopener">Returns &amp; Refunds</a></div><div class="nv-terms-actions"><button type="button" class="btn primary" id="nv-terms-accept">I agree</button><button type="button" class="btn secondary" id="nv-terms-later">Not now</button></div><p class="nv-terms-fine">You'll only see this notice once after agreeing on this device. Ordering and submitting a profile require separate consent where applicable.</p></div>`;
  document.body.append(modal);
  const accept=()=>{try{localStorage.setItem(KEY,JSON.stringify({accepted:true,at:new Date().toISOString()}))}catch(_){}modal.close()};
  modal.querySelector('#nv-terms-accept').addEventListener('click',accept);
  modal.querySelector('#nv-terms-later').addEventListener('click',()=>modal.close());
  modal.addEventListener('click',e=>{if(e.target===modal)modal.close()});
  let hasAgreed=false;try{hasAgreed=!!JSON.parse(localStorage.getItem(KEY)||'null')?.accepted}catch(_){}
  if(!hasAgreed){try{modal.showModal()}catch(_){modal.setAttribute('open','')}}
})();
