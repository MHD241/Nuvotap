(()=>{'use strict';
const cfg=window.NUVOTAP_CONFIG||{};
const $=(q)=>document.querySelector(q), $$=(q)=>document.querySelectorAll(q);
const pounds=(n)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:cfg.currency||'GBP'}).format(n);
const safeQty=(x)=>Math.max(1,Math.min(99,Math.floor(Number(x)||1)));
const discountRate=(qty)=>qty>=4&&qty<=10?0.20:qty===3?0.15:qty===2?0.10:0;
const qtySubtotal=(qty)=>Math.round(qty*cfg.singlePrice*(1-discountRate(qty))*100)/100;
const promoValid=(code)=>String(code||'').trim().toUpperCase()===String(cfg.promoCode||'WELCOME10').toUpperCase();
const promoDiscount=(qty,code)=>qty>10?0:promoValid(code)?Math.round(qtySubtotal(qty)*(cfg.promoDiscountRate||0.10)*100)/100:0;
const finalTotal=(qty,code)=>Math.max(0,Math.round((qtySubtotal(qty)-promoDiscount(qty,code))*100)/100);
const dealLabel=(qty)=>discountRate(qty)?`${Math.round(discountRate(qty)*100)}% quantity discount`:'No quantity discount';
const contactEmail=cfg.contactEmail||'hello@nuvotap.com';
const escapeText=(s)=>String(s).replace(/[&<>"']/g,(a)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[a]));
const bulkMail=(qty)=>'mailto:'+contactEmail+'?subject='+encodeURIComponent(`NUVOTAP bulk order enquiry — ${qty} tags`)+'&body='+encodeURIComponent(`Hello NUVOTAP,\n\nI would like a quote for ${qty} NFC Google review tags.\n\nContact name:\nBusiness name:\nPreferred colour:\nDelivery town/postcode:\n\nPlease confirm pricing, delivery and next steps.`);
const state={quantity:1, colour:'white', cart:{qty:0, colour:'white'}, promoCode:'', theme:'dark'};
try{
  const saved=JSON.parse(localStorage.getItem('nuvotap.v4')||'{}');
  if(saved.cart) state.cart={qty:Math.max(0,Math.min(99,Math.floor(Number(saved.cart.qty)||0))), colour:saved.cart.colour==='black'?'black':'white'};
  state.promoCode=typeof saved.promoCode==='string'?saved.promoCode:'';
}catch{}
try{ state.theme=localStorage.getItem('nuvotap.theme')||'dark'; }catch{}
const persist=()=>{ try{ localStorage.setItem('nuvotap.v4',JSON.stringify({cart:state.cart,promoCode:state.promoCode})); }catch{} };
const applyTheme=()=>{document.documentElement.dataset.theme=state.theme;$$('[data-theme-toggle]').forEach(b=>{b.setAttribute('aria-label',state.theme==='dark'?'Switch to light mode':'Switch to dark mode');b.innerHTML=state.theme==='dark'?'☀ <span>Light</span>':'☾ <span>Dark</span>'})};
applyTheme();
$$('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';try{localStorage.setItem('nuvotap.theme',state.theme)}catch{}applyTheme()}));

