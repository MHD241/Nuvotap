import { createClient } from 'jsr:@supabase/supabase-js@2';
const origins=['https://nuvotap.com','https://www.nuvotap.com','https://mhd241.github.io'];
const head=(o:string)=>({'Access-Control-Allow-Origin':origins.includes(o)?o:origins[0],'Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Vary':'Origin','Content-Type':'application/json'});
Deno.serve(async(req)=>{
 const origin=req.headers.get('origin')||'',h=head(origin),send=(status:number,data:unknown)=>new Response(JSON.stringify(data),{status,headers:h});
 if(req.method==='OPTIONS')return new Response('',{headers:h});
 if(req.method!=='POST'||!origins.includes(origin))return send(403,{error:'Forbidden'});
 const token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
 if(!token)return send(401,{error:'Sign in first'});
 const url=Deno.env.get('SUPABASE_URL')!,key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const admin=createClient(url,key,{auth:{persistSession:false}});
 const {data:{user},error:authError}=await admin.auth.getUser(token);
 if(authError||!user)return send(401,{error:'Session expired'});
 const {data:membership}=await admin.from('nuvotap_admins').select('user_id').eq('user_id',user.id).maybeSingle();
 if(!membership)return send(403,{error:'This account is not authorised to manage NUVOTAP'});
 let data;try{data=await req.json()}catch{return send(400,{error:'Invalid request'})}
 if(data.action==='list'){
   const {data:rows,error}=await admin.from('nuvotap_submissions').select('id,created_at,status,customer_email,profile_name,business_name,contact_phone,description,socials,colours,image_path,admin_notes').order('created_at',{ascending:false}).limit(100);
   return error?send(500,{error:'Could not fetch submissions'}):send(200,{items:rows});
 }
 if(data.action==='image'&&typeof data.id==='string'){
   const {data:record}=await admin.from('nuvotap_submissions').select('image_path').eq('id',data.id).maybeSingle();
   if(!record?.image_path)return send(404,{error:'No image attached'});
   const {data:link,error}=await admin.storage.from('nuvotap-profile-uploads').createSignedUrl(record.image_path,120);
   return error?send(500,{error:'Image not available'}):send(200,{url:link.signedUrl});
 }
 if(data.action==='status'&&typeof data.id==='string'&&['pending','approved','changes_requested','rejected'].includes(data.status)){
   const {error}=await admin.from('nuvotap_submissions').update({status:data.status,updated_at:new Date().toISOString(),reviewed_at:new Date().toISOString(),admin_notes:String(data.notes||'').slice(0,1000)}).eq('id',data.id);
   return error?send(500,{error:'Could not save status'}):send(200,{ok:true});
 }
 return send(400,{error:'Unknown action'});
});
