(()=>{'use strict';
const cfg=window.NUVOTAP_CONFIG||{singlePrice:20,contactEmail:'hello@nuvotap.com'};
const $=(q)=>document.querySelector(q), $$=(q)=>document.querySelectorAll(q);
const pounds=(n)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(n);
const safeQty=(x)=>Math.max(1,Math.min(99,Math.floor(Number(x)||1)));
const discountRate=(qty)=>qty>=4?0.20:qty===3?0.15:qty===2?0.10:0;
const subtotal=(qty)=>Math.round(qty*cfg.singlePrice*(1-discountRate(qty))*100)/100;
const contactEmail=cfg.contactEmail||'hello@nuvotap.com';
const bulkMail=(qty)=>'mailto:'+contactEmail+'?subject='+encodeURIComponent('NUVOTAP bulk order enquiry — '+qty+' tags')+'&body='+encodeURIComponent('Hello NUVOTAP,\n\nI would like a quote for '+qty+' NFC Google review tags.\n\nBusiness name:\nContact name:\nDelivery town/postcode:\n\nPlease confirm the price, delivery costs and next steps.');
const dealLabel=(qty)=>discountRate(qty)?Math.round(discountRate(qty)*100)+'% multi-buy discount':'No quantity discount';
let state={quantity:1,cart:0};
try{const saved=JSON.parse(localStorage.getItem('nuvotap.v2')||'{}');state.cart=Math.max(0,Math.min(99,Math.floor(Number(saved.cart)||0)))}catch{}
const persist=()=>{try{localStorage.setItem('nuvotap.v2',JSON.stringify({cart:state.cart}))}catch{}};
const escapeText=(s)=>String(s).replace(/[&<>"']/g,(a)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[a]));
let theme='dark';try{theme=localStorage.getItem('nuvotap.theme')||'dark'}catch{};
const applyTheme=()=>{document.documentElement.dataset.theme=theme;$$('[data-theme-toggle]').forEach(b=>{b.setAttribute('aria-label',theme==='dark'?'Switch to light mode':'Switch to dark mode');b.innerHTML=theme==='dark'?'☀ <span>Light</span>':'☾ <span>Dark</span>'})};applyTheme();
$$('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';try{localStorage.setItem('nuvotap.theme',theme)}catch{}applyTheme()}));
const render=()=>{
 $$('[data-cart-count]').forEach(el=>el.textContent=state.cart);
 $$('[data-cart-total]').forEach(el=>el.textContent=pounds(subtotal(state.cart||1)));
 const price=$('[data-product-price]');if(price)price.textContent=state.quantity>10?'Custom quote':pounds(subtotal(state.quantity));
 const compare=$('[data-original-price]');if(compare)compare.textContent=state.quantity>10?'':pounds(state.quantity*cfg.singlePrice);
 const save=$('[data-saving]');if(save)save.textContent=state.quantity>10?'For 11+ tags, email hello@nuvotap.com for a custom quote.':state.quantity>1?`You save ${pounds(state.quantity*cfg.singlePrice-subtotal(state.quantity))} (${dealLabel(state.quantity)})`:'Add a second tag to unlock 10% off';
 const addBtn=$('[data-add-cart]');if(addBtn){addBtn.textContent=state.quantity>10?'✉ Enquire about 11+ tags':'＋ Add to basket';}
 const qty=$('[data-quantity]');if(qty)qty.value=state.quantity;
 const cart=$('[data-cart-content]');if(cart){cart.innerHTML=state.cart?`<div class="cart-line"><img src="assets/product-1.webp" alt="NFC review tag"/><div><strong>NFC Google Review Tag</strong><p>${state.cart} ${state.cart===1?'tag':'tags'} · ${dealLabel(state.cart)}</p><div class="cart-line-actions"><button data-cart-minus aria-label="Remove one">−</button><span>${state.cart}</span><button data-cart-plus aria-label="Add one">+</button></div></div><strong>${state.cart>10?'Quote required':pounds(subtotal(state.cart))}</strong></div><div class="cart-summary"><div><span>Subtotal</span><b>${state.cart>10?'Custom quote':pounds(subtotal(state.cart))}</b></div><div><span>${state.cart>10?'Pricing':'Discount saving'}</span><b class="mint">${state.cart>10?'Contact us':'−'+pounds(state.cart*cfg.singlePrice-subtotal(state.cart))}</b></div><small>Delivery cost and payment arrangements confirmed by email before purchase.</small>${state.cart>10?`<a class="btn primary full" href="${bulkMail(state.cart)}">Email us for 11+ tags →</a><p class="small muted">An email draft will open; you must send it yourself.</p>`:`<a href="checkout.html" class="btn primary full">Continue to order enquiry →</a>`}</div>`:`<div class="empty"><span>◌</span><h3>Your basket is empty</h3><p>Add NFC review tags to get started.</p><a class="btn primary" href="product.html">Explore product</a></div>`;
 cart.querySelector('[data-cart-minus]')?.addEventListener('click',()=>{state.cart=Math.max(0,state.cart-1);persist();render()});
 cart.querySelector('[data-cart-plus]')?.addEventListener('click',()=>{state.cart=Math.min(99,state.cart+1);persist();render()});
 }
 const checkoutSummary=$('[data-checkout-summary]');if(checkoutSummary){checkoutSummary.innerHTML=state.cart>10?`<p>For ${state.cart} tags, please request a custom quote by email. No automatic price applies to orders above 10.</p>`:state.cart?`<div class="checkout-price"><span>NFC Review Tag × ${state.cart}</span><b>${pounds(subtotal(state.cart))}</b></div><div class="checkout-price"><span>${dealLabel(state.cart)}</span><b class="mint">−${pounds(state.cart*cfg.singlePrice-subtotal(state.cart))}</b></div><div class="checkout-price grand"><span>Products subtotal</span><strong>${pounds(subtotal(state.cart))}</strong></div><p class="small muted">Shipping and payment instructions will be confirmed separately.</p>`:`<p>Your basket is empty. <a href="product.html">Choose your tags first →</a></p>`;const submit=$('[data-submit-enquiry]');if(submit)submit.disabled=!state.cart||state.cart>10;const bulk=$('[data-bulk-checkout]');if(bulk){bulk.hidden=state.cart<=10;if(state.cart>10)bulk.href=bulkMail(state.cart);}}
};
$$('[data-qty-minus]').forEach(b=>b.addEventListener('click',()=>{state.quantity=Math.max(1,state.quantity-1);render()}));
$$('[data-qty-plus]').forEach(b=>b.addEventListener('click',()=>{state.quantity=Math.min(99,state.quantity+1);render()}));
$('[data-quantity]')?.addEventListener('change',e=>{state.quantity=safeQty(e.target.value);render()});
$$('[data-add-cart]').forEach(b=>b.addEventListener('click',()=>{if(state.quantity>10){window.location.href=bulkMail(state.quantity);return;}state.cart=Math.min(99,state.cart+state.quantity);persist();render();openCart()}));
const dialog=$('#cart-dialog');const openCart=()=>{if(dialog&&!dialog.open)dialog.showModal()};
$$('[data-open-cart]').forEach(b=>b.addEventListener('click',openCart));
$$('[data-close-cart]').forEach(b=>b.addEventListener('click',()=>dialog?.close()));
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
$$('[data-gallery-thumb]').forEach(b=>b.addEventListener('click',()=>{const img=$('[data-gallery-main]');if(img){img.src=b.dataset.src;img.alt=b.dataset.alt||'NFC tag product photo'}$$('[data-gallery-thumb]').forEach(el=>el.classList.toggle('active',el===b))}));
const form=$('#order-form');form?.addEventListener('submit',e=>{
 e.preventDefault();if(!form.reportValidity()||!state.cart||state.cart>10)return;
 const data=new FormData(form);const record=Object.fromEntries(data.entries());
 const detail=`NUVOTAP ORDER ENQUIRY\n\n${state.cart} NFC Google review tag(s)\nProduct subtotal: ${pounds(subtotal(state.cart))}\nDiscount: ${pounds(state.cart*cfg.singlePrice-subtotal(state.cart))}\nDelivery cost: To be quoted\n\nName: ${record.name||''}\nEmail: ${record.email||''}\nBusiness: ${record.business||''}\nGoogle review link: ${record.reviewLink||'To be provided'}\nStreet address: ${record.street||''}\nAddress line 2: ${record.address2||''}\nTown / city: ${record.town||''}\nCounty / region: ${record.province||''}\nDelivery postcode: ${record.postcode||''}\nCountry: ${record.country||''}\nTelephone: ${record.phone||''}\nNotes: ${record.notes||''}\n\nNo payment has been taken. Please confirm the total and arrangements.`;
 const output=$('#order-result');if(!cfg.contactEmail||!/^\S+@\S+\.\S+$/.test(cfg.contactEmail)){output.innerHTML='<strong>Order enquiry prepared.</strong><p>Our business inbox is not connected yet. Copy the details below for your records. Do not assume the order was sent.</p><textarea readonly rows="11">'+escapeText(detail)+'</textarea><button type="button" class="btn primary" id="copy-order">Copy order details</button>';$('#copy-order')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(detail);$('#copy-order').textContent='Copied ✓'}catch{const ta=output.querySelector('textarea');ta.select();document.execCommand('copy')}})}else{const href='mailto:'+encodeURIComponent(cfg.contactEmail)+'?subject='+encodeURIComponent('NUVOTAP order enquiry')+'&body='+encodeURIComponent(detail);output.innerHTML='<strong>Your order enquiry is ready.</strong><p>Click below to open your email app and send it. No payment has been taken.</p><a class="btn primary" href="'+href+'">Open email to send enquiry →</a>';}
 output.hidden=false;output.scrollIntoView({behavior:'smooth',block:'center'});
});
render();
})();