const setPromoMessage=(msg,good=false)=>{
  $$('[data-promo-message]').forEach(el=>{el.innerHTML=msg;el.classList.toggle('mint',good);});
};
const currentImageForColour=(colour)=>colour==='black'?'assets/product-black.webp':'assets/product-1.webp';
const currentName=()=>`NFC Google Review Tag · ${state.cart.colour==='black'?'Black':'White'}`;
const applyColourUI=()=>{
  $$('[data-colour]').forEach(btn=>{const active=btn.dataset.colour===state.colour;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',active?'true':'false')});
  const productPageMain=$('[data-gallery-main]');
  if(productPageMain){
    const src=currentImageForColour(state.colour);
    productPageMain.src=src;
    productPageMain.alt=`${state.colour==='black'?'Black':'White'} NFC review tag`;
    $$('[data-gallery-thumb]').forEach(t=>t.classList.toggle('active',t.dataset.src===src));
  }
};
const render=()=>{
  applyColourUI();
  $$('[data-cart-count]').forEach(el=>el.textContent=state.cart.qty);
  $$('[data-cart-total]').forEach(el=>el.textContent=pounds(finalTotal(state.cart.qty||1,state.promoCode)));
  $$('[data-promo-input]').forEach(input=>input.value=state.promoCode);
  const qtyInput=$('[data-quantity]'); if(qtyInput) qtyInput.value=state.quantity;

  const productPrice=$('[data-product-price]'); if(productPrice) productPrice.textContent=state.quantity>10?'Custom quote':pounds(finalTotal(state.quantity,state.promoCode));
  const original=$('[data-original-price]'); if(original) original.textContent=state.quantity>10?'':pounds(state.quantity*cfg.singlePrice);
  const save=$('[data-saving]');
  if(save){
    if(state.quantity>10) save.textContent='For 11+ tags, please email hello@nuvotap.com for a custom quote.';
    else {
      const qtySave=state.quantity*cfg.singlePrice-qtySubtotal(state.quantity);
      const promoSave=promoDiscount(state.quantity,state.promoCode);
      const totalSave=qtySave+promoSave;
      if(state.quantity===1 && !promoValid(state.promoCode)) save.textContent='Add a second tag to unlock 10% off.';
      else save.textContent=`You save ${pounds(totalSave)}${promoValid(state.promoCode)?' including WELCOME10':''}.`;
    }
  }
  const addBtn=$('[data-add-cart]'); if(addBtn) addBtn.textContent=state.quantity>10?'✉ Enquire about 11+ tags':'＋ Add to basket';

  const cart=$('[data-cart-content]');
  if(cart){
    if(!state.cart.qty){
      cart.innerHTML=`<div class="empty"><span>◌</span><h3>Your basket is empty</h3><p>Add your NFC review tag to get started.</p><a class="btn primary" href="product.html">Open product page</a></div>`;
    } else {
      const qtySave=state.cart.qty*cfg.singlePrice-qtySubtotal(state.cart.qty);
      const promoSave=promoDiscount(state.cart.qty,state.promoCode);
      cart.innerHTML=`
      <div class="cart-line">
        <img src="${currentImageForColour(state.cart.colour)}" alt="${currentName()}">
        <div>
          <strong>${currentName()}</strong>
          <p>${state.cart.qty} ${state.cart.qty===1?'tag':'tags'} · ${dealLabel(state.cart.qty)}</p>
          <div class="cart-line-actions"><button data-cart-minus aria-label="Remove one">−</button><span>${state.cart.qty}</span><button data-cart-plus aria-label="Add one">+</button></div>
        </div>
        <strong>${state.cart.qty>10?'Quote required':pounds(finalTotal(state.cart.qty,state.promoCode))}</strong>
      </div>
      <div class="promo-box inline-promo">
        <label for="promo-inline">Discount code</label>
        <div class="promo-row"><input id="promo-inline" type="text" placeholder="WELCOME10" data-promo-input autocomplete="off"><button type="button" class="btn secondary mini" data-apply-promo>Apply</button></div>
        <p class="fineprint" data-promo-message>${promoValid(state.promoCode)?'<strong>WELCOME10 applied.</strong>':'Use code <strong>WELCOME10</strong> for 10% off.'}</p>
      </div>
      <div class="cart-summary">
        <div><span>Subtotal</span><b>${state.cart.qty>10?'Custom quote':pounds(qtySubtotal(state.cart.qty))}</b></div>
        <div><span>Quantity discount</span><b class="mint">${state.cart.qty>10?'Custom':'−'+pounds(qtySave)}</b></div>
        <div><span>Promo code</span><b class="mint">${state.cart.qty>10?'N/A':(promoSave?('−'+pounds(promoSave)):'—')}</b></div>
        <div><span>Total</span><strong>${state.cart.qty>10?'Email for quote':pounds(finalTotal(state.cart.qty,state.promoCode))}</strong></div>
        <small>Shipping and payment are confirmed after your enquiry.</small>
        ${state.cart.qty>10?`<a class="btn primary full" href="${bulkMail(state.cart.qty)}">Email us for 11+ tags →</a>`:`<a href="checkout.html" class="btn primary full">Continue to checkout →</a>`}
      </div>`;
    }
    cart.querySelector('[data-cart-minus]')?.addEventListener('click',()=>{state.cart.qty=Math.max(0,state.cart.qty-1);persist();render()});
    cart.querySelector('[data-cart-plus]')?.addEventListener('click',()=>{state.cart.qty=Math.min(99,state.cart.qty+1);persist();render()});
  }

  const checkoutSummary=$('[data-checkout-summary]');
  if(checkoutSummary){
    if(!state.cart.qty){
      checkoutSummary.innerHTML='<p>Your basket is empty. <a href="product.html">Choose your tag first →</a></p>';
    } else if(state.cart.qty>10){
      checkoutSummary.innerHTML=`<p><strong>Custom quote needed</strong></p><p>Your order contains ${state.cart.qty} tags. Please email us for pricing and next steps.</p>`;
    } else {
      const qtySave=state.cart.qty*cfg.singlePrice-qtySubtotal(state.cart.qty);
      const promoSave=promoDiscount(state.cart.qty,state.promoCode);
      checkoutSummary.innerHTML=`
        <div class="checkout-price"><span>${currentName()} × ${state.cart.qty}</span><b>${pounds(state.cart.qty*cfg.singlePrice)}</b></div>
        <div class="checkout-price"><span>Quantity discount</span><b class="mint">−${pounds(qtySave)}</b></div>
        <div class="checkout-price"><span>Promo code ${promoValid(state.promoCode)?`(${escapeText(state.promoCode.toUpperCase())})`:''}</span><b class="mint">${promoSave?('−'+pounds(promoSave)):'—'}</b></div>
        <div class="checkout-price grand"><span>Products total</span><strong>${pounds(finalTotal(state.cart.qty,state.promoCode))}</strong></div>
      `;
    }
    $('[data-submit-enquiry]')?.toggleAttribute('disabled',!state.cart.qty||state.cart.qty>10);
    const bulk=$('[data-bulk-checkout]'); if(bulk){bulk.hidden=state.cart.qty<=10;if(state.cart.qty>10)bulk.href=bulkMail(state.cart.qty)}
  }

  if(promoValid(state.promoCode)) setPromoMessage('<strong>WELCOME10 applied.</strong> A further 10% discount is included.',true);
  else if(state.promoCode.trim()) setPromoMessage('That code is not recognised. Try <strong>WELCOME10</strong>.',false);
  else setPromoMessage('Use code <strong>WELCOME10</strong> for 10% off.',false);
};

$$('[data-qty-minus]').forEach(b=>b.addEventListener('click',()=>{state.quantity=Math.max(1,state.quantity-1);render()}));
$$('[data-qty-plus]').forEach(b=>b.addEventListener('click',()=>{state.quantity=Math.min(99,state.quantity+1);render()}));
$('[data-quantity]')?.addEventListener('change',e=>{state.quantity=safeQty(e.target.value);render()});
$$('[data-colour]').forEach(btn=>btn.addEventListener('click',()=>{state.colour=btn.dataset.colour==='black'?'black':'white';render()}));
$$('[data-gallery-thumb]').forEach(b=>b.addEventListener('click',()=>{
  const img=$('[data-gallery-main]'); if(img){img.src=b.dataset.src;img.alt=b.dataset.alt||'NFC tag product photo'}
  if(b.dataset.colourThumb) state.colour=b.dataset.colourThumb;
  $$('[data-gallery-thumb]').forEach(el=>el.classList.toggle('active',el===b));
  if(b.dataset.colourThumb) $$('[data-colour]').forEach(btn=>{const active=btn.dataset.colour===state.colour;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',active?'true':'false')});
}));
$$('[data-apply-promo]').forEach(btn=>btn.addEventListener('click',()=>{ const input=btn.closest('.promo-box')?.querySelector('[data-promo-input]') || $('[data-promo-input]'); state.promoCode=(input?.value||'').trim().toUpperCase(); persist(); render(); }));
$$('[data-promo-input]').forEach(input=>input.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); state.promoCode=(input.value||'').trim().toUpperCase(); persist(); render(); }}));

