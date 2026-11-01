import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  ShieldAlert, 
  RefreshCw, 
  Layers, 
  Lock, 
  CheckCircle2, 
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import { useToast } from '../components/Toast';

export default function EditCertificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalCert, setOriginalCert] = useState(null);

  const [formData, setFormData] = useState({
    student_name: '',
    student_email: '',
    course: '',
    institution: '',
    issue_date: '',
    expiry_date: '',
    status: 'active',
    description: '',
    issuer_name: '',
    issuer_organization: ''
  });

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const certs = await CertificateService.getAllCertificates();
        const found = certs.find(c => c.id === id || c.certificate_number === id);
        if (found) {
          setOriginalCert(found);
          setFormData({
            student_name: found.student_name || '',
            student_email: found.student_email || '',
            course: found.course || '',
            institution: found.institution || '',
            issue_date: found.issue_date || '',
            expiry_date: found.expiry_date || '',
            status: found.status || 'active',
            description: found.description || '',
            issuer_name: found.issuer_name || '',
            issuer_organization: found.issuer_organization || ''
          });
        } else {
          toast.error('Certificate record not found.');
          navigate('/admin/certificates');
        }
      } catch (err) {
        toast.error('Failed to load certificate record.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await CertificateService.updateCertificate(originalCert.id, formData);
      toast.success('Certificate updated & new audit block recorded!');
      navigate(`/details?id=${encodeURIComponent(res.certificate.certificate_number)}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update certificate.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading certificate record...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin/certificates')}
          className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Certificate List
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
              Update Certificate Record
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Editing ID: <span className="font-mono font-bold text-blue-600">{originalCert.certificate_number}</span>
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
            Current Status: {originalCert.status}
          </span>
        </div>
      </div>

      {/* Cryptographic Integrity Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
        <Layers className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Cryptographic Audit Trail Enforcement:</span>
          <p className="mt-0.5 text-blue-800">
            Per the CertiChain protocol, modifying student or qualification details will recalculate the SHA-256 fingerprint, store the previous hash, and append an immutable audit block to the ledger.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Status Selection */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-2">
            Certificate Status <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
              formData.status === 'active'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={handleChange}
                className="text-emerald-600"
              />
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Active (Valid)</span>
            </label>

            <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
              formData.status === 'revoked'
                ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="status"
                value="revoked"
                checked={formData.status === 'revoked'}
                onChange={handleChange}
                className="text-rose-600"
              />
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Revoked (Invalid)</span>
            </label>

            <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
              formData.status === 'expired'
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}>
              <input
                type="radio"
                name="status"
                value="expired"
                checked={formData.status === 'expired'}
                onChange={handleChange}
                className="text-amber-600"
              />
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Expired</span>
            </label>

          </div>
        </div>

        {/* Student & Program details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
              Student Full Name
            </label>
            <input
              type="text"
              name="student_name"
              required
              value={formData.student_name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
              Student Email
            </label>
            <input
              type="email"
              name="student_email"
              value={formData.student_email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
              Course / Degree
            </label>
            <input
              type="text"
              name="course"
              required
              value={formData.course}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
              Issuing Institution
            </label>
            <input
              type="text"
              name="institution"
              required
              value={formData.institution}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
              Issue Date
            </label>
            <input
              type="date"
              name="issue_date"
              required
              value={formData.issue_date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
              Description / Revocation Reason / Remarks
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Existing Hash Info */}
        <div className="pt-2 text-xs font-mono text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span className="font-bold text-slate-700">Current Cryptographic Hash:</span>
          <p className="break-all mt-0.5">{originalCert.certificate_hash}</p>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/certificates')}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Updating Hash & Creating Audit Block...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save & Recalculate Block
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
