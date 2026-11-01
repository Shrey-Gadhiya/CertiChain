import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Calendar, 
  Building2, 
  GraduationCap, 
  User, 
  Lock, 
  FileCheck,
  AlertCircle,
  Copy,
  Check,
  Layers
} from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import CertificateCard from '../components/CertificateCard';
import { useToast } from '../components/Toast';

export default function CertificateDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [queryCertNumber, setQueryCertNumber] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [blockRecord, setBlockRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const toast = useToast();

  const urlId = searchParams.get('id');

  useEffect(() => {
    if (urlId) {
      setQueryCertNumber(urlId);
      loadCertificate(urlId);
    }
  }, [urlId]);

  const loadCertificate = async (certNum) => {
    if (!certNum.trim()) return;
    setIsLoading(true);
    setHasSearched(true);

    try {
      const cert = await CertificateService.getCertificateByNumber(certNum);
      setCertificate(cert);

      if (cert) {
        const block = await CertificateService.getBlockchainRecordForCertificate(cert.id, cert.certificate_number);
        setBlockRecord(block);
      } else {
        setBlockRecord(null);
        toast.error(`Certificate "${certNum}" not found in records.`);
      }
    } catch (err) {
      toast.error('Failed to look up certificate details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!queryCertNumber.trim()) {
      toast.error('Please enter a certificate number');
      return;
    }
    loadCertificate(queryCertNumber);
  };

  const handleCopyHash = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    toast.success('SHA-256 hash copied!');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
          Certificate Verification & Details
        </h1>
        <p className="text-sm text-[#64748B] mt-2">
          Enter any registered Certificate Number to inspect its official record, cryptographic SHA-256 integrity, and blockchain ledger block.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Enter Certificate Number (e.g. CERT-2026-001)"
              value={queryCertNumber}
              onChange={(e) => setQueryCertNumber(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E2E8F0] font-mono text-sm uppercase placeholder:normal-case placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Search Record'}
          </button>
        </form>

        {/* Quick links */}
        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-500">
          <span>Quick lookups:</span>
          <button
            onClick={() => { setQueryCertNumber('CERT-2026-001'); loadCertificate('CERT-2026-001'); }}
            className="text-blue-600 hover:underline font-mono"
          >
            CERT-2026-001
          </button>
          <span>&bull;</span>
          <button
            onClick={() => { setQueryCertNumber('CERT-2026-002'); loadCertificate('CERT-2026-002'); }}
            className="text-blue-600 hover:underline font-mono"
          >
            CERT-2026-002
          </button>
          <span>&bull;</span>
          <button
            onClick={() => { setQueryCertNumber('CERT-2026-003'); loadCertificate('CERT-2026-003'); }}
            className="text-blue-600 hover:underline font-mono"
          >
            CERT-2026-003
          </button>
        </div>
      </div>

      {/* Results View */}
      {certificate ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* Metadata Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                  {certificate.certificate_number}
                </span>
                <h2 className="text-2xl font-bold text-[#1E293B] mt-2">
                  {certificate.student_name}
                </h2>
                <p className="text-sm text-[#64748B]">
                  {certificate.course} &bull; {certificate.institution}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  certificate.status === 'revoked'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : certificate.status === 'expired'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                  {certificate.status ? certificate.status.toUpperCase() : 'ACTIVE'}
                </span>
                {blockRecord && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    Block #{blockRecord.block_number}
                  </span>
                )}
              </div>
            </div>

            {/* Structured Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Student Name
                </label>
                <p className="text-sm font-semibold text-[#1E293B] mt-0.5">{certificate.student_name}</p>
                {certificate.student_email && (
                  <p className="text-xs text-slate-500">{certificate.student_email}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Certificate Number
                </label>
                <p className="text-sm font-mono font-bold text-[#1E293B] mt-0.5">{certificate.certificate_number}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Course / Program
                </label>
                <p className="text-sm font-semibold text-[#1E293B] mt-0.5">{certificate.course}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Institution
                </label>
                <p className="text-sm font-semibold text-[#1E293B] mt-0.5">{certificate.institution}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Issue Date
                </label>
                <p className="text-sm font-semibold text-[#1E293B] mt-0.5">{certificate.issue_date}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Expiry Date
                </label>
                <p className="text-sm font-semibold text-[#1E293B] mt-0.5">
                  {certificate.expiry_date || 'No Expiration (Lifetime Validity)'}
                </p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Certificate Type
                </label>
                <p className="text-sm font-semibold text-[#1E293B] mt-0.5">{certificate.certificate_type || 'Degree'}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Issuing Authority
                </label>
                <p className="text-sm font-semibold text-[#1E293B] mt-0.5">
                  {certificate.issuer_name || 'Academic Authority'}
                </p>
                <p className="text-xs text-slate-500">{certificate.issuer_organization || certificate.institution}</p>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Verification Status
                </label>
                <p className="text-sm font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Official Database Record Confirmed
                </p>
              </div>
            </div>

            {/* Cryptographic SHA-256 Hash */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  Certificate Cryptographic Hash (SHA-256)
                </span>
                <button
                  onClick={() => handleCopyHash(certificate.certificate_hash)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedHash ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className="font-mono text-xs text-slate-700 break-all bg-white p-2.5 rounded-lg border border-slate-200">
                {certificate.certificate_hash}
              </p>
            </div>

            {/* Action Buttons as requested: Download Certificate and Verify Certificate */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => navigate(`/?id=${certificate.certificate_number}&name=${encodeURIComponent(certificate.student_name)}`)}
                className="px-5 py-2.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 text-sm font-semibold flex items-center gap-2 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify Certificate
              </button>
            </div>

          </div>

          {/* Visual Certificate Card Preview with PDF download */}
          <div>
            <div className="mb-3 text-center sm:text-left">
              <h3 className="text-lg font-bold text-[#1E293B]">
                Official Digital Credential View
              </h3>
              <p className="text-xs text-[#64748B]">
                High-resolution cryptographic certificate ready for presentation or download.
              </p>
            </div>
            <CertificateCard certificate={certificate} showControls={true} />
          </div>

        </div>
      ) : hasSearched && !isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            Certificate Not Found
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            No certificate was found with the ID "{queryCertNumber}". Please double-check the certificate number or verify it on the homepage.
          </p>
        </div>
      ) : null}

    </div>
  );
}
