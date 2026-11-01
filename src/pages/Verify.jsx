import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import VerificationResult from '../components/VerificationResult';
import { useToast } from '../components/Toast';

export default function Verify() {
  const [searchParams] = useSearchParams();
  const [certNumber, setCertNumber] = useState(searchParams.get('id') || '');
  const [studentName, setStudentName] = useState(searchParams.get('name') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const toast = useToast();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certNumber.trim() || !studentName.trim()) {
      toast.error('Both Certificate Number and Student Name are required.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await CertificateService.verifyCertificate({
        certificate_number: certNumber,
        student_name: studentName
      });
      setResult(res);

      if (res.isVerified) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error(res.reason || 'Verification failed');
      }
    } catch (err) {
      toast.error(err.message || 'Verification process failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-[#1E293B]">
          Direct Certificate Verification
        </h1>
        <p className="text-sm text-[#64748B]">
          Cross-reference certificate credentials against the immutable private ledger.
        </p>
      </div>

      {!result ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Certificate Number
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CERT-2026-001"
                value={certNumber}
                onChange={(e) => setCertNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Student Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Verify Certificate
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <VerificationResult result={result} onReset={() => setResult(null)} />
      )}
    </div>
  );
}
