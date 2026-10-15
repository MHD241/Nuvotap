import { createClient } from 'jsr:@supabase/supabase-js@2';
const origins = ['https://nuvotap.com','https://www.nuvotap.com','https://mhd241.github.io'];
const headers=(origin:string)=>({'Access-Control-Allow-Origin':origins.includes(origin)?origin:origins[0], 'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin','Content-Type':'application/json'});
const reply=(s:number,o:unknown,h:Record<string,string>)=>new Response(JSON.stringify(o),{status:s,headers:h});
Deno.serve(async(req)=>{
 const origin=req.headers.get('origin')||'';const h=headers(origin);
 if(req.method==='OPTIONS')return new Response('',{headers:h});
 if(req.method!=='POST')return reply(405,{error:'Method not allowed'},h);
 if(!origins.includes(origin))return reply(403,{error:'Origin is not allowed'},h);
 if(Number(req.headers.get('content-length')||0)>3500000)return reply(413,{error:'Submission is too large'},h);
 try{
   const d=await req.json();
   const str=(v:unknown,max:number)=>typeof v==='string'?v.trim().slice(0,max):'';
   const email=str(d.email,200),name=str(d.name,140),description=str(d.desc,1200);
   if(!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return reply(400,{error:'A name and valid email are required'},h);
   if(!d.privacyAccepted)return reply(400,{error:'Accept the privacy notice first'},h);
   const socials=(Array.isArray(d.socials)?d.socials:[]).slice(0,12).map((x:unknown)=>{const s=x as Record<string,unknown>;return {platform:str(s?.platform,40),url:str(s?.url,500)}}).filter((x:{platform:string,url:string})=>{try{const u=new URL(x.url);return ['https:','http:'].includes(u.protocol)}catch{return false}});
   if(!socials.length)return reply(400,{error:'At least one valid social or website URL is required'},h);
   const colour=(x:unknown,fallback:string)=>typeof x==='string'&&/^#[0-9a-fA-F]{6}$/.test(x)?x:fallback;
   const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false}});
   const id=crypto.randomUUID();let path:string|null=null;
   if(d.photoData){
     const match=/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(String(d.photoData));
     if(!match || match[2].length>2800000)return reply(400,{error:'Use a JPG, PNG or WebP image under 2 MB'},h);
     const bytes=Uint8Array.from(atob(match[2]),x=>x.charCodeAt(0));
     if(bytes.byteLength>2097152)return reply(413,{error:'Photo exceeds 2 MB'},h);
     const ext=match[1]==='image/png'?'png':match[1]==='image/webp'?'webp':'jpg';path=`${id}/photo.${ext}`;
     const up=await db.storage.from('nuvotap-profile-uploads').upload(path,bytes,{contentType:match[1],upsert:false});
     if(up.error)return reply(500,{error:'Could not save photo'},h);
   }
   const payload={id,customer_email:email,profile_name:name,business_name:str(d.business,140),description,contact_phone:str(d.phone,80),socials,colours:{main:colour(d.main,'#08152f'),secondary:colour(d.secondary,'#19365b'),accent:colour(d.accent,'#31dfff')},image_path:path};
   const ins=await db.from('nuvotap_submissions').insert(payload);
   if(ins.error){if(path)await db.storage.from('nuvotap-profile-uploads').remove([path]);return reply(500,{error:'Could not save your request'},h)}
   return reply(201,{ok:true,reference:id},h);
 }catch{return reply(400,{error:'Invalid submission'},h)}
});
