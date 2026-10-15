/* Optional secure submission: never interrupts the offline Studio. */
(()=>{'use strict';
 const config=window.NUVOTAP_SUPABASE||{};
 const submit=document.getElementById('st-submit-secure');if(!submit)return;
 const status=document.getElementById('st-supabase-status');
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url||'')||!config.publishableKey)return;
 submit.disabled=false;status.textContent='Secure profile submissions are available. No payment is collected here.';
 submit.addEventListener('click',async()=>{
   const v=id=>document.getElementById(id)?.value.trim()||'';
   const fields={name:v('st-name'),business:v('st-business'),desc:v('st-desc'),email:v('st-email'),phone:v('st-phone'),main:v('st-main'),secondary:v('st-secondary'),accent:v('st-accent')};
   if(!fields.name||!fields.email||!document.getElementById('st-email').checkValidity()){status.textContent='Please enter your name and a valid email address.';return}
   if(!document.getElementById('st-privacy-accept').checked){status.textContent='Please read and accept the privacy notice first.';return}
   const selectors=[...document.querySelectorAll('#st-links .st-link-editor')];
   fields.socials=selectors.map(x=>({platform:x.querySelector('select')?.value||'',url:x.querySelector('input')?.value.trim()||''})).filter(x=>x.url);
   if(!fields.socials.some(x=>/^https?:\/\//i.test(x.url))){status.textContent='Add at least one social or website link starting with https://';return}
   const img=document.getElementById('st-avatar-image');
   fields.photoData=img&&!img.hidden&&img.src.startsWith('data:image/')?img.src:null;
   fields.privacyAccepted=true;
   submit.disabled=true;status.textContent='Submitting securely…';
   try{
     const r=await fetch(config.url+'/functions/v1/profile-submit',{method:'POST',headers:{'Content-Type':'application/json','apikey':config.publishableKey},body:JSON.stringify(fields)});
     const d=await r.json();if(!r.ok)throw Error(d.error||'Submission failed');
     status.textContent='Design received! Reference: '+d.reference+'. We will review it and contact you by email. No order or payment has been placed.';
   }catch(e){status.textContent='Could not submit: '+e.message+'. Your design is still on this page. Please try again or use the email enquiry option.'}
   finally{submit.disabled=false}
 });
})();
