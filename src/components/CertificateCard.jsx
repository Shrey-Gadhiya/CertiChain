import React, { useRef, useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Download, 
  Printer, 
  CheckCircle2, 
  Calendar, 
  QrCode, 
  Lock,
  Building2,
  FileCheck2,
  Share2,
  Check
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from './Toast';

export default function CertificateCard({ certificate, showControls = true }) {
  const certificateRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const toast = useToast();

  if (!certificate) return null;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);
    toast.info('Generating high-resolution PDF certificate...');

    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Fit the image in landscape A4 with a small margin
      const margin = 10;
      const printWidth = pdfWidth - margin * 2;
      const printHeight = (canvas.height * printWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', margin, (pdfHeight - printHeight) / 2, printWidth, printHeight);
      pdf.save(`${certificate.certificate_number}_${certificate.student_name.replace(/\s+/g, '_')}.pdf`);
      toast.success('Certificate PDF downloaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF. You can also use the Print button.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}/details?id=${encodeURIComponent(certificate.certificate_number)}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    toast.success('Certificate verification link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isRevoked = certificate.status === 'revoked';
  const isExpired = certificate.status === 'expired';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Top Action Controls */}
      {showControls && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Certificate Actions:
            </span>
            <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {certificate.certificate_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              title="Copy public link"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              {isCopied ? 'Link Copied' : 'Share Link'}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isExporting ? 'Generating PDF...' : 'Download Certificate PDF'}
            </button>
          </div>
        </div>
      )}

      {/* The Printable Certificate Canvas */}
      <div
        id="printable-certificate"
        ref={certificateRef}
        className="relative bg-white text-slate-900 rounded-2xl shadow-xl border-8 border-double border-slate-200 p-8 sm:p-12 overflow-hidden selection:bg-none"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFCFF 50%, #F5F8FF 100%)'
        }}
      >
        {/* Decorative corner ornaments */}
        <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-blue-600/40 pointer-events-none" />
        <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-blue-600/40 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-blue-600/40 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-blue-600/40 pointer-events-none" />

        {/* Revoked watermark if applicable */}
        {isRevoked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="text-rose-600/20 font-black text-6xl sm:text-8xl transform -rotate-24 uppercase tracking-widest border-8 border-dashed border-rose-600/20 px-8 py-4">
              REVOKED
            </div>
          </div>
        )}

        {/* Certificate Header */}
        <div className="text-center relative z-10 pb-6 border-b border-slate-200/80">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-950 font-serif">
              {certificate.institution}
            </span>
          </div>

          <p className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-1">
            OFFICIAL DIGITAL CREDENTIAL & ACADEMIC TRANSCRIPT
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif mt-2">
            Certificate of Achievement
          </h1>
          <p className="text-xs text-slate-500 italic mt-1">
            Issued in accordance with institutional accreditation and cryptographic integrity verification
          </p>
        </div>

        {/* Recipient Details */}
        <div className="text-center my-8 relative z-10 space-y-3">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            This is proudly presented to
          </p>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight font-serif underline decoration-blue-200 underline-offset-8">
            {certificate.student_name}
          </h2>

          <p className="text-sm text-slate-600 max-w-xl mx-auto pt-2">
            for successfully completing all prescribed coursework and assessments for
          </p>

          <div className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            {certificate.course}
          </div>

          {certificate.description && (
            <p className="text-xs text-slate-500 max-w-lg mx-auto italic mt-1">
              "{certificate.description}"
            </p>
          )}
        </div>

        {/* Certificate Metadata & Signatures Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200/80 items-end relative z-10">
          
          {/* Issue Date & Number */}
          <div className="text-center sm:text-left space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Issue Date
            </div>
            <div className="text-sm font-semibold text-slate-800 flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              {certificate.issue_date}
            </div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider pt-2">
              Certificate ID
            </div>
            <div className="text-xs font-mono font-bold text-blue-700 bg-blue-50 inline-block px-2 py-0.5 rounded border border-blue-200">
              {certificate.certificate_number}
            </div>
          </div>

          {/* Central Cryptographic Seal */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full border-4 border-double border-blue-600 bg-blue-50 flex flex-col items-center justify-center shadow-inner text-blue-700">
              <ShieldCheck className="w-8 h-8" />
              <span className="text-[8px] font-black tracking-widest uppercase mt-0.5">
                VERIFIED
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mt-2">
              CertiChain Protocol
            </span>
          </div>

          {/* Authority Signature */}
          <div className="text-center sm:text-right space-y-1">
            <div className="font-serif italic text-base text-slate-800 border-b border-slate-300 pb-1 mx-auto sm:ml-auto max-w-[180px]">
              {certificate.issuer_name || 'Academic Registrar'}
            </div>
            <div className="text-xs font-bold text-slate-800">
              Authorized Signatory
            </div>
            <div className="text-[11px] text-slate-500">
              {certificate.issuer_organization || certificate.institution}
            </div>
          </div>

        </div>

        {/* Digital Verification Bar */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2 font-mono">
          <div className="flex items-center gap-1.5 truncate max-w-md">
            <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">SHA-256: {certificate.certificate_hash}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded font-sans font-bold ${
              isRevoked
                ? 'bg-rose-100 text-rose-800'
                : isExpired
                ? 'bg-amber-100 text-amber-800'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {certificate.status ? certificate.status.toUpperCase() : 'ACTIVE'}
            </span>
            <span>certichain.verify</span>
          </div>
        </div>

      </div>
    </div>
  );
}
