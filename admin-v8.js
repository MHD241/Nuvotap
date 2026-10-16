/* Dashboard extensions. Auth + admin membership checked by admin.js.
   Database RLS remains the security boundary; browser code is not privileged. */
(()=>{'use strict';
const cfg=window.NUVOTAP_SUPABASE||{};
const root=document.getElementById('nv-admin-v8');if(!root||!cfg.url||!cfg.publishableKey)return;
const $=s=>root.querySelector(s);
const fmt=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(Number(n||0));
const date=s=>s?new Date(s).toLocaleDateString('en-GB'):'—';
function textCell(row,value){const cell=document.createElement('td');cell.textContent=String(value??'—');row.append(cell);return cell}
function table(container,columns,rows){container.replaceChildren();if(!rows.length){container.textContent='No records yet.';return}
 const wrap=document.createElement('div');wrap.className='nv-table-scroll';const t=document.createElement('table');t.className='nv-data-table';const thead=document.createElement('thead'),head=document.createElement('tr');columns.forEach(x=>{const th=document.createElement('th');th.textContent=x[0];head.append(th)});thead.append(head);t.append(thead);const tb=document.createElement('tbody');rows.forEach(item=>{const row=document.createElement('tr');columns.forEach(x=>textCell(row,x[1](item)));tb.append(row)});t.append(tb);wrap.append(t);container.append(wrap)}
async function init(){if(!window.supabase?.createClient)return;
 const db=window.supabase.createClient(cfg.url,cfg.publishableKey);
 const set=(s,v)=>{const e=$(s);if(e)e.textContent=v};
 async function load(){const ss=await db.auth.getSession(),session=ss.data.session;
 if(!session){set('#nv-data-message','Sign in above to see private business records.');return}
 const own=await db.from('nuvotap_admins').select('user_id').eq('user_id',session.user.id).maybeSingle();
 if(!own.data){set('#nv-data-message','This login is not an authorised administrator.');return}
 root.hidden=false;set('#nv-data-message','Loading real records…');
 const [orders,events]=await Promise.all([db.from('nuvotap_orders').select('*').order('created_at',{ascending:false}).limit(200),db.from('nuvotap_events').select('*').order('created_at',{ascending:false}).limit(1000)]);
 if(orders.error){set('#nv-order-error','Orders: '+orders.error.message+' — check the V8 admin RLS migration.')}else{
   set('#nv-order-error','');const o=orders.data||[];
   const exportBtn=$('#nv-export-orders');if(exportBtn){exportBtn.hidden=false;exportBtn.onclick=()=>{
     const headers=['Order ID','Date','Customer','Email','Items (JSON)','Subtotal GBP','Total GBP','Order status','Payment status','Courier','Tracking number','Postal Address (JSON)'];
     const csvCell=x=>'"'+String(x??'').replaceAll('"','""')+'"';
     const rows=o.map(x=>[x.id,x.created_at,x.customer_name,x.customer_email,JSON.stringify(x.items||[]),x.subtotal_gbp,x.total_gbp,x.status,x.payment_status,x.courier,x.tracking_number,JSON.stringify(x.delivery_address||{})]);
     const csv=[headers,...rows].map(a=>a.map(csvCell).join(',')).join('\r\n');
     const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
     const link=document.createElement('a');link.href=url;link.download='nuvotap-orders-export.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
   }}

   set('#nv-orders-total',String(o.length));set('#nv-pending',String(o.filter(x=>x.payment_status!=='paid').length));set('#nv-revenue',fmt(o.filter(x=>x.payment_status==='paid').reduce((a,x)=>a+Number(x.total_gbp||0),0)));
   table($('#nv-orders-list'),[['Order ID',x=>x.id?.slice(0,8)],['Date',x=>date(x.created_at)],['Customer',x=>x.customer_name],['Total',x=>fmt(x.total_gbp)],['Order',x=>x.status],['Payment',x=>x.payment_status],['Delivery',x=>x.tracking_number?'Tracking: '+x.tracking_number:'Not tracked']],o);
 }
 if(events.error){set('#nv-events-error','Analytics: '+events.error.message+' — tracking is not live until the event collector and consent controls are configured.')}else{
   set('#nv-events-error','');const e=events.data||[];set('#nv-visits',String(e.filter(x=>x.event_type==='page_view').length));set('#nv-clicks',String(e.filter(x=>x.event_type==='product_click').length));set('#nv-baskets',String(e.filter(x=>x.event_type==='add_to_basket').length));set('#nv-wishlist',String(e.filter(x=>x.event_type==='wishlist_add').length));
   table($('#nv-events-list'),[['When',x=>date(x.created_at)],['Event',x=>x.event_type],['Page',x=>x.page],['Product',x=>x.product]],e.slice(0,60));
 }
 set('#nv-data-message','Dashboard updated. Counts reflect records in Supabase, not sample data.');
 }
 document.getElementById('admin-login-form')?.addEventListener('submit',()=>setTimeout(load,1300));
 document.getElementById('admin-refresh')?.addEventListener('click',load);
 $('#nv-refresh')?.addEventListener('click',load);
 db.auth.onAuthStateChange((event)=>{if(event==='SIGNED_IN')setTimeout(load,250);if(event==='SIGNED_OUT')root.hidden=true});
 const s=await db.auth.getSession();if(s.data.session)load();
 }
 const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';script.onload=init;document.head.append(script);
})();
