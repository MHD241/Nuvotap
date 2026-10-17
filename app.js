/* NUVOTAP V6: progressive enhancement only. All site content remains visible without JS. */
(function () {
  'use strict';
  var prices = {white:12.99, black:12.99, blank:6.99};
  var products = {white:'White Google Review Card',black:'Black Google Review Card',blank:'Blank NFC Card'};
  var images = {white:'assets/product-1.webp',black:'assets/product-black.webp',blank:'assets/blank-stack.png'};
  var STORAGE = 'nuvotap-v7-basket', PROMO='nuvotap-v7-code', THEME='nuvotap-theme';
  var cart = [], code = '', theme='dark';
  var $ = function(selector,root){return (root||document).querySelector(selector)};
  var $$ = function(selector,root){return Array.prototype.slice.call((root||document).querySelectorAll(selector))};
  function money(x){return '£'+Number(x).toFixed(2)}
  function clean(s){return String(s==null?'':s).replace(/[&<>"']/g,function(k){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[k]})}
  function quantity(x){return Math.max(1,Math.min(99,Math.floor(Number(x)||1)))}
  function numberOfCards(lines){return lines.reduce(function(s,x){return s+x.qty},0)}
  function rate(q){if(q>=4&&q<=10)return .20;if(q===3)return .15;if(q===2)return .10;return 0}
  function promoActive(){return code.toUpperCase()==='WELCOME10'}
  function totals(lines){
    var known=0,reviewCount=0,programming=0,profiles=0;
    lines.forEach(function(x){known+=prices[x.type]*x.qty;if(x.type==='white'||x.type==='black')reviewCount+=x.qty;if(x.programming==='url')programming+=x.qty*.5;if(x.newProfile&&x.type==='blank')profiles+=5});
    var reviewSubtotal=lines.reduce(function(s,x){return s+((x.type==='white'||x.type==='black')?prices[x.type]*x.qty:0)},0);var reduction=Math.round(reviewSubtotal*rate(reviewCount)*100)/100;
    var coupon=promoActive()?Math.round((known-reduction)*.10*100)/100:0;
    return {base:known,quantityOff:reduction,coupon:coupon,programming:programming,profiles:profiles,total:Math.round((known-reduction-coupon+programming+profiles)*100)/100,quote:numberOfCards(lines)>10};
  }
  function store(){try{localStorage.setItem(STORAGE,JSON.stringify(cart));localStorage.setItem(PROMO,code);localStorage.setItem(THEME,theme)}catch(e){}}
  try {
    var raw=JSON.parse(localStorage.getItem(STORAGE)||'[]');
    if(Array.isArray(raw)){cart=raw.filter(function(x){return !!products[x.type]&&Number.isInteger(x.qty)&&x.qty>0&&x.qty<=99&&['none','url','profile'].indexOf(x.programming)!==-1}).slice(0,40)}
    code=localStorage.getItem(PROMO)||'';
    // Start in dark mode on every load; only an explicit button click can change theme.
    // This avoids saved/stale Safari theme state altering the entire page at startup.
  }catch(e){cart=[]}
  function setTheme(){document.documentElement.setAttribute('data-theme',theme==='light'?'light':'dark');if($('#theme-btn'))$('#theme-btn').firstChild.nodeValue=theme==='light'?'☾ ':'☀ '}
  // Do not modify document classes or theme on page load.
  $('#theme-btn')&&$('#theme-btn').addEventListener('click',function(){theme=theme==='light'?'dark':'light';store();setTheme()});
  $('#menu-btn')&&$('#menu-btn').addEventListener('click',function(){var nav=$('#nav');if(!nav)return;var opened=nav.classList.toggle('open');this.setAttribute('aria-expanded',opened?'true':'false')});
  function updateCount(){if($('#cart-count'))$('#cart-count').textContent=String(numberOfCards(cart))}
  var dialog=$('#cart-dialog');
  function openCart(){renderCart();if(dialog){if(typeof dialog.showModal==='function'){try{dialog.showModal()}catch(e){dialog.setAttribute('open','')}}else{dialog.setAttribute('open','')}}}
  $('#cart-open')&&$('#cart-open').addEventListener('click',openCart);
  $('#cart-close')&&$('#cart-close').addEventListener('click',function(){if(dialog){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open')}});
  if(dialog)dialog.addEventListener('click',function(e){if(e.target===dialog&&typeof dialog.close==='function')dialog.close()});
  function summaryRows(t){return '<div class="sum-row"><span>Card subtotal</span><b>'+money(t.base)+'</b></div>'+
    '<div class="sum-row"><span>Quantity saving</span><b>−'+money(t.quantityOff)+'</b></div>'+
    '<div class="sum-row"><span>Discount code saving</span><b>−'+money(t.coupon)+'</b></div>'+
    '<div class="sum-row"><span>Programming</span><b>'+money(t.programming)+'</b></div>'+
    '<div class="sum-row"><span>Profile creation</span><b>'+money(t.profiles)+'</b></div>'+
    '<div class="sum-row total"><span>'+(t.quote?'Known charges (partial)':'Product subtotal')+'</span><b>'+money(t.total)+(t.quote?' + quote':'')+'</b></div>';
  }
  if(location.pathname.includes('/fr/'))Object.keys(images).forEach(function(k){if(images[k].indexOf('assets/')===0)images[k]='../'+images[k]});
  function renderCart(){
    var out=$('#cart-items');if(!out)return;
    if(!cart.length){out.innerHTML='<h3>Your basket is empty.</h3><p class="muted">Choose one of our NFC cards.</p><a class="btn primary" href="index.html#collection">Explore products ↗</a>';return}
    out.innerHTML=cart.map(function(x,i){return '<div class="basket-item"><img src="'+images[x.type]+'" alt=""><div><strong>'+products[x.type]+'</strong><p>'+x.qty+' card(s) · '+(x.programming==='none'?'Unprogrammed':x.lock==='locked'?'Programmed · locked':'Programmed · unlocked')+(x.newProfile?' · Digital profile':'')+'</p><div class="basket-buttons"><button type="button" data-action="minus" data-index="'+i+'">−</button><span>'+x.qty+'</span><button type="button" data-action="plus" data-index="'+i+'">+</button><button type="button" class="remove" data-action="remove" data-index="'+i+'">Remove</button></div></div></div>'}).join('')+'<div class="basket-summary">'+summaryRows(totals(cart))+'<p class="notice-inline">Final delivery charges and any quote are confirmed separately.</p><a class="btn primary wide" href="checkout.html">Continue to enquiry →</a></div>';
    $$('[data-action]',out).forEach(function(b){b.addEventListener('click',function(){var i=Number(b.getAttribute('data-index')),action=b.getAttribute('data-action');if(!cart[i])return;if(action==='remove')cart.splice(i,1);if(action==='minus'){cart[i].qty--;if(cart[i].qty===0)cart.splice(i,1)}if(action==='plus'&&numberOfCards(cart)<99)cart[i].qty++;store();refresh()})});
  }
  function refresh(){updateCount();renderCart();renderCheckout()}
  var productSection=$('[data-product]'), form=$('#product-form');
  if(form && productSection){
    var type=productSection.getAttribute('data-product');
    var q=$('#quantity'),p=$('#programming'),dest=$('#destination'),urlBox=$('#destination-box'),lockBox=$('#lock-box'),np=$('#new-profile'),profileBox=$('#profile-fields');
    function updateProduct(){
      var mode=p.value, profileOn=!!(np&&np.checked);
      urlBox.hidden=mode!=='url';lockBox.hidden=mode==='none';if(profileBox)profileBox.hidden=!profileOn;
      dest.required=mode==='url';
      
      var count=quantity(q.value);
      var sample={type:type,qty:count,programming:mode,newProfile:profileOn};
      var calc=totals([sample]);
      $('#product-estimate').innerHTML= '<span class="small muted">Estimated product total</span><strong>'+money(calc.total)+(calc.quote?' + bulk quote':'')+'</strong><small>Before delivery charges. Volume discounts apply to Google review cards only.</small>';
    }
    $('#minus').addEventListener('click',function(){q.value=Math.max(1,quantity(q.value)-1);updateProduct()});
    $('#plus').addEventListener('click',function(){q.value=Math.min(99,quantity(q.value)+1);updateProduct()});
    p.addEventListener('change',function(){if(np&&p.value==='profile')np.checked=true;updateProduct()});
    if(np)np.addEventListener('change',function(){if(!np.checked&&p.value==='profile')p.value='none';updateProduct()});
    q.addEventListener('input',updateProduct);
    form.addEventListener('submit',function(e){
      e.preventDefault();updateProduct();if(!form.reportValidity())return;
      var qty=quantity(q.value),mode=p.value,profileOn=!!(np&&np.checked);
      if(mode==='profile'&&!profileOn){alert('To programme a new profile, choose profile creation.');return}
      if(profileOn&&!localStorage.getItem('nuvotap-v7-design')){alert('Please design your business profile in NUVOTAP Studio first.');location.href='studio.html';return}
      if(numberOfCards(cart)+qty>99){alert('Please email hello@nuvotap.com for large orders.');return}
      var design=null;try{if(profileOn)design=JSON.parse(localStorage.getItem('nuvotap-v7-design')||'null')}catch(err){}
      var details={type:type,qty:qty,programming:mode,lock:mode==='none'?'none':$('#lock').value,destination:mode==='url'?dest.value.trim():'',newProfile:profileOn,profile:design};
      cart.push(details);store();refresh();openCart();
    });
    updateProduct();
  }
  function renderCheckout(){
    var items=$('#checkout-items'),pricesBox=$('#checkout-prices');if(!items||!pricesBox)return;
    if(!cart.length){items.innerHTML='<p>Your basket is empty. <a href="index.html#collection">Choose a product ↗</a></p>';pricesBox.textContent=''}
    else {items.innerHTML=cart.map(function(x){return '<div class="summary-item"><img src="'+images[x.type]+'" alt=""><div><strong>'+products[x.type]+'</strong><p>'+x.qty+' × '+(x.programming==='none'?'No programming':x.lock==='locked'?'Programmed (locked)':'Programmed (unlocked)')+(x.newProfile?' · New profile':'')+'</p></div></div>'}).join('');pricesBox.innerHTML=summaryRows(totals(cart))}
    if($('#prepare-order'))$('#prepare-order').disabled=!cart.length;
    if($('#coupon-message'))$('#coupon-message').textContent=promoActive()?'Code applied.':code?'Code not recognised.':'';
    if($('#coupon'))$('#coupon').value=code;
  }
  $('#coupon-apply')&&$('#coupon-apply').addEventListener('click',function(){code=($('#coupon').value||'').trim().toUpperCase();store();renderCheckout()});
  $('#coupon')&&$('#coupon').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();$('#coupon-apply').click()}});
  var check=$('#checkout-form');
  if(check)check.addEventListener('submit',async function(e){
    e.preventDefault();if(!cart.length||!check.reportValidity())return;
    var d=Object.fromEntries(new FormData(check).entries()),t=totals(cart),output=$('#order-output');
    var config=window.NUVOTAP_SUPABASE||{};
    if(!config.url||!config.publishableKey){output.hidden=false;output.textContent='Order service is unavailable. Please email hello@nuvotap.com instead.';return}
    var button=$('#prepare-order');button.disabled=true;output.hidden=false;output.textContent='Sending your order enquiry securely…';
    try{
      var payload={name:d.name,email:d.email,business:d.business||'',phone:d.phone||'',notes:d.notes||'',agree:d.termsAgreement==='on',coupon:code,
        address:{street:d.street,address2:d.address2||'',town:d.town,region:d.region||'',postcode:d.postcode},
        website:'',items:cart.map(function(x){return {type:x.type,qty:x.qty,programming:x.programming,lock:x.lock,destination:x.destination||'',newProfile:!!x.newProfile}})};
      var response=await fetch(config.url+'/functions/v1/order-enquiry',{method:'POST',headers:{'Content-Type':'application/json','apikey':config.publishableKey},body:JSON.stringify(payload)});
      var result=await response.json();if(!response.ok||!result.ok)throw Error(result.error||'Order enquiry was not saved');
      output.replaceChildren();var h=document.createElement('h3');h.textContent='Enquiry received';var msg=document.createElement('p');msg.textContent='Reference: '+result.orderId+'. No payment has been taken. We will contact you to confirm delivery and payment.';output.append(h,msg);
      cart=[];store();renderCheckout();updateCount();
    }catch(err){output.replaceChildren();var error=document.createElement('p');error.textContent='Could not send this enquiry: '+err.message+'. Your basket is preserved. Please try again or contact hello@nuvotap.com.';output.append(error)}
    finally{button.disabled=false;output.scrollIntoView({behavior:'smooth',block:'center'})}
  });
  // Initialise only on pages that need dynamic order totals. The static homepage
  // is never rewritten by JavaScript, so it remains readable if a script fails.
  try { updateCount(); if ($('#checkout-items')) renderCheckout(); } catch (error) {
    console.error('NUVOTAP optional basket initialisation failed:', error);
  }
})();
