(()=>{'use strict';
const $$=(q,root=document)=>[...root.querySelectorAll(q)],$=(q,root=document)=>root.querySelector(q);
const GBP=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(n);
const catalog={white:{name:'White Google Review Card',price:20,image:'assets/product-1.webp'},black:{name:'Black Google Review Card',price:20,image:'assets/product-black.webp'},blank:{name:'Blank NFC Card',price:null,image:'assets/blank-stack.png'}};
const KEY='nuvotap-v5-cart',PROMO='nuvotap-v5-discount',THEME='nuvotap-theme',EMAIL='hello@nuvotap.com';
let cart=[],code='',theme='dark';
try{const c=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(c))cart=c.filter(x=>catalog[x.type]&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<=99).slice(0,40).map(x=>({...x,qty:x.qty}));code=localStorage.getItem(PROMO)||'';theme=localStorage.getItem(THEME)||'dark'}catch{}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(cart));localStorage.setItem(PROMO,code);localStorage.setItem(THEME,theme)}catch{}};
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const safeQty=q=>Math.max(1,Math.min(99,Math.floor(Number(q)||1)));
const totalQty=()=>cart.reduce((s,x)=>s+x.qty,0);
const rate=q=>q>=4?.2:q===3?.15:q===2?.1:0;
const promoOn=()=>code.trim().toUpperCase()==='WELCOME10';
function calc(lines=cart,discount=promoOn()){
 const qty=lines.reduce((s,x)=>s+x.qty,0),priced=lines.filter(x=>catalog[x.type].price!==null);
 const reviewQty=priced.reduce((s,x)=>s+x.qty,0);
 const base=priced.reduce((s,x)=>s+catalog[x.type].price*x.qty,0);
 const qtyOff=Math.round(base*rate(reviewQty)*100)/100;
 const promoOff=discount?Math.round((base-qtyOff)*.1*100)/100:0;
 const programCount=lines.reduce((s,x)=>s+(x.programming==='none'?0:x.qty),0);
 const fees=programCount*.5;
 // A profile is charged once per unique profile request/cart item, not per NFC card.
 const profiles=lines.filter(x=>x.newProfile).length;
 const profileFees=profiles*5;
 const quote=lines.some(x=>catalog[x.type].price===null)||qty>10;
 return {qty,base,qtyOff,promoOff,fees,profileFees,knownTotal:Math.max(0,base-qtyOff-promoOff+fees+profileFees),quote};
}
function applyTheme(){document.documentElement.dataset.theme=theme==='light'?'light':'dark';$$('[data-theme]').forEach(x=>{x.textContent=theme==='light'?'☾':'☀';x.setAttribute('aria-label',theme==='light'?'Switch to dark mode':'Switch to light mode')})}
applyTheme();$$('[data-theme]').forEach(el=>el.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';save();applyTheme()}));
$('[data-menu]')?.addEventListener('click',e=>{const nav=$('#main-nav');const isOpen=nav?.classList.toggle('show');e.currentTarget.setAttribute('aria-expanded',String(!!isOpen))});
const dialog=$('#cart');$$('[data-cart-open]').forEach(x=>x.addEventListener('click',()=>{renderCart();dialog?.showModal()}));$('[data-cart-close]')?.addEventListener('click',()=>dialog?.close());dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
function summaryRows(c){return `<div class="sum-line"><span>Card subtotal</span><b>${GBP(c.base)}</b></div><div class="sum-line"><span>Quantity saving</span><b>−${GBP(c.qtyOff)}</b></div><div class="sum-line"><span>Code saving</span><b>−${GBP(c.promoOff)}</b></div><div class="sum-line"><span>Programming</span><b>${GBP(c.fees)}</b></div><div class="sum-line"><span>New profiles</span><b>${GBP(c.profileFees)}</b></div><div class="sum-total"><span>${c.quote?'Known-cost estimate':'Products subtotal'}</span><b>${GBP(c.knownTotal)}${c.quote?' + quote':''}</b></div>`}
function renderCart(){const out=$('#cart-content');if(!out)return;out.innerHTML=cart.length?cart.map((x,i)=>`<div class="basket-item"><img src="${catalog[x.type].image}" alt=""><div><strong>${catalog[x.type].name}</strong><p>${x.qty} card(s) · ${x.programming==='none'?'Unprogrammed':x.lock==='locked'?'Programmed · Permanently locked':'Programmed · Unlocked'}${x.newProfile?' · New profile':''}</p><div class="basket-control"><button data-cminus="${i}" aria-label="Decrease quantity">−</button><span>${x.qty}</span><button data-cplus="${i}" aria-label="Increase quantity">+</button><button class="remove" data-remove="${i}" aria-label="Remove item">Remove</button></div></div></div>`).join('')+`<div class="basket-summary">${summaryRows(calc())}<p class="muted small">Prices excluding shipping; blank-card prices are quoted separately.</p><a class="btn primary wide" href="checkout.html">Continue to enquiry →</a></div>`:'<div class="cart-empty"><h3>Nothing in your basket yet.</h3><p>Explore our NFC card collection.</p><a class="btn primary" href="index.html#collection">Shop cards ↗</a></div>';
 $$('[data-remove]',out).forEach(b=>b.addEventListener('click',()=>{cart.splice(Number(b.dataset.remove),1);save();sync()}));
 $$('[data-cminus]',out).forEach(b=>b.addEventListener('click',()=>{let i=Number(b.dataset.cminus);cart[i].qty--;if(cart[i].qty<1)cart.splice(i,1);save();sync()}));
 $$('[data-cplus]',out).forEach(b=>b.addEventListener('click',()=>{let i=Number(b.dataset.cplus);if(totalQty()>=99)return;cart[i].qty++;save();sync()}));
}
function sync(){ $$('[data-cart-count]').forEach(x=>x.textContent=totalQty());renderCart();renderCheckout() }
const form=$('#product-form');
if(form){const type=$('[data-product]')?.dataset.product;const quantity=$('#quantity'),pr=$('#programming'),url=$('#url-field'),lock=$('#lock-field'),profile=$('#new-profile'),pf=$('#profile-fields'),dest=$('#destination');
 function update(){let v=pr.value;url.hidden=v!=='url';lock.hidden=v==='none';pf.hidden=!profile.checked;dest.required=v==='url';const q=safeQty(quantity.value),hasProfile=profile.checked;const tmp=[{type,qty:q,programming:v,lock:$('#lock')?.value||'unlocked',newProfile:hasProfile}];const c=calc(tmp,false);$('#product-estimate').innerHTML=`<span>${q>10?'Custom quote for 11+':'Estimated item total'}</span><strong>${c.quote?'Request quote':GBP(c.knownTotal)}</strong><small>${c.quote?'Known extras: '+GBP(c.fees+c.profileFees)+'. Final amount depends on card price and shipping.':'Discounts automatically applied by quantity. Delivery quoted separately.'}</small>`;}
 $('[data-minus]')?.addEventListener('click',()=>{quantity.value=Math.max(1,safeQty(quantity.value)-1);update()});$('[data-plus]')?.addEventListener('click',()=>{quantity.value=Math.min(99,safeQty(quantity.value)+1);update()});['input','change'].forEach(ev=>form.addEventListener(ev,update));pr.addEventListener('change',()=>{if(pr.value==='profile')profile.checked=true;update()});
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const q=safeQty(quantity.value),v=pr.value,np=profile.checked;
 if(v==='profile'&&!np){alert('Select a new digital profile or choose an existing profile URL.');return;}
 if(np){if(!$('#profile-name').value.trim()||!$('#social-url').value.trim()||!($('#profile-email').value.trim()||$('#profile-phone').value.trim())){alert('For a new digital profile, enter a name, a social link, and at least one contact method (email or phone).');return;}if(!$('#social-url').checkValidity()||!$('#profile-email').checkValidity()){form.reportValidity();return;}}
 const data=new FormData(form);let item={type,qty:q,programming:v,lock:v==='none'?'none':data.get('lock'),destination:v==='url'?String(data.get('destination')||''):'',newProfile:np,profile:np?{name:String(data.get('profileName')||''),social:String(data.get('socialUrl')||''),email:String(data.get('profileEmail')||''),phone:String(data.get('profilePhone')||''),business:String(data.get('profileBusiness')||''),description:String(data.get('profileDescription')||'')}:null};
 if(totalQty()+q>99){alert('For large quantities please email hello@nuvotap.com.');return;}cart.push(item);save();sync();dialog?.showModal();});update();}
