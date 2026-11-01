import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Calendar, 
  Building2, 
  GraduationCap, 
  User, 
  Layers, 
  ArrowDown, 
  ExternalLink,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VerificationResult({ result, onReset }) {
  const [copiedHash, setCopiedHash] = React.useState(false);

  if (!result) return null;

  const { isVerified, status, reason, certificate, blockRecord, hashDetails } = result;

  const handleCopyHash = (hash) => {
    if (!hash) return;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  // SUCCESS STATE
  if (isVerified && certificate) {
    return (
      <div className="w-full bg-white rounded-2xl border-2 border-emerald-500 shadow-xl shadow-emerald-500/5 p-6 sm:p-8 animate-fade-in">
        {/* Main Status Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
                  ✓ CERTIFICATE VERIFIED
                </h3>
              </div>
              <p className="text-sm text-emerald-700 font-medium">
                Cryptographic signature matches official registry record.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Blockchain Record: Valid
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
              Active Status
            </span>
          </div>
        </div>

        {/* Certificate Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 pt-2">
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Certificate Number
              </label>
              <div className="text-lg font-mono font-bold text-[#1E293B] tracking-wide mt-0.5">
                {certificate.certificate_number}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Student Name
              </label>
              <div className="text-lg font-bold text-[#1E293B] mt-0.5">
                {certificate.student_name}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                Course / Program
              </label>
              <div className="text-base font-semibold text-[#1E293B] mt-0.5">
                {certificate.course}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Issuing Academic Institution
              </label>
              <div className="text-base text-[#1E293B] font-bold mt-0.5 flex flex-wrap items-center gap-2">
                <span>{certificate.institution}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Accredited Issuer
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                Issue Date
              </label>
              <div className="text-base font-semibold text-[#1E293B] mt-0.5">
                {certificate.issue_date}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Certificate Type
              </label>
              <div className="text-base text-[#1E293B] font-medium mt-0.5">
                {certificate.certificate_type || 'Standard Qualification'}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Issued By & Authority
              </label>
              <div className="text-base text-[#1E293B] font-medium mt-0.5">
                {certificate.issuer_name || 'Academic Registrar'} &bull; {certificate.issuer_organization || certificate.institution}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
                Verification Status
              </label>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-sm font-bold text-emerald-700">Verified & Authentic</span>
              </div>
            </div>
          </div>

        </div>

        {/* Certificate Hash Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
              Cryptographic SHA-256 Digest
            </span>
            <button
              onClick={() => handleCopyHash(certificate.certificate_hash)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
            >
              {copiedHash ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Hash</span>
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-xs text-slate-700 break-all bg-white p-2.5 rounded-lg border border-slate-200">
            {certificate.certificate_hash}
          </p>
        </div>

        {/* Blockchain Timeline Section */}
        <div className="bg-gradient-to-b from-blue-50/50 to-slate-50/50 rounded-xl border border-blue-100 p-5 my-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-bold text-[#1E293B]">
                Blockchain Verification Lifecycle
              </h4>
            </div>
            {blockRecord && (
              <span className="text-xs font-mono font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Block #{blockRecord.block_number}
              </span>
            )}
          </div>

          {/* Simple step timeline as specified */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left py-2">
            
            <div className="flex-1 p-3 bg-white rounded-lg border border-blue-200 shadow-xs w-full">
              <div className="text-xs text-slate-500 font-medium">Step 1</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Certificate Issued</div>
              <div className="text-[11px] text-slate-500">{certificate.issue_date}</div>
            </div>

            <ArrowDown className="w-4 h-4 text-blue-500 sm:-rotate-90 shrink-0" />

            <div className="flex-1 p-3 bg-white rounded-lg border border-blue-200 shadow-xs w-full">
              <div className="text-xs text-slate-500 font-medium">Step 2</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Hash Generated</div>
              <div className="text-[11px] text-slate-500">SHA-256 Digest</div>
            </div>

            <ArrowDown className="w-4 h-4 text-blue-500 sm:-rotate-90 shrink-0" />

            <div className="flex-1 p-3 bg-white rounded-lg border border-blue-200 shadow-xs w-full">
              <div className="text-xs text-slate-500 font-medium">Step 3</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Record Stored</div>
              <div className="text-[11px] text-slate-500">Immutable Ledger</div>
            </div>

            <ArrowDown className="w-4 h-4 text-blue-500 sm:-rotate-90 shrink-0" />

            <div className="flex-1 p-3 bg-emerald-50 rounded-lg border border-emerald-300 shadow-xs w-full">
              <div className="text-xs text-emerald-600 font-medium">Step 4</div>
              <div className="text-xs font-bold text-emerald-800 mt-0.5">Certificate Verified</div>
              <div className="text-[11px] text-emerald-700">Integrity Valid</div>
            </div>

          </div>

          {blockRecord && (
            <div className="mt-3 pt-3 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 font-mono gap-1">
              <span>Prev Hash: {blockRecord.previous_hash.substring(0, 16)}...</span>
              <span>Block Hash: {blockRecord.block_hash.substring(0, 16)}...</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Verify Another Certificate
          </button>
          <Link
            to={`/details?id=${encodeURIComponent(certificate.certificate_number)}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            View Full Certificate Page
          </Link>
        </div>

      </div>
    );
  }

  // REVOKED STATE
  if (status === 'revoked') {
    return (
      <div className="w-full bg-white rounded-2xl border-2 border-rose-500 shadow-xl shadow-rose-500/5 p-6 sm:p-8 animate-fade-in">
        <div className="flex items-start gap-4 pb-4 border-b border-rose-100">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-[#DC2626] tracking-tight">
              ✕ CERTIFICATE REVOKED
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              This certificate was officially issued but has since been revoked by the issuing authority.
            </p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 my-6 text-sm text-rose-900 space-y-2">
          <div className="font-semibold">Revocation Notice:</div>
          <p>{reason || 'Revoked per academic administrative authority.'}</p>
          {certificate && (
            <div className="pt-2 text-xs text-rose-700 font-mono">
              Certificate: {certificate.certificate_number} | Student: {certificate.student_name}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
          >
            Try Another Verification
          </button>
        </div>
      </div>
    );
  }

  // EXPIRED STATE
  if (status === 'expired') {
    return (
      <div className="w-full bg-white rounded-2xl border-2 border-amber-500 shadow-xl shadow-amber-500/5 p-6 sm:p-8 animate-fade-in">
        <div className="flex items-start gap-4 pb-4 border-b border-amber-100">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-amber-800 tracking-tight">
              ✕ CERTIFICATE EXPIRED
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              This certificate is past its validity expiration date.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6 text-sm text-amber-900">
          <p>{reason || 'The validity timeframe for this qualification has concluded.'}</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onReset}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
          >
            Try Another Verification
          </button>
        </div>
      </div>
    );
  }

  // GENERIC NOT VERIFIED / MISMATCH / NOT FOUND STATE
  return (
    <div className="w-full bg-white rounded-2xl border-2 border-[#DC2626] shadow-xl shadow-rose-500/5 p-6 sm:p-8 animate-fade-in">
      <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#DC2626] flex items-center justify-center shrink-0">
          <XCircle className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-[#DC2626] tracking-tight">
            ✕ CERTIFICATE NOT VERIFIED
          </h3>
          <p className="text-sm text-[#64748B] mt-1 font-medium">
            The certificate details could not be matched with our official records.
          </p>
        </div>
      </div>

      <div className="my-6 space-y-4">
        <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 text-sm text-slate-800">
          <div className="font-semibold text-rose-900 mb-1">Reason for failure:</div>
          <p className="text-rose-800">{reason}</p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Possible reasons for verification failure:
          </h4>
          <ul className="space-y-2 text-sm text-[#64748B]">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
              <span><strong>Invalid certificate number:</strong> Double-check the ID formatted like <code>CERT-2026-001</code>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
              <span><strong>Student details do not match:</strong> The name entered must match the officially registered recipient name.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
              <span><strong>Certificate has been modified:</strong> Any alteration to grade, name, date, or issuing institution invalidates the cryptographic SHA-256 hash.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></span>
              <span><strong>Certificate does not exist in the database:</strong> This document was never officially registered on CertiChain.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <span className="text-xs text-slate-500">
          Tip: Try using one of our pre-configured demo certificates on the homepage.
        </span>
        <button
          onClick={onReset}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
