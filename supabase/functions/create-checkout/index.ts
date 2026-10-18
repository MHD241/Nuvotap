import {createClient} from "jsr:@supabase/supabase-js@2";
const origins=["https://nuvotap.com","https://www.nuvotap.com","https://mhd241.github.io"];
const names={white:"White Google Review NFC Card",black:"Black Google Review NFC Card",blank:"Blank NFC Card"};
Deno.serve(async(req)=>{
 const origin=req.headers.get("origin")||"";
 const headers={"Content-Type":"application/json","Access-Control-Allow-Origin":origins.includes(origin)?origin:origins[0],"Access-Control-Allow-Headers":"content-type,apikey,authorization","Access-Control-Allow-Methods":"POST,OPTIONS","Vary":"Origin"};
 const respond=(status,obj)=>new Response(JSON.stringify(obj),{status,headers});
 if(req.method==="OPTIONS")return new Response("",{headers});
 if(req.method!=="POST"||!origins.includes(origin))return respond(403,{error:"Forbidden"});
 if(Number(req.headers.get("content-length")||0)>25000)return respond(413,{error:"Request too large"});
 const stripeKey=Deno.env.get("STRIPE_SECRET_KEY");
 if(!stripeKey)return respond(503,{error:"Card payments are not available yet"});
 try{
 const d=await req.json(),s=(v,n)=>typeof v==="string"?v.trim().slice(0,n):"";
 if(s(d.website,200))return respond(400,{error:"Invalid request"});
 const email=s(d.email,180),name=s(d.name,120);
 if(!name||! /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||d.agree!==true)return respond(400,{error:"Valid contact information and agreement are required"});
 const lines=Array.isArray(d.items)?d.items:[];
 if(!lines.length||lines.length>25)return respond(400,{error:"Invalid basket"});
 const prices={white:999,black:999,blank:499};
 let cards=0,reviewCount=0,base=0,urlCards=0,profiles=0;
 const items=[],stripeLines=[];
 for(const x of lines){
 const type=s(x.type,12),qty=Number(x.qty);
 if(!(type in prices)||!Number.isInteger(qty)||qty<1||qty>99)return respond(400,{error:"Invalid item"});
 const mode=s(x.programming,12),lock=s(x.lock,12),destination=s(x.destination,500);
 if(!["none","url","profile"].includes(mode))return respond(400,{error:"Invalid programming"});
 if(mode==="url"){try{if(!["http:","https:"].includes(new URL(destination).protocol))throw Error()}catch{return respond(400,{error:"Valid URL required"})}}
 if(mode==="profile"&&type!=="blank")return respond(400,{error:"Profile not available for this card"});
 const newProfile=type==="blank"&&x.newProfile===true;
 if(mode==="profile"&&!newProfile)return respond(400,{error:"Missing profile"});
 cards+=qty;base+=prices[type]*qty;if(type!=="blank")reviewCount+=qty;
 if(mode==="url")urlCards+=qty;if(newProfile)profiles+=1;
 items.push({type,qty,programming:mode,lock:mode==="none"?"none":lock==="locked"?"locked":"unlocked",destination:mode==="url"?destination:"",newProfile});
 stripeLines.push({name:names[type]+(mode==="none"?"":lock==="locked"?" (programmed, locked)":" (programmed, unlocked)"),amount:prices[type],qty});
 }
 if(cards>10)return respond(400,{error:"Orders of 11 or more cards are quoted separately. Please send an enquiry instead."});
 if(urlCards>0)stripeLines.push({name:"NFC programming with your link",amount:50,qty:urlCards});
 if(profiles>0)stripeLines.push({name:"New digital business profile",amount:500,qty:profiles});
 const program=50*urlCards,profileTotal=500*profiles;
 const discount=reviewCount>=4&&reviewCount<=10?0.2:reviewCount===3?0.15:reviewCount===2?0.1:0;
 const reviewBase=items.reduce((n,x)=>n+(x.type==="blank"?0:prices[x.type]*x.qty),0);
 const volume=Math.round(reviewBase*discount);
 const promo=s(d.coupon,32).toUpperCase()==="WELCOME10"?Math.round((base-volume)*0.1):0;
 const goods=base-volume-promo+program+profileTotal;
 const delivery=goods>=3000?0:299;
 const total=goods+delivery;
 const address=d.address||{};
 const street=s(address.street,180),town=s(address.town,120),postcode=s(address.postcode,20);
 if(!street||!town||!postcode)return respond(400,{error:"Delivery address required"});
 const db=createClient(Deno.env.get("SUPABASE_URL"),Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),{auth:{persistSession:false}});
 const ins=await db.from("nuvotap_orders").insert({customer_name:name,customer_email:email,business_name:s(d.business,120),phone:s(d.phone,60),delivery_address:{street,address2:s(address.address2,120),town,region:s(address.region,120),postcode,country:"United Kingdom"},items,subtotal_gbp:goods/100,delivery_gbp:delivery/100,total_gbp:total/100,notes:s(d.notes,800),status:"enquiry",payment_status:"pending"}).select("id").single();
 if(ins.error)return respond(500,{error:"Could not save order"});
 const orderId=ins.data.id;
 const fr=d.lang==="fr",base_url=origin,prefix=fr?"/fr":"";
 const call=async(path,params)=>{const r=await fetch("https://api.stripe.com/v1/"+path,{method:"POST",headers:{"Authorization":"Bearer "+stripeKey,"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(params)});const j=await r.json();if(!r.ok)throw new Error(j?.error?.message||"Stripe error");return j};
 try{
 const p={mode:"payment",locale:fr?"fr":"en-GB",customer_email:email,client_reference_id:orderId,"metadata[order_id]":orderId,"payment_intent_data[metadata][order_id]":orderId,"payment_intent_data[shipping][name]":name,"payment_intent_data[shipping][address][line1]":street,"payment_intent_data[shipping][address][city]":town,"payment_intent_data[shipping][address][postal_code]":postcode,"payment_intent_data[shipping][address][country]":"GB",success_url:base_url+prefix+"/order-success.html?order="+orderId,cancel_url:base_url+prefix+"/checkout.html","shipping_options[0][shipping_rate_data][type]":"fixed_amount","shipping_options[0][shipping_rate_data][fixed_amount][amount]":String(delivery),"shipping_options[0][shipping_rate_data][fixed_amount][currency]":"gbp","shipping_options[0][shipping_rate_data][display_name]":delivery===0?"Free UK delivery (orders over £30)":"UK delivery"};
 const region=s(address.region,120),addr2=s(address.address2,120);
 if(region)p["payment_intent_data[shipping][address][state]"]=region;
 if(addr2)p["payment_intent_data[shipping][address][line2]"]=addr2;
 if(s(d.phone,60))p["payment_intent_data[shipping][phone]"]=s(d.phone,60);
 stripeLines.forEach((l,i)=>{p[`line_items[${i}][quantity]`]=String(l.qty);p[`line_items[${i}][price_data][currency]`]="gbp";p[`line_items[${i}][price_data][unit_amount]`]=String(l.amount);p[`line_items[${i}][price_data][product_data][name]`]=l.name});
 const off=volume+promo;
 if(off>0){const c=await call("coupons",{amount_off:String(off),currency:"gbp",duration:"once",name:volume&&promo?"Multi-buy saving and discount code":promo?"Discount code":"Multi-buy saving"});p["discounts[0][coupon]"]=c.id}
 const session=await call("checkout/sessions",p);
 await db.from("nuvotap_orders").update({payment_reference:session.id}).eq("id",orderId);
 return respond(201,{ok:true,orderId,url:session.url});
 }catch(e){
 await db.from("nuvotap_orders").update({admin_notes:"Stripe checkout could not be created: "+String(e.message).slice(0,200)}).eq("id",orderId);
 return respond(502,{error:"Could not start card payment. Please try again or send an enquiry instead."});
 }
 }catch{return respond(400,{error:"Invalid order request"})}
});
