import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Upload, 
  Sparkles, 
  ShieldCheck, 
  RefreshCw, 
  ArrowLeft,
  Calendar,
  Building,
  GraduationCap,
  User,
  Mail,
  FileText
} from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import { useToast } from '../components/Toast';

export default function IssueCertificate() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    certificate_number: '',
    student_name: '',
    student_email: '',
    course: '',
    institution: 'ABC Institute of Technology',
    certificate_type: 'Bachelor of Computer Engineering Degree',
    issue_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    description: 'Conferred with First Class Distinction upon completing all degree criteria.',
    issuer_name: 'Dr. S. K. Mehta (Registrar)',
    issuer_organization: 'ABC Institute of Technology',
    status: 'active'
  });

  useEffect(() => {
    async function loadInstitute() {
      const session = await CertificateService.getAdminSession();
      if (session?.institution) {
        setFormData((prev) => ({
          ...prev,
          institution: session.institution,
          issuer_organization: session.institution
        }));
      }
    }
    loadInstitute();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateRandomCertNumber = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newId = `CERT-2026-${randomSuffix}`;
    setFormData((prev) => ({ ...prev, certificate_number: newId }));
    toast.info(`Generated ID: ${newId}`);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.certificate_number.trim()) {
      toast.error('Certificate number is required.');
      return;
    }
    if (!formData.student_name.trim()) {
      toast.error('Student name is required.');
      return;
    }
    if (!formData.course.trim()) {
      toast.error('Course/program name is required.');
      return;
    }
    if (!formData.institution.trim()) {
      toast.error('Institution is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      let fileUrl = '';
      if (file) {
        fileUrl = await CertificateService.uploadCertificateFile(file);
      }

      const result = await CertificateService.issueCertificate({
        ...formData,
        file_url: fileUrl
      });

      toast.success('Certificate issued successfully!');
      // Navigate to certificate details page to show the newly generated credential and block!
      navigate(`/details?id=${encodeURIComponent(result.certificate.certificate_number)}`);
    } catch (err) {
      toast.error(err.message || 'Failed to issue certificate.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
            Issue New Certificate
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Register an accredited credential with automated SHA-256 fingerprinting and blockchain ledger link.
          </p>
        </div>

        <button
          type="button"
          onClick={generateRandomCertNumber}
          className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-2 rounded-xl hover:bg-blue-100 transition inline-flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Auto-Generate ID
        </button>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Section 1: Certificate Identification */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            1. Credential Identifiers
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Certificate Number / ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="certificate_number"
                required
                placeholder="e.g. CERT-2026-004"
                value={formData.certificate_number}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Must be unique. Format: CERT-YYYY-XXX
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Certificate Type
              </label>
              <input
                type="text"
                name="certificate_type"
                placeholder="e.g. Bachelor Degree / Professional Diploma"
                value={formData.certificate_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Student Details */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <User className="w-4 h-4" />
            2. Student Recipient Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="student_name"
                required
                placeholder="e.g. Rohan Verma"
                value={formData.student_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Student Email Address
              </label>
              <input
                type="email"
                name="student_email"
                placeholder="e.g. rohan.verma@example.com"
                value={formData.student_email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Course & Institution */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            3. Academic Program & Authority
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Course / Program <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="course"
                required
                placeholder="e.g. Artificial Intelligence & Robotics"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Issuing Institution <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="institution"
                required
                placeholder="e.g. ABC Institute of Technology"
                value={formData.institution}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Issue Date <span className="text-rose-500">*</span>
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
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Signatory & Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Building className="w-4 h-4" />
            4. Signatories & Description
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Issuer / Signatory Name
              </label>
              <input
                type="text"
                name="issuer_name"
                placeholder="e.g. Dr. S. K. Mehta (Registrar)"
                value={formData.issuer_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Issuer Organization
              </label>
              <input
                type="text"
                name="issuer_organization"
                placeholder="e.g. ABC Institute of Technology"
                value={formData.issuer_organization}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Description / Citation
              </label>
              <textarea
                name="description"
                rows="2"
                placeholder="Brief citation or achievement remarks..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Certificate File Upload */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                Attach Certificate File (PDF / Image)
              </label>
              <input
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                onChange={handleFileChange}
                className="w-full px-4 py-2 rounded-xl border border-dashed border-slate-300 text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Computing Hash & Generating Block...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                Issue Certificate
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
