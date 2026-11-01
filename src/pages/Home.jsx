import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layers, 
  FileCheck2, 
  ArrowRight, 
  Database, 
  Lock, 
  RefreshCw, 
  Award,
  Building2,
  BadgeCheck
} from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import VerificationResult from '../components/VerificationResult';
import UploadCertificate from '../components/UploadCertificate';
import { useToast } from '../components/Toast';

export default function Home() {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'upload'
  const [certNumber, setCertNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const toast = useToast();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certNumber.trim()) {
      toast.error('Please enter a Certificate Number.');
      return;
    }
    if (!studentName.trim()) {
      toast.error('Please enter the Student Name.');
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);

    try {
      const result = await CertificateService.verifyCertificate({
        certificate_number: certNumber,
        student_name: studentName
      });
      setVerificationResult(result);

      if (result.isVerified) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error(result.reason || 'Certificate could not be verified.');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVerificationResult(null);
    setCertNumber('');
    setStudentName('');
  };

  const fillDemoCertificate = (number, name) => {
    setActiveTab('direct');
    setCertNumber(number);
    setStudentName(name);
    setVerificationResult(null);
    toast.info(`Filled credentials for ${number}`);
  };

  const fillInvalidDemo = () => {
    setActiveTab('direct');
    setCertNumber('CERT-2026-999-FAKE');
    setStudentName('Unknown Candidate');
    setVerificationResult(null);
    toast.warning('Filled invalid certificate test values.');
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="pt-12 sm:pt-16 pb-8 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Blockchain-Inspired Private Ledger Verification</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E293B] tracking-tight leading-tight">
          Verify Certificates with <span className="text-[#2563EB]">Confidence</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto leading-relaxed">
          Instantly verify the authenticity and integrity of certificates using secure digital records and cryptographic SHA-256 validation.
        </p>

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-center mt-8">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 shadow-inner">
            <button
              onClick={() => { setActiveTab('direct'); setVerificationResult(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'direct'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4" />
              Direct Verification
            </button>
            <button
              onClick={() => { setActiveTab('upload'); setVerificationResult(null); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                activeTab === 'upload'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Certificate
            </button>
          </div>
        </div>
      </section>

      {/* Main Verification Section */}
      <section className="max-w-3xl mx-auto px-4">
        {activeTab === 'upload' ? (
          <UploadCertificate />
        ) : (
          <div className="space-y-6">
            
            {/* The Verification Form Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 transition-shadow hover:shadow-md">
              <form onSubmit={handleVerify} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label 
                      htmlFor="certNumber"
                      className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-2"
                    >
                      Certificate Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="certNumber"
                      type="text"
                      required
                      placeholder="e.g. CERT-2026-001"
                      value={certNumber}
                      onChange={(e) => setCertNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm font-mono tracking-wide placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="studentName"
                      className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-2"
                    >
                      Student Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="studentName"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-blue-500/20 disabled:opacity-60 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying Cryptographic Record...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        Verify Certificate
                      </>
                    )}
                  </button>
                  {certNumber && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-3.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>

              {/* Demo Quick-Picks as explicitly requested */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Try Demo Certificates:
                  </span>
                  <span className="text-xs text-blue-600 font-medium">Click to pre-fill</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => fillDemoCertificate('CERT-2026-001', 'Rahul Sharma')}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-600 group-hover:text-blue-700">
                        CERT-2026-001
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">INST-2026-IT</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">Rahul Sharma</div>
                    <div className="text-[11px] text-slate-500 truncate">Computer Eng. • ABC Institute</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoCertificate('CERT-2026-002', 'Priya Patel')}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-600 group-hover:text-blue-700">
                        CERT-2026-002
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">XYZ-UNIV-99</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">Priya Patel</div>
                    <div className="text-[11px] text-slate-500 truncate">Web Dev. • XYZ University</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoCertificate('CERT-2026-003', 'Aarav Shah')}
                    className="p-3 text-left rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition group cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-600 group-hover:text-blue-700">
                        CERT-2026-003
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">TECH-ACAD-01</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">Aarav Shah</div>
                    <div className="text-[11px] text-slate-500 truncate">Data Science • Tech Academy</div>
                  </button>
                </div>

                {/* Test Failure & Edge Cases Section */}
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-2">
                  <button
                    type="button"
                    onClick={fillInvalidDemo}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition inline-flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Test Invalid Certificate
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCertificate('CERT-2026-004', 'Devendra Roy')}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition inline-flex items-center gap-1"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Test Revoked Certificate (CERT-2026-004)
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoCertificate('CERT-2026-005', 'Kavita Nair')}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 transition inline-flex items-center gap-1"
                  >
                    Test Expired Certificate (CERT-2026-005)
                  </button>
                </div>

              </div>
            </div>

            {/* Verification Result Section */}
            {verificationResult && (
              <VerificationResult
                result={verificationResult}
                onReset={handleReset}
              />
            )}

          </div>
        )}
      </section>

      {/* Educational / How it works section */}
      <section className="max-w-5xl mx-auto px-4 pt-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
            How CertiChain Cryptographic Verification Works
          </h2>
          <p className="text-sm text-[#64748B] mt-2 max-w-xl mx-auto">
            Each certificate is linked to the previous record using cryptographic hashes, making unauthorized changes immediately detectable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-blue-200 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1E293B]">
              1. SHA-256 Hashing
            </h3>
            <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
              Upon issuance, certificate details (ID, recipient, course, institution, date) form a unique 256-bit cryptographic fingerprint.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-blue-200 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1E293B]">
              2. Immutable Block Ledger
            </h3>
            <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
              Each certificate is cryptographically chained to the previous block's hash, simulating a tamper-evident distributed ledger.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:border-blue-200 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#1E293B]">
              3. Instant Authenticity Match
            </h3>
            <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
              When verifying, the live hash is recomputed and strictly validated against the official stored ledger in Supabase.
            </p>
          </div>

        </div>
      </section>

      {/* Accredited Institutional Verification Network Section */}
      <section className="max-w-5xl mx-auto px-4 pt-4">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full mb-2">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                Verified Partner Network
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                Accredited Institutional Issuers
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                Official colleges and universities connected to the CertiChain cryptographic ledger network.
              </p>
            </div>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition shrink-0"
            >
              <Building2 className="w-4 h-4" />
              Institutional Officer Sign In &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">INST-2026-IT</span>
                <span className="text-[10px] text-slate-400 font-mono">AISHE: C-41235</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">ABC Institute of Technology</h3>
              <p className="text-[11px] text-slate-500">Autonomous Engineering • AICTE & NAAC 'A+'</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">XYZ-UNIV-99</span>
                <span className="text-[10px] text-slate-400 font-mono">AISHE: U-0421</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">XYZ University</h3>
              <p className="text-[11px] text-slate-500">State Central University • UGC & NAAC 'A++'</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">TECH-ACAD-01</span>
                <span className="text-[10px] text-slate-400 font-mono">AISHE: VOC-883</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">Tech Academy</h3>
              <p className="text-[11px] text-slate-500">Technical Board • ISO 9001:2015 Certified</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
