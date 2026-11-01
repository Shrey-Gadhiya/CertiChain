-- =========================================================
-- CertiChain: Fix Policies & Enable Full Application Access
-- Copy and run this in your Supabase SQL Editor
-- =========================================================

-- 1. DROP RESTRICTIVE POLICIES
drop policy if exists "Admins can insert certificates" on public.certificates;
drop policy if exists "Admins can update certificates" on public.certificates;
drop policy if exists "Admins can insert blockchain records" on public.blockchain_records;
drop policy if exists "Allow insert certificates" on public.certificates;
drop policy if exists "Allow update certificates" on public.certificates;
drop policy if exists "Allow insert blockchain records" on public.blockchain_records;

-- 2. CREATE PERMISSIVE APP POLICIES FOR CERTIFICATES
create policy "Allow public read certificates"
    on public.certificates for select
    using (true);

create policy "Allow insert certificates"
    on public.certificates for insert
    with check (true);

create policy "Allow update certificates"
    on public.certificates for update
    using (true);

-- 3. CREATE APP POLICIES FOR BLOCKCHAIN RECORDS
create policy "Allow public read blockchain records"
    on public.blockchain_records for select
    using (true);

create policy "Allow insert blockchain records"
    on public.blockchain_records for insert
    with check (true);

-- 4. CREATE APP POLICIES FOR VERIFICATION LOGS
create policy "Allow public read verification logs"
    on public.verification_logs for select
    using (true);

create policy "Allow insert verification logs"
    on public.verification_logs for insert
    with check (true);

-- 5. STORAGE BUCKET POLICIES (for certificate file uploads)
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true)
on conflict (id) do nothing;

drop policy if exists "Public Access to Certificate Files" on storage.objects;
drop policy if exists "Allow Upload to Certificate Files" on storage.objects;
drop policy if exists "Authenticated Users Can Upload Certificate Files" on storage.objects;

create policy "Public Access to Certificate Files"
    on storage.objects for select
    using (bucket_id = 'certificates');

create policy "Allow Upload to Certificate Files"
    on storage.objects for insert
    with check (bucket_id = 'certificates');

-- 6. SYNC SEED CERTIFICATES HASHES WITH SYSTEM SHA-256 ALGORITHM
update public.certificates
set certificate_hash = 'c5ba5f185f425009054467736c8930cd80d5e7dc4522c4fb1266be2cba3cf5f0'
where certificate_number = 'CERT-2026-001';

update public.certificates
set certificate_hash = 'da8f3964940f29cbf29188fa95a9d0f243dbdde15a99b1929c9ee8616653ea63'
where certificate_number = 'CERT-2026-002';

update public.certificates
set certificate_hash = 'ddfe4789d43d7c00f88e282e3d6825fc6ce1f89a1c55d1ecd83764d4410d5001'
where certificate_number = 'CERT-2026-003';
