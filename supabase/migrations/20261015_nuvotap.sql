-- NUVOTAP submission inbox. Designed for a DEDICATED Supabase project.
create table if not exists public.nuvotap_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.nuvotap_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending' check(status in ('pending','approved','changes_requested','rejected')),
  customer_email text not null,
  profile_name text not null,
  business_name text,
  contact_phone text,
  description text,
  socials jsonb not null default '[]'::jsonb,
  colours jsonb not null default '{}'::jsonb,
  image_path text,
  admin_notes text,
  submitted_from text not null default 'studio',
  reviewed_at timestamptz
);
create index if not exists nuvotap_submissions_created_idx on public.nuvotap_submissions(created_at desc);
create index if not exists nuvotap_submissions_status_idx on public.nuvotap_submissions(status);
alter table public.nuvotap_admins enable row level security;
alter table public.nuvotap_submissions enable row level security;
-- No anonymous table grants or policies; Edge functions authenticate and use service role.
revoke all on public.nuvotap_admins from anon, authenticated;
revoke all on public.nuvotap_submissions from anon, authenticated;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('nuvotap-profile-uploads','nuvotap-profile-uploads',false,2097152,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=false,file_size_limit=2097152,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
-- No public storage policies. Service role alone uploads and signs viewing URLs.
