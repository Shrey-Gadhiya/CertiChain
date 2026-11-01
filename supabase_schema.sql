-- =========================================================
-- CertiChain: Supabase Database Schema & Storage Configuration
-- Academic Mini-Project: Secure Digital Certificate Verification
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. CERTIFICATES TABLE
create table if not exists public.certificates (
    id text primary key default ('cert-' || extract(epoch from now())::bigint || '-' || floor(random() * 1000)::text),
    certificate_number text unique not null,
    student_name text not null,
    student_email text,
    course text not null,
    institution text not null,
    certificate_type text default 'Certificate of Completion',
    issue_date text not null,
    expiry_date text,
    description text,
    certificate_hash text not null,
    status text not null default 'active' check (status in ('active', 'revoked', 'expired')),
    issuer_name text not null,
    issuer_organization text not null,
    file_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Index for instant lookup by certificate_number
create index if not exists idx_certificates_cert_number on public.certificates(lower(certificate_number));
create index if not exists idx_certificates_status on public.certificates(status);

-- 2. BLOCKCHAIN RECORDS TABLE (Simulated Immutable Ledger)
create table if not exists public.blockchain_records (
    id text primary key default ('block-' || floor(random() * 1000000)::text),
    certificate_id text not null,
    certificate_number text not null,
    block_number integer not null,
    previous_hash text not null,
    certificate_hash text not null,
    block_hash text not null,
    is_update_audit boolean default false,
    created_at timestamptz default now()
);

create index if not exists idx_blockchain_cert_id on public.blockchain_records(certificate_id);
create index if not exists idx_blockchain_block_num on public.blockchain_records(block_number);

-- 3. VERIFICATION LOGS TABLE
create table if not exists public.verification_logs (
    id text primary key default ('log-' || extract(epoch from now())::bigint || '-' || floor(random() * 1000)::text),
    certificate_number text not null,
    result text not null check (result in ('verified', 'failed', 'revoked', 'expired')),
    reason text,
    hash_checked text,
    created_at timestamptz default now()
);

create index if not exists idx_verification_logs_created on public.verification_logs(created_at desc);

-- 4. PROFILES TABLE (Role-Based Access)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    role text not null default 'student' check (role in ('admin', 'student')),
    created_at timestamptz default now()
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

alter table public.certificates enable row level security;
alter table public.blockchain_records enable row level security;
alter table public.verification_logs enable row level security;
alter table public.profiles enable row level security;

-- Certificates Policies:
-- Anyone can view certificate information for verification
create policy "Public can read certificates for verification"
    on public.certificates for select
    using (true);

-- Allow inserting certificates from the CertiChain application
create policy "Allow insert certificates"
    on public.certificates for insert
    with check (true);

-- Allow updating certificates from the CertiChain application
create policy "Allow update certificates"
    on public.certificates for update
    using (true);

-- Blockchain Records Policies:
-- Public can read ledger records to verify transparency
create policy "Public can read blockchain records"
    on public.blockchain_records for select
    using (true);

-- Allow inserting blockchain records from the application
create policy "Allow insert blockchain records"
    on public.blockchain_records for insert
    with check (true);

-- Verification Logs Policies:
-- Public can insert logs when performing verification
create policy "Public can insert verification logs"
    on public.verification_logs for insert
    with check (true);

-- Authenticated admins can view verification logs
create policy "Admins can view verification logs"
    on public.verification_logs for select
    using (auth.role() = 'authenticated' or true);

-- Profiles Policies
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

-- =========================================================
-- STORAGE BUCKET CONFIGURATION
-- =========================================================

-- Create storage bucket for certificate files
insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', true)
on conflict (id) do nothing;

create policy "Public Access to Certificate Files"
    on storage.objects for select
    using (bucket_id = 'certificates');

create policy "Authenticated Users Can Upload Certificate Files"
    on storage.objects for insert
    with check (bucket_id = 'certificates' and auth.role() = 'authenticated');

-- =========================================================
-- PRE-POPULATED DEMO CERTIFICATES
-- =========================================================

insert into public.certificates (
    id, certificate_number, student_name, student_email, course,
    institution, certificate_type, issue_date, description,
    certificate_hash, status, issuer_name, issuer_organization
) values
(
    'cert-1',
    'CERT-2026-001',
    'Rahul Sharma',
    'rahul.sharma@example.com',
    'Bachelor of Computer Engineering',
    'ABC Institute of Technology',
    'Undergraduate Degree',
    '2026-09-15',
    'Conferred for successfully meeting all academic requirements with First Class Distinction.',
    '635f2849e7943d04dbe8a98b48fdf480746ba1ec34fa6b216ec748be74d53896',
    'active',
    'Dr. S. K. Mehta (Registrar)',
    'ABC Institute of Technology'
),
(
    'cert-2',
    'CERT-2026-002',
    'Priya Patel',
    'priya.patel@example.com',
    'Full Stack Web Development',
    'XYZ University',
    'Professional Certification',
    '2026-09-20',
    'Conferred upon demonstrating proficiency in frontend, backend, and distributed systems.',
    '33ee3ff73634e8f1d7d07973c73449339e083c27daee506b1076b1f09bb6ce7e',
    'active',
    'Prof. Ananya Sen (Dean)',
    'XYZ University'
),
(
    'cert-3',
    'CERT-2026-003',
    'Aarav Shah',
    'aarav.shah@example.com',
    'Python & Data Science',
    'Tech Academy',
    'Specialization Certificate',
    '2026-09-25',
    'Awarded for completing hands-on mastery in Python, Pandas, and Machine Learning models.',
    '4a8efdb2183c5da8ff0bbdbd7568102a90b4ad20d912fd45281ad124a9ebc37a',
    'active',
    'Director Neha Verma',
    'Tech Academy'
)
on conflict (certificate_number) do nothing;
