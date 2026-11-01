import React, { useState, useEffect } from 'react';
import { Settings, Database, RefreshCw, Shield, KeyRound, Cpu, CheckCircle2, AlertTriangle, Building2, BadgeCheck } from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import { useToast } from '../components/Toast';

export default function AdminSettings() {
  const toast = useToast();
  const isLive = CertificateService.isLiveSupabase();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'Not configured';
  const [adminSession, setAdminSession] = useState(null);

  useEffect(() => {
    async function loadSession() {
      const s = await CertificateService.getAdminSession();
      setAdminSession(s);
    }
    loadSession();
  }, []);

  const handleResetDemoData = async () => {
    if (window.confirm('Reset all certificates, blockchain blocks, and verification logs back to the default initial PBL demo state?')) {
      await CertificateService.resetDemoData();
      toast.success('Demo dataset successfully restored to original PBL seed data.');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
          System Settings & Environment
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
          Institutional node configuration, database connectivity, and cryptographic ledger parameters.
        </p>
      </div>

      {/* Institutional Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">
                Active Institutional Authority Profile
              </h2>
              <p className="text-xs text-[#64748B]">Accredited issuer identity & node designation</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
            <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
            Active Node
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Institution Name</span>
            <div className="text-sm font-bold text-slate-800">{adminSession?.institution || 'ABC Institute of Technology'}</div>
            <div className="text-[11px] text-slate-500">{adminSession?.institution_department || 'Office of Controller of Examinations'}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Institutional Codes</span>
            <div className="text-sm font-mono font-bold text-slate-800">Code: {adminSession?.institution_code || 'INST-2026-IT'}</div>
            <div className="text-[11px] font-mono text-slate-500">AISHE: {adminSession?.institution_aishe || 'C-41235'}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Authorized Officer</span>
            <div className="text-sm font-semibold text-slate-800">{adminSession?.user_metadata?.full_name || 'Dr. S. K. Mehta (Registrar)'}</div>
            <div className="text-[11px] text-slate-500">{adminSession?.email || 'admin@certichain.org'}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Accreditation & Standards</span>
            <div className="text-sm font-semibold text-slate-800">{adminSession?.institution_accreditation || "NAAC 'A+' Grade • AICTE Approved"}</div>
            <div className="text-[11px] text-slate-500">Cryptographic Standard: FIPS-180-4 SHA-256</div>
          </div>
        </div>
      </div>

      {/* Supabase Connection Status Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">
                Supabase Backend Integration
              </h2>
              <p className="text-xs text-[#64748B]">Cloud PostgreSQL, Authentication & Storage</p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isLive
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            {isLive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            {isLive ? 'Supabase Connected' : 'Simulated DB Active'}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 font-bold uppercase tracking-wider">Configured URL:</label>
            <p className="font-mono text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200 mt-1 truncate">
              {supabaseUrl}
            </p>
          </div>

          <p className="text-slate-600 leading-relaxed">
            {isLive ? (
              'CertiChain is fully connected to your live Supabase database instance. Certificates and block records persist directly to PostgreSQL.'
            ) : (
              'The application is running smoothly with an internal in-browser database engine (localStorage cache). To connect to live cloud Supabase, simply enter your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file and execute the included supabase_schema.sql in the Supabase SQL editor.'
            )}
          </p>
        </div>
      </div>

      {/* Demo Data Management */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">
                PBL Demo Dataset Management
              </h2>
              <p className="text-xs text-[#64748B]">Restore default demo certificates</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#64748B] leading-relaxed">
          Restore the project dataset back to the original initial certificates (Rahul Sharma: <code>CERT-2026-001</code>, Priya Patel: <code>CERT-2026-002</code>, Aarav Shah: <code>CERT-2026-003</code>, Devendra Roy: <code>CERT-2026-004</code>).
        </p>

        <div>
          <button
            type="button"
            onClick={handleResetDemoData}
            className="px-4 py-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to Default PBL Demo Data
          </button>
        </div>
      </div>

      {/* Cryptographic Architecture Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E293B]">
              Cryptographic Integrity Protocol
            </h2>
            <p className="text-xs text-[#64748B]">SHA-256 Digesting & Private Ledger Links</p>
          </div>
        </div>

        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
            <span><strong>Hashing:</strong> Standard Web Crypto API <code>crypto.subtle.digest('SHA-256')</code> executed securely in the browser.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
            <span><strong>Chaining:</strong> Each certificate block computes <code>SHA256(BlockNumber + PreviousHash + CertHash + Timestamp)</code>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
            <span><strong>Tamper-evidence:</strong> Any manual change to certificate recipient or course details causes immediate hash mismatch during verification.</span>
          </li>
        </ul>
      </div>

    </div>
  );
}
