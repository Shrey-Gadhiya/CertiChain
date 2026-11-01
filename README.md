# CertiChain — Secure Digital Certificate Verification System

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Web Crypto API](https://img.shields.io/badge/Cryptography-SHA--256-blue)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
[![Academic Project](https://img.shields.io/badge/Type-PBL%20Mini%20Project-orange)](#-academic-project-statement)

> **CertiChain** is a modern, lightweight, full-stack certificate verification platform designed to combat academic credential fraud. It integrates **SHA-256 cryptographic hashing** and a **tamper-evident, blockchain-inspired private ledger** to provide instant authenticity verification for students, universities, and employers.

---

## 📌 Table of Contents

- [Project Overview & Problem Statement](#-project-overview)
- [System Architecture & Workflow](#-system-architecture--workflow)
- [Key Features](#-key-features)
- [Cryptographic & Blockchain Concept](#-cryptographic--blockchain-concept)
- [UI/UX Design System](#-uiux-design-system)
- [Application Pages & Routes](#-application-pages--routes)
- [Technology Stack](#-technology-stack)
- [Pre-Configured Demo Credentials & Test Cases](#-pre-configured-demo-credentials--test-cases)
- [Database Schema (Supabase PostgreSQL)](#-database-schema-supabase-postgresql)
- [Local Installation & Setup](#-local-installation--setup)
- [Supabase Cloud Configuration](#-supabase-cloud-configuration)
- [Security & Tamper Resistance](#-security--tamper-resistance)
- [Academic Project Statement](#-academic-project-statement)

---

## 🎯 Project Overview

Traditional paper and basic digital certificates (unsecured PDFs) are vulnerable to tampering, unauthorized grade alterations, and counterfeit issuance. 

**CertiChain** solves this through a lightweight, verifiable architecture:
- Every certificate issued by an institution is given a unique **Certificate Number**.
- Crucial certificate fields are digested into an immutable **SHA-256 cryptographic hash**.
- Each issuance is cryptographically appended to a **blockchain-style private ledger** linking previous block hashes to ensure chronological auditability.
- Anyone can verify a certificate in seconds by supplying the **Certificate ID** and **Student Name**, or by uploading a digital certificate file (PDF, JPG, PNG).

---

## 🏗️ System Architecture & Workflow

```text
[ ADMIN PORTAL ]
       │
       ├─► 1. Enters Student & Program Details
       ├─► 2. Calculates SHA-256 Digest: SHA256(CertNo | Name | Course | Inst | Date)
       ├─► 3. Creates Chained Block: SHA256(BlockNo | PrevHash | CertHash | Timestamp)
       └─► 4. Persists to Supabase Cloud Database + Storage Bucket
                               │
                               ▼
                    [ POSTGRESQL DATABASE ]
                               │
[ PUBLIC VERIFIER ]            │
       │                       │
       ├─► Enters Certificate ID + Student Name (or uploads document)
       │                       ▼
       ├─► Fetches Official Record from Supabase
       │        ├─► NOT FOUND? ──► [ ✕ CERTIFICATE NOT VERIFIED ]
       │        └─► FOUND? 
       │                 │
       ├─► Recalculates SHA-256 Hash on Client Machine
       │                 │
       │        ┌────────┴────────┐
       │   [ Hash Match? ]   [ Status Active? ]
       │        │                 │
       │       YES               YES
       │        └────────┬────────┘
       │                 ▼
       └────────► [ ✓ CERTIFICATE VERIFIED ]
                  • Official Student & Academic Data
                  • Cryptographic SHA-256 Fingerprint
                  • Blockchain Lifecycle Timeline
                  • High-Resolution PDF Download
```

---

## 🚀 Key Features

### 1. Dual-Mode Verification System
- **Direct Query Verification**: Verifiers enter the Certificate ID (e.g. `CERT-2026-001`) and Student Name to cross-reference the registry.
- **Upload Certificate Verification**: Drag-and-drop or file selector supporting PDF, JPG, JPEG, and PNG (up to 10 MB). The application reads the filename heuristics, extracts potential certificate IDs, and confirms details before verifying against the cloud database.

### 2. Cryptographic Integrity Validation
- Guarantees tamper-evidence: If a malicious actor changes a single character in a student's name, degree, institution, or issuance date, the recalculated hash immediately fails to match the database fingerprint.

### 3. Clear Verification Outcomes
- **✓ CERTIFICATE VERIFIED**: Displays a verified badge, student and program information, cryptographic digest, and blockchain progression steps.
- **✕ CERTIFICATE NOT VERIFIED**: Clarifies failure causes (e.g., non-existent ID, name mismatch, or tampered document) without exposing sensitive database internals.
- **✕ CERTIFICATE REVOKED**: Distinct state when an administrative authority has officially revoked a qualification.
- **✕ CERTIFICATE EXPIRED**: Flags credentials that have passed their explicit validity period.

### 4. Interactive Blockchain Explorer (`/ledger`)
- Transparent visualization of linked blocks:
  - Block Number
  - Linked Certificate Number
  - Previous Block Hash
  - Certificate SHA-256 Hash
  - Resulting Block Hash
  - Generation Timestamp

### 5. High-Resolution Certificate Generator & PDF Export
- Renders an authentic digital credential with institutional header, registrar signature, and gold-accented cryptographic verification badge.
- Instant 1-click **Download Certificate PDF** via client-side canvas rasterization (`jsPDF` + `html2canvas`) and browser print layout.

### 6. Full Administrative Dashboard (`/admin`)
- **Metric Cards**: Total Certificates, Active Verified, Expired, and Revoked counts.
- **Issue Certificate**: Issuance form with automatic ID generation, document attachment, cryptographic hashing, and block generation.
- **All Certificates Registry**: Searchable and filterable table with one-click revocation actions.
- **Edit Certificate**: Update records with automated hash recalculation and audit block generation.
- **Verification Logs**: Audit tracking of every verification query with timestamps and reasons.

---

## 🔐 Cryptographic & Blockchain Concept

> **Notice**: CertiChain implements a **blockchain-inspired private ledger** tailored for academic demonstration. It prioritizes clarity, performance, and deterministic verification without high gas costs or complex consensus overhead.

### 1. Certificate Hash Formulation
```text
SHA256( Certificate_Number | Student_Name | Course | Institution | Issue_Date )
```
- Inputs are canonicalized (uppercase ID, lowercase trimmed strings).
- Output: 64-character hexadecimal SHA-256 digest.

### 2. Block Chaining Formulation
```text
SHA256( Block_Number | Previous_Block_Hash | Certificate_Hash | Timestamp )
```
- **Genesis Block (#1)**: Fixed genesis anchor `0000000000000000000000000000000000000000000000000000000000000000`.
- **Subsequent Blocks (#N)**: `Previous_Block_Hash` is strictly set to `Block_(N-1).block_hash`.
- Any alteration to past records breaks the cryptographic link across all subsequent blocks.

---

## 🎨 UI/UX Design System

Engineered with a clean, professional aesthetic:

| Token | Hex Value | Application |
| :--- | :--- | :--- |
| **Background** | `#F8FAFC` | Page body and structural canvas |
| **Surface Cards** | `#FFFFFF` | Rounded cards with subtle shadows |
| **Primary** | `#2563EB` | Buttons, active navigation, brand elements |
| **Success** | `#16A34A` | Verified states, valid status badges |
| **Error / Revoked** | `#DC2626` | Not verified cards, revoked alerts |
| **Text Primary** | `#1E293B` | High-contrast body and headers |
| **Text Secondary** | `#64748B` | Subtitles, labels, metadata notes |
| **Borders** | `#E2E8F0` | Subtle structural division lines |

---

## 🗺️ Application Pages & Routes

| Path | View | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | **Home / Verify** | Public | Hero banner, direct verification form, demo quick-picks |
| `/verify` | **Direct Verify** | Public | Standalone verification portal with URL parameter support |
| `/details` | **Certificate Details** | Public | Credential inspector, PDF export, and shareable link |
| `/upload` | **Upload Certificate** | Public | Drag-and-drop document upload and OCR confirmation |
| `/ledger` | **Blockchain Explorer**| Public | Visual timeline of linked cryptographic blocks |
| `/admin/login` | **Institutional Admin Login** | Public | Institutional portal authentication with Institute switcher, accreditation details, and 1-click demo login |
| `/admin` | **Admin Dashboard** | Protected | Active Institutional Authority Node banner, summary metrics, recent certificates, and query log widget |
| `/admin/issue` | **Issue Certificate** | Protected | Credential creation form with hash generation and active institution prefill |
| `/admin/certificates` | **All Certificates** | Protected | Registry management table with search and revocation |
| `/admin/edit/:id` | **Edit Certificate** | Protected | Record update form with audit block generation |
| `/admin/logs` | **Verification Logs** | Protected | Audit history of verification attempts and reasons |
| `/admin/settings` | **System Settings** | Protected | Active institutional profile, database status, demo reset, and architecture notes |

---

## 🛠️ Technology Stack

- **Frontend Core**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Document Export**: [jsPDF](https://github.com/parallax/jsPDF) & [html2canvas](https://html2canvas.hertzen.com/)
- **Cryptography**: Web Crypto API (`window.crypto.subtle`)
- **Backend / Cloud DB**: [Supabase](https://supabase.com/) (PostgreSQL + RLS + Storage)
- **Local Resilience**: In-browser IndexedDB for file attachments + localStorage cache fallback

---

## 🧪 Pre-Configured Demo Credentials & Test Cases

The application includes sample credentials for demonstration:

| Certificate Number | Student Name | Course | Institution | Status | Expected Result |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`CERT-2026-001`** | Rahul Sharma | Bachelor of Computer Engineering | ABC Institute of Technology | Active | **✓ CERTIFICATE VERIFIED** |
| **`CERT-2026-002`** | Priya Patel | Full Stack Web Development | XYZ University | Active | **✓ CERTIFICATE VERIFIED** |
| **`CERT-2026-003`** | Aarav Shah | Python & Data Science | Tech Academy | Active | **✓ CERTIFICATE VERIFIED** |
| **`CERT-2026-004`** | Devendra Roy | Advanced Network Defense | CyberDefense Institute | Revoked | **✕ CERTIFICATE REVOKED** |
| **`CERT-2026-005`** | Kavita Nair | Cloud Security Associate | Global Cloud Board | Expired | **✕ CERTIFICATE EXPIRED** |
| **`CERT-2026-999`** | Any Name | Any Course | Any | Not Found | **✕ CERTIFICATE NOT VERIFIED** |

### 🔑 Institutional Admin Credentials
- **Email**: `admin@certichain.org`
- **Password**: `admin123`
- **Supported Institutions**:
  - **ABC Institute of Technology** (`INST-2026-IT` • AISHE: `C-41235` • NAAC 'A+' Grade)
  - **XYZ University** (`XYZ-UNIV-99` • AISHE: `U-0421` • NAAC 'A++' Grade)
  - **Tech Academy** (`TECH-ACAD-01` • AISHE: `VOC-883` • ISO 9001:2015)
  - **Custom Institution**: Any university/college name & institutional code entered dynamically.
*(A 1-click **⚡ Quick Fill Demo Login** button is provided on `/admin/login`)*

---

## 🗄️ Database Schema (Supabase PostgreSQL)

### 1. `public.certificates`
```sql
create table public.certificates (
    id text primary key,
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
```

### 2. `public.blockchain_records`
```sql
create table public.blockchain_records (
    id text primary key,
    certificate_id text not null,
    certificate_number text not null,
    block_number integer not null,
    previous_hash text not null,
    certificate_hash text not null,
    block_hash text not null,
    is_update_audit boolean default false,
    created_at timestamptz default now()
);
```

### 3. `public.verification_logs`
```sql
create table public.verification_logs (
    id text primary key,
    certificate_number text not null,
    result text not null check (result in ('verified', 'failed', 'revoked', 'expired')),
    reason text,
    hash_checked text,
    created_at timestamptz default now()
);
```

---

## 💻 Local Installation & Setup

### Prerequisites
- Node.js `v18+` or `v20+`
- npm `v9+`

### 1. Clone & Install
```bash
git clone <repository-url>
cd fbcit_pbl_project
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## ☁️ Supabase Cloud Configuration

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Run the initial setup script: [**`supabase_schema.sql`**](./supabase_schema.sql).
4. Run the permissions script to enable client issuance and hash sync: [**`fix_policies.sql`**](./fix_policies.sql).
5. Copy your **Project URL** and **Anon Key** into `.env`.
6. Restart your dev server. The application will automatically show the green **`Supabase Live`** badge in the navbar.

---

## 🛡️ Security & Tamper Resistance

1. **Client-Side SHA-256 Calculation**: Verification computes the digest locally in the verifier's browser using the native Web Crypto API, removing reliance on blind trust.
2. **Sanitized Failure States**: Failed verifications display clear explanations without exposing confidential database schema details.
3. **Storage Quota Protection**: Uploaded PDFs and images are processed via Supabase Storage and browser IndexedDB, avoiding localStorage quota overflow.
4. **Audit Immutability**: Editing an existing certificate creates an update block linking the previous hash rather than overwriting history.

---

## 📜 Academic Project Statement

**CertiChain — Secure Digital Certificate Verification**  
*Built as an academic Problem-Based Learning (PBL) mini project.*  

Designed and developed to demonstrate practical applications of **cryptographic digests, simulated distributed ledgers, and full-stack cloud database integration**.
