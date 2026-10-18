import {createClient} from "jsr:@supabase/supabase-js@2";
const enc=new TextEncoder();
const hex=(b)=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("");
async function verify(raw,header,secret){
 const parts=Object.fromEntries((header||"").split(",").map(p=>{const i=p.indexOf("=");return [p.slice(0,i),p.slice(i+1)]}));
 const t=parts.t,sigs=(header||"").split(",").filter(p=>p.startsWith("v1=")).map(p=>p.slice(3));
 if(!t||!sigs.length)return false;
 if(Math.abs(Date.now()/1000-Number(t))>300)return false;
 const key=await crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const mac=hex(await crypto.subtle.sign("HMAC",key,enc.encode(t+"."+raw)));
 return sigs.some(s=>s.length===mac.length&&s===mac);
}
Deno.serve(async(req)=>{
 if(req.method!=="POST")return new Response("Method not allowed",{status:405});
 const secret=Deno.env.get("STRIPE_WEBHOOK_SECRET");
 if(!secret)return new Response("Webhook not configured",{status:503});
 const raw=await req.text();
 if(!(await verify(raw,req.headers.get("stripe-signature"),secret)))return new Response("Invalid signature",{status:400});
 let event;try{event=JSON.parse(raw)}catch{return new Response("Bad request",{status:400})}
 const db=createClient(Deno.env.get("SUPABASE_URL"),Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),{auth:{persistSession:false}});
 const obj=event?.data?.object||{};
 const orderId=obj?.metadata?.order_id||obj?.client_reference_id;
 if(!orderId||!/^[0-9a-f-]{36}$/i.test(orderId))return new Response("ok",{status:200});
 if(event.type==="checkout.session.completed"||event.type==="checkout.session.async_payment_succeeded"){
  if(obj.payment_status!=="paid")return new Response("ok",{status:200});
  const o=await db.from("nuvotap_orders").select("total_gbp,payment_status").eq("id",orderId).single();
  if(o.error)return new Response("order not found",{status:200});
  if(o.data.payment_status==="paid")return new Response("ok",{status:200});
  const expected=Math.round(Number(o.data.total_gbp)*100);
  if(obj.amount_total!==expected){
   await db.from("nuvotap_orders").update({admin_notes:"AMOUNT MISMATCH: Stripe charged "+obj.amount_total+"p, order total "+expected+"p. Check before dispatch."}).eq("id",orderId);
   return new Response("ok",{status:200});
  }
  await db.from("nuvotap_orders").update({payment_status:"paid",paid_at:new Date().toISOString(),status:"confirmed",payment_reference:obj.payment_intent||obj.id,updated_at:new Date().toISOString()}).eq("id",orderId);
 }else if(event.type==="checkout.session.async_payment_failed"||event.type==="checkout.session.expired"){
  await db.from("nuvotap_orders").update({payment_status:"unpaid",updated_at:new Date().toISOString()}).eq("id",orderId).neq("payment_status","paid");
 }
 return new Response("ok",{status:200});
});
