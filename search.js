/* Header search: searchable products and key pages, no third-party tracking. */
(()=>{'use strict';const form=document.getElementById('site-search');if(!form)return;
const input=document.getElementById('site-search-input'),results=document.getElementById('site-search-results');
const items=[
 {name:'White Google Review Card',desc:'White NFC Google review card · £19.99',url:'white-review.html',terms:'white google review card nfc ratings reviews'},
 {name:'Black Google Review Card',desc:'Black NFC Google review card · £19.99',url:'black-review.html',terms:'black google review card nfc ratings reviews'},
 {name:'Blank NFC Card',desc:'Unprogrammed NFC card · £7',url:'blank-nfc.html',terms:'blank white nfc card programmable empty'},
 {name:'Digital Business Profile',desc:'Create a profile for +£5',url:'studio.html',terms:'business digital studio profile contact social custom'},
 {name:'Order Enquiry',desc:'Review your basket and delivery details',url:'checkout.html',terms:'checkout order basket delivery'},
 {name:'Returns & Refunds',desc:'Our return policy',url:'returns.html',terms:'refund return policy postage'},
 {name:'Help & FAQs',desc:'Answers about NFC cards',url:'index.html#faq',terms:'help questions faq support'}
];
function match(){const q=input.value.trim().toLowerCase().replace(/\s+/g,' ');if(!q){results.hidden=true;results.replaceChildren();input.setAttribute('aria-expanded','false');return []}const words=q.split(' ');const found=items.filter(x=>words.every(w=>(x.name+' '+x.desc+' '+x.terms+' '+(window.NUVOTAP_T?window.NUVOTAP_T(x.name)+' '+window.NUVOTAP_T(x.desc):'')).toLowerCase().includes(w))).slice(0,6);results.replaceChildren();if(!found.length){const p=document.createElement('p');p.textContent='No matches. Try “NFC”, “review” or “profile”.';results.append(p)}else for(const x of found){const a=document.createElement('a');a.href=x.url;const strong=document.createElement('strong');strong.textContent=x.name;const small=document.createElement('small');small.textContent=x.desc;a.append(strong,small);results.append(a)}results.hidden=false;input.setAttribute('aria-expanded','true');return found}
input.addEventListener('input',match);input.addEventListener('focus',()=>{if(input.value.trim())match()});form.addEventListener('submit',e=>{e.preventDefault();const found=match();if(found.length)location.href=found[0].url});document.addEventListener('click',e=>{if(!form.contains(e.target)){results.hidden=true;input.setAttribute('aria-expanded','false')}});input.addEventListener('keydown',e=>{if(e.key==='Escape'){results.hidden=true;input.setAttribute('aria-expanded','false');input.blur()}});
})();