const dialog=$('#cart-dialog'); const openCart=()=>{if(dialog&&!dialog.open)dialog.showModal()};
$$('[data-open-cart]').forEach(b=>b.addEventListener('click',openCart));
$$('[data-close-cart]').forEach(b=>b.addEventListener('click',()=>dialog?.close()));
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
$$('[data-add-cart]').forEach(b=>b.addEventListener('click',()=>{ if(state.quantity>10){window.location.href=bulkMail(state.quantity); return;} state.cart={qty:Math.min(99,state.cart.qty+state.quantity), colour:state.colour}; persist(); render(); openCart(); }));

const form=$('#order-form');
form?.addEventListener('submit',e=>{
  e.preventDefault(); if(!form.reportValidity()||!state.cart.qty||state.cart.qty>10) return;
  const data=new FormData(form); const record=Object.fromEntries(data.entries());
  const qtySave=state.cart.qty*cfg.singlePrice-qtySubtotal(state.cart.qty); const promoSave=promoDiscount(state.cart.qty,state.promoCode);
  const detail=`NUVOTAP ORDER ENQUIRY\n\nProduct: NFC Google Review Tag\nColour: ${state.cart.colour==='black'?'Black':'White'}\nQuantity: ${state.cart.qty}\nBase price: ${pounds(state.cart.qty*cfg.singlePrice)}\nQuantity discount: ${pounds(qtySave)}\nPromo code: ${state.promoCode||'None'}\nPromo discount: ${pounds(promoSave)}\nProducts total: ${pounds(finalTotal(state.cart.qty,state.promoCode))}\nDelivery cost: To be confirmed\n\nFull name: ${record.name||''}\nEmail: ${record.email||''}\nBusiness name: ${record.business||''}\nTelephone: ${record.phone||''}\nGoogle review link: ${record.reviewLink||'To be provided'}\nStreet address: ${record.street||''}\nAddress line 2: ${record.address2||''}\nTown / city: ${record.town||''}\nProvince / county / region: ${record.province||''}\nPost code: ${record.postcode||''}\nCountry: ${record.country||''}\nNotes: ${record.notes||''}\n\nNo payment has been taken. Please confirm the total, shipping and payment method.`;
  const output=$('#order-result');
  if(!cfg.contactEmail || !/^\S+@\S+\.\S+$/.test(cfg.contactEmail)){
    output.innerHTML='<strong>Order enquiry prepared.</strong><p>Our email inbox is not connected yet. Copy the details below.</p><textarea readonly rows="14">'+escapeText(detail)+'</textarea><button type="button" class="btn primary" id="copy-order">Copy order details</button>';
    $('#copy-order')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(detail);$('#copy-order').textContent='Copied ✓'}catch{const ta=output.querySelector('textarea');ta.select();document.execCommand('copy')}});
  } else {
    const href='mailto:'+encodeURIComponent(cfg.contactEmail)+'?subject='+encodeURIComponent('NUVOTAP order enquiry')+'&body='+encodeURIComponent(detail);
    output.innerHTML='<strong>Your order enquiry is ready.</strong><p>Click below to open your email app and send it. No payment has been taken.</p><a class="btn primary" href="'+href+'">Open email to send enquiry →</a>';
  }
  output.hidden=false; output.scrollIntoView({behavior:'smooth',block:'center'});
});

render();
})();
