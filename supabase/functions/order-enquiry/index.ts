import {createClient} from "jsr:@supabase/supabase-js@2";
const origins=["https://nuvotap.com","https://www.nuvotap.com","https://mhd241.github.io"];
Deno.serve(async(req)=>{
 const origin=req.headers.get("origin")||"";
 const headers={"Content-Type":"application/json","Access-Control-Allow-Origin":origins.includes(origin)?origin:origins[0],"Access-Control-Allow-Headers":"content-type,apikey,authorization","Access-Control-Allow-Methods":"POST,OPTIONS","Vary":"Origin"};
 const respond=(status,obj)=>new Response(JSON.stringify(obj),{status,headers});
 if(req.method==="OPTIONS")return new Response("",{headers});
 if(req.method!=="POST"||!origins.includes(origin))return respond(403,{error:"Forbidden"});
 if(Number(req.headers.get("content-length")||0)>25000)return respond(413,{error:"Request too large"});
 try{
 const d=await req.json(),s=(v,n)=>typeof v==="string"?v.trim().slice(0,n):"";
 if(s(d.website,200))return respond(400,{error:"Invalid request"});
 const email=s(d.email,180),name=s(d.name,120);
 if(!name||! /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)||d.agree!==true)return respond(400,{error:"Valid contact information and agreement are required"});
 const lines=Array.isArray(d.items)?d.items:[];
 if(!lines.length||lines.length>25)return respond(400,{error:"Invalid basket"});
 const prices={white:999,black:999,blank:499};
 let cards=0,reviewCount=0,base=0,program=0,profiles=0;
 const items=[];
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
 if(mode==="url")program+=50*qty;if(newProfile)profiles+=500;
 items.push({type,qty,programming:mode,lock:mode==="none"?"none":lock==="locked"?"locked":"unlocked",destination:mode==="url"?destination:"",newProfile});
 }
 if(cards>99)return respond(400,{error:"Contact us for a bulk quotation"});
 const discount=reviewCount>=4&&reviewCount<=10?0.2:reviewCount===3?0.15:reviewCount===2?0.1:0;
 const reviewBase=items.reduce((n,x)=>n+(x.type==="blank"?0:prices[x.type]*x.qty),0);
 const volume=Math.round(reviewBase*discount);
 const promo=s(d.coupon,32).toUpperCase()==="WELCOME10"?Math.round((base-volume)*0.1):0;
 const total=base-volume-promo+program+profiles;
 const address=d.address||{};
 if(!s(address.street,180)||!s(address.town,120)||!s(address.postcode,20))return respond(400,{error:"Delivery address required"});
 const db=createClient(Deno.env.get("SUPABASE_URL"),Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),{auth:{persistSession:false}});
 const result=await db.from("nuvotap_orders").insert({customer_name:name,customer_email:email,business_name:s(d.business,120),phone:s(d.phone,60),delivery_address:{street:s(address.street,180),address2:s(address.address2,120),town:s(address.town,120),region:s(address.region,120),postcode:s(address.postcode,20),country:"United Kingdom"},items,subtotal_gbp:total/100,total_gbp:total/100,notes:s(d.notes,800),status:"enquiry",payment_status:"unpaid"}).select("id").single();
 if(result.error)return respond(500,{error:"Could not save order enquiry"});
 return respond(201,{ok:true,orderId:result.data.id,paymentStatus:"unpaid",message:"Enquiry recorded; no payment collected"});
 }catch{return respond(400,{error:"Invalid order request"})}
});