function renderCheckout(){const items=$('#checkout-items'),prices=$('#checkout-prices');if(!items||!prices)return;items.innerHTML=cart.length?cart.map(x=>`<div class="checkout-item"><img src="${catalog[x.type].image}" alt=""><div><b>${catalog[x.type].name}</b><p>${x.qty} × ${x.programming==='none'?'Blank / no programming':x.lock==='locked'?'Programmed · locked':'Programmed · unlocked'}${x.newProfile?' · New profile':''}</p></div></div>`).join(''):'<p>Your basket is empty. <a href="index.html#collection">Shop cards ↗</a></p>';
 prices.innerHTML=cart.length?summaryRows(calc()):'';const button=$('#checkout-form button[type=submit]');if(button)button.disabled=!cart.length;const msg=$('#coupon-message');if(msg)msg.textContent=promoOn()?'Code applied.':code?'This code is not valid.':'';
}
$('#coupon-apply')?.addEventListener('click',()=>{code=String($('#coupon').value||'').trim().toUpperCase();save();renderCheckout()});
$('#coupon')?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('#coupon-apply').click()}});
const checkForm=$('#checkout-form');checkForm?.addEventListener('submit',e=>{e.preventDefault();if(!cart.length||!checkForm.reportValidity())return;
 const d=Object.fromEntries(new FormData(checkForm).entries()),c=calc();const lines=[`NUVOTAP ORDER ENQUIRY`, ``, ...cart.flatMap((x,i)=>[`Item ${i+1}: ${catalog[x.type].name}`,`Quantity: ${x.qty}`,`Programming: ${x.programming}`,`Lock: ${x.lock}`,`Destination URL: ${x.destination||'N/A'}`,`New digital profile: ${x.newProfile?'Yes':'No'}`,...(x.profile?[`Profile name: ${x.profile.name}`,`Social link: ${x.profile.social}`,`Profile email: ${x.profile.email}`,`Profile phone: ${x.profile.phone}`,`Profile business: ${x.profile.business}`,`Profile description: ${x.profile.description}`]:[]),``]),`Card subtotal: ${GBP(c.base)}`,`Quantity discount: -${GBP(c.qtyOff)}`,`Promo saving: -${GBP(c.promoOff)}`,`Programming fees: ${GBP(c.fees)}`,`Digital profile fees: ${GBP(c.profileFees)}`,`Known-cost estimate: ${GBP(c.knownTotal)}`,`Custom quote required: ${c.quote?'YES':'No'}`,`Delivery and hosting/edit conditions: to confirm`,``,`Name: ${d.name}`,`Email: ${d.email}`,`Business name: ${d.business||''}`,`Telephone: ${d.phone||''}`,`Address: ${d.street}`,`Address line 2: ${d.address2||''}`,`Town: ${d.town}`,`County/Region: ${d.province}`,`Postcode: ${d.postcode}`,`Country: ${d.country}`,`Notes: ${d.notes||''}`,``,`No payment has been taken. Please reply with final quotation and arrangements.`];const body=lines.join('\n');const href=`mailto:${EMAIL}?subject=${encodeURIComponent('NUVOTAP order enquiry')}&body=${encodeURIComponent(body)}`;
 const output=$('#order-output');output.hidden=false;output.innerHTML='<h3>Enquiry ready to send</h3><p>Your email app will open when you click below. No order has been submitted yet.</p><a class="btn primary" id="mailto-send" href="'+esc(href)+'">Open email app ↗</a><p class="muted small">If your email app does not open, copy the details instead.</p><textarea rows="9" readonly aria-label="Order details">'+esc(body)+'</textarea><button type="button" class="btn ghost" id="copy-enquiry">Copy order details</button>';
 $('#copy-enquiry').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(body);$('#copy-enquiry').textContent='Copied ✓'}catch{$('#order-output textarea').select();document.execCommand('copy')}});output.scrollIntoView({behavior:'smooth'});
 });
sync();
})();
