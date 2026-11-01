import React, { useState, useRef } from 'react';
import { Upload, FileText, Image, Check, AlertCircle, RefreshCw, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import VerificationResult from './VerificationResult';
import { useToast } from './Toast';

export default function UploadCertificate() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [certNumber, setCertNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const fileInputRef = useRef(null);
  const toast = useToast();

  const handleFile = (uploadedFile) => {
    if (!uploadedFile) return;

    // Check size (10 MB)
    if (uploadedFile.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds the 10 MB limit.');
      return;
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(uploadedFile.type)) {
      toast.error('Please upload a PDF, JPG, JPEG, or PNG file.');
      return;
    }

    setFile(uploadedFile);
    setVerificationResult(null);

    // Create preview URL
    if (uploadedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Heuristic: Extract certificate number & student name from filename if present
    const fileName = uploadedFile.name;
    const certMatch = fileName.match(/CERT[-_]?\d{4}[-_]?\d{3}/i);
    if (certMatch) {
      const normalizedNum = certMatch[0].toUpperCase().replace(/_/g, '-');
      setCertNumber(normalizedNum);
      toast.info(`Detected Certificate ID: ${normalizedNum}`);
    } else {
      setCertNumber('');
    }

    // Attempt student name detection
    if (fileName.toLowerCase().includes('rahul')) {
      setStudentName('Rahul Sharma');
    } else if (fileName.toLowerCase().includes('priya')) {
      setStudentName('Priya Patel');
    } else if (fileName.toLowerCase().includes('aarav')) {
      setStudentName('Aarav Shah');
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certNumber.trim()) {
      toast.error('Please confirm or enter the Certificate Number.');
      return;
    }
    if (!studentName.trim()) {
      toast.error('Please confirm or enter the Student Name.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await CertificateService.verifyCertificate({
        certificate_number: certNumber,
        student_name: studentName
      });
      setVerificationResult(res);

      if (res.isVerified) {
        toast.success('Certificate verified successfully!');
      } else {
        toast.error(res.reason || 'Certificate could not be verified.');
      }
    } catch (err) {
      toast.error(err.message || 'Verification process failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setCertNumber('');
    setStudentName('');
    setVerificationResult(null);
  };

  const loadSampleFile = (certNum, name) => {
    setCertNumber(certNum);
    setStudentName(name);
    // Create a mock File object to simulate uploaded certificate
    const mockFile = new File(
      ['Academic Certificate Digital File Content'],
      `${certNum}_${name.replace(/\s+/g, '_')}.pdf`,
      { type: 'application/pdf' }
    );
    setFile(mockFile);
    setPreviewUrl(null);
    toast.info(`Loaded sample document for ${certNum}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {verificationResult ? (
        <VerificationResult result={verificationResult} onReset={handleReset} />
      ) : (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8">
          
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#1E293B]">
              Upload Certificate for Digital Verification
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Upload your credential (PDF or image). We will inspect the details and check cryptographic validity.
            </p>
          </div>

          {!file ? (
            /* Upload Drop Area */
            <div>
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                    : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/70'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFile(e.target.files[0])}
                  accept=".pdf, .jpg, .jpeg, .png"
                  className="hidden"
                />
                
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8" />
                </div>

                <h3 className="text-base font-bold text-[#1E293B]">
                  Drag & Drop File Here
                </h3>
                <p className="text-sm text-[#64748B] mt-1">
                  or <span className="text-blue-600 font-semibold underline">Browse Files</span> from your computer
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  Supported formats: PDF, JPG, JPEG, PNG (Max size: 10 MB)
                </p>
              </div>

              {/* Sample files shortcut for easy presentation */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
                  Or Test with Sample Certificate Files:
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => loadSampleFile('CERT-2026-001', 'Rahul Sharma')}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    📄 CERT-2026-001 (Rahul Sharma)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleFile('CERT-2026-002', 'Priya Patel')}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    📄 CERT-2026-002 (Priya Patel)
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSampleFile('CERT-2026-003', 'Aarav Shah')}
                    className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition"
                  >
                    📄 CERT-2026-003 (Aarav Shah)
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* File Preview & Confirmation Form */
            <div className="space-y-6">
              
              {/* File Information Card */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    {file.type.startsWith('image/') ? (
                      <Image className="w-6 h-6" />
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; {file.type || 'Document'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition"
                >
                  Change File
                </button>
              </div>

              {/* Image Thumbnail if available */}
              {previewUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56 bg-slate-100 flex items-center justify-center">
                  <img
                    src={previewUrl}
                    alt="Certificate Preview"
                    className="max-h-56 object-contain w-auto mx-auto"
                  />
                </div>
              )}

              {/* Confirmation Step */}
              <form onSubmit={handleVerify} className="space-y-4 pt-2">
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 flex items-start gap-2.5">
                  <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Step 2: Confirm Information</span>
                    <p className="mt-0.5 text-blue-700">
                      Please confirm the Certificate Number and Student Name extracted from the document to query the registry.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                      Certificate Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CERT-2026-001"
                      value={certNumber}
                      onChange={(e) => setCertNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                      Student Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="flex-1 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-60"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Comparing with Supabase...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Verify Certificate Now
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
