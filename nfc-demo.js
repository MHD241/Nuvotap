/* Drag to turn the 3D scene, and a pause button for the tap animation. Visual only. */
(function(){
  'use strict';
  var box=document.querySelector('.nfc-stagebox'),world=document.querySelector('.nfc-world');
  if(box&&world){
    var rx=56,rz=-30,drag=false,sx=0,sy=0,bx=0,bz=0;
    var apply=function(){world.style.setProperty('--rx',rx+'deg');world.style.setProperty('--rz',rz+'deg')};
    box.addEventListener('pointerdown',function(e){drag=true;sx=e.clientX;sy=e.clientY;bx=rx;bz=rz;world.style.transition='none';try{box.setPointerCapture(e.pointerId)}catch(_){}});
    box.addEventListener('pointermove',function(e){if(!drag)return;rz=bz+(e.clientX-sx)*.4;rx=Math.max(20,Math.min(75,bx-(e.clientY-sy)*.3));apply()});
    var end=function(){drag=false;world.style.transition=''};
    box.addEventListener('pointerup',end);box.addEventListener('pointercancel',end);
    var reset=document.getElementById('nfc-reset');
    if(reset)reset.addEventListener('click',function(){rx=56;rz=-30;apply()});
  }
  var btn=document.getElementById('nfc-pause'),scene=document.querySelector('.nfc-scene');
  if(btn&&scene){
    btn.addEventListener('click',function(){
      var p=scene.classList.toggle('nfc-paused');
      btn.textContent=p?'Play animation':'Pause animation';
      btn.setAttribute('aria-pressed',p?'true':'false');
    });
  }
})();
