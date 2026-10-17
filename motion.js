/* NUVOTAP motion layer v8.7 — purely visual; nothing here touches prices, the basket contents or ordering. */
(function(){
  'use strict';
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce)return;

  // Header tightens after the first bit of scrolling
  var header=document.querySelector('.site-header');
  if(header){
    var ticking=false;
    var update=function(){header.classList.toggle('nt-scrolled',window.scrollY>40);ticking=false};
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
    update();
  }

  // Hero: two NFC ripple rings behind the cards, then cards lean toward the pointer (mouse and trackpad only)
  var stage=document.querySelector('.hero-stage');
  if(stage){for(var i=0;i<2;i++){var ring=document.createElement('i');ring.className='nt-ring';ring.setAttribute('aria-hidden','true');stage.appendChild(ring)}}
  if(stage&&window.matchMedia&&window.matchMedia('(pointer: fine)').matches){
    stage.addEventListener('pointermove',function(e){
      var r=stage.getBoundingClientRect();
      var px=((e.clientX-r.left)/r.width-.5)*2;
      stage.style.setProperty('--px',px.toFixed(3));
      stage.style.setProperty('--hover','1');
    });
    stage.addEventListener('pointerleave',function(){
      stage.style.setProperty('--px','0');
      stage.style.setProperty('--hover','0');
    });
  }

  // "How it works" bars fill in order when the section scrolls into view
  var steps=document.querySelector('.steps');
  if(steps){
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){if(en.isIntersecting){steps.classList.add('nt-in');io.disconnect()}});
      },{threshold:.35});
      io.observe(steps);
    }else{steps.classList.add('nt-in')}
  }

  // Basket count pops when it changes
  var badge=document.querySelector('.icon-btn b');
  if(badge&&'MutationObserver' in window){
    new MutationObserver(function(){
      badge.classList.remove('nt-pop');void badge.offsetWidth;badge.classList.add('nt-pop');
    }).observe(badge,{childList:true,characterData:true,subtree:true});
  }
})();
