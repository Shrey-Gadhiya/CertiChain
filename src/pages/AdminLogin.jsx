import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  KeyRound, 
  Eye, 
  EyeOff, 
  Phone, 
  MapPin, 
  BadgeCheck,
  Building,
  Shield
} from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import { useToast } from '../components/Toast';

const REGISTERED_INSTITUTIONS = [
  {
    id: 'abc-tech',
    name: 'ABC Institute of Technology',
    code: 'INST-2026-IT',
    aishe: 'C-41235',
    type: 'Autonomous Engineering Institute',
    accreditation: "AICTE Approved • NAAC 'A+' Grade",
    department: 'Office of Controller of Examinations',
    officer: 'Dr. S. K. Mehta (Registrar)',
    email: 'admin@certichain.org',
    phone: '+91 (011) 2876-4321',
    address: 'Sector 62, Institutional Area, Knowledge Park',
    established: '1998'
  },
  {
    id: 'xyz-univ',
    name: 'XYZ University',
    code: 'XYZ-UNIV-99',
    aishe: 'U-0421',
    type: 'Central University',
    accreditation: "UGC Recognized • NAAC 'A++' Grade",
    department: 'Directorate of Academic Credentials',
    officer: 'Prof. Ananya Sen (Dean)',
    email: 'admin@certichain.org',
    phone: '+91 (022) 2654-8900',
    address: 'University Campus, Vidya Vihar',
    established: '1976'
  },
  {
    id: 'tech-acad',
    name: 'Tech Academy',
    code: 'TECH-ACAD-01',
    aishe: 'VOC-883',
    type: 'Technical Specialization Board',
    accreditation: 'ISO 9001:2015 Certified • Skill India',
    department: 'Digital Certification & Ledger Node',
    officer: 'Director Neha Verma',
    email: 'admin@certichain.org',
    phone: '+91 (080) 4112-7600',
    address: 'Electronic City Phase II, Tech Corridor',
    established: '2015'
  }
];

export default function AdminLogin() {
  const [selectedInstituteId, setSelectedInstituteId] = useState('abc-tech');
  const [customInstituteName, setCustomInstituteName] = useState('');
  const [customInstituteCode, setCustomInstituteCode] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [email, setEmail] = useState('admin@certichain.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const currentInstitution = isCustom
    ? {
        id: 'custom',
        name: customInstituteName || 'Custom Educational Institute',
        code: customInstituteCode || 'INST-CUSTOM-01',
        aishe: 'NA',
        type: 'Affiliated Academic Institution',
        accreditation: 'Institutional Digital Authority Node',
        department: 'Examination & Certification Cell',
        officer: 'Institutional Administrator',
        email: email || 'admin@certichain.org',
        phone: '+91 (000) 0000-0000',
        address: 'Main Campus',
        established: '2026'
      }
    : REGISTERED_INSTITUTIONS.find((inst) => inst.id === selectedInstituteId) || REGISTERED_INSTITUTIONS[0];

  const handleSelectInstitution = (instId) => {
    if (instId === 'custom') {
      setIsCustom(true);
      setSelectedInstituteId('custom');
    } else {
      setIsCustom(false);
      setSelectedInstituteId(instId);
      const chosen = REGISTERED_INSTITUTIONS.find((i) => i.id === instId);
      if (chosen) {
        setEmail(chosen.email);
        setPassword('admin123');
      }
    }
  };

  const handleFillDemo = () => {
    setIsCustom(false);
    setSelectedInstituteId('abc-tech');
    setEmail('admin@certichain.org');
    setPassword('admin123');
    toast.info('Pre-filled ABC Institute administrator credentials.');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }

    if (isCustom && !customInstituteName.trim()) {
      toast.error('Please enter your Institute Name.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await CertificateService.adminLogin(email, password, {
        name: currentInstitution.name,
        code: currentInstitution.code,
        aishe: currentInstitution.aishe,
        accreditation: currentInstitution.accreditation,
        department: currentInstitution.department
      });

      if (res.success) {
        toast.success(`Welcome back! Authenticated as ${currentInstitution.name} Authority.`);
        navigate('/admin');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Top Breadcrumb & Return Nav */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          &larr; Back to Public Verification Portal
        </Link>
        <button
          type="button"
          onClick={handleFillDemo}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
          title="Click to automatically fill demo institutional credentials"
        >
          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
          ⚡ Quick Fill Demo Login
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Official Institute Details Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 space-y-6 relative overflow-hidden">
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500"></div>

            {/* Institution Header */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  <BadgeCheck className="w-3 h-3 text-blue-600" />
                  Verified Institute Portal
                </div>
                <h2 className="text-xl font-extrabold text-[#1E293B] mt-1.5 leading-snug">
                  {currentInstitution.name}
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5 font-medium">
                  {currentInstitution.department}
                </p>
              </div>
            </div>

            {/* Institute Meta Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Institute Code
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 mt-0.5 block">
                  {currentInstitution.code}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  AISHE Code
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-slate-800 mt-0.5 block">
                  {currentInstitution.aishe}
                </span>
              </div>
            </div>

            {/* Institution Detailed Breakdown */}
            <div className="space-y-3.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
              <div className="flex items-start gap-2.5">
                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Accreditation & Affiliation:</strong>
                  <span>{currentInstitution.accreditation}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Issuing Authority / Registrar:</strong>
                  <span>{currentInstitution.officer}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Campus Address:</strong>
                  <span>{currentInstitution.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 block">Examination Cell Helpline:</strong>
                  <span>{currentInstitution.phone}</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Trust Seal */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-slate-800 block">SHA-256 Ledger Authority Node</span>
                <span className="text-slate-500">Cryptographically connected to private blockchain network.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Institutional Admin Login Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
                  Institutional Admin Sign In
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1.5">
                Authenticate your institutional officer credentials to issue, revoke, or inspect student credentials.
              </p>
            </div>

            {/* Institution Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                Select Academic Institution
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {REGISTERED_INSTITUTIONS.map((inst) => {
                  const isSelected = !isCustom && selectedInstituteId === inst.id;
                  return (
                    <button
                      key={inst.id}
                      type="button"
                      onClick={() => handleSelectInstitution(inst.id)}
                      className={`p-3 text-left rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold truncate">{inst.name}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">{inst.code}</div>
                    </button>
                  );
                })}
              </div>

              {/* Option to toggle custom institution */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleSelectInstitution(isCustom ? 'abc-tech' : 'custom')}
                  className="text-blue-600 hover:text-blue-800 font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Building className="w-3.5 h-3.5" />
                  {isCustom ? '← Choose from Registered Institutes' : '+ Enter Other / Custom Institute Details'}
                </button>
              </div>
            </div>

            {/* Custom Institute Details Input (if custom selected) */}
            {isCustom && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Custom Institute Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Government Engineering College"
                      value={customInstituteName}
                      onChange={(e) => setCustomInstituteName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Institute / AISHE Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GEC-2026-IT"
                      value={customInstituteCode}
                      onChange={(e) => setCustomInstituteCode(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Login Credentials Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                  Authorized Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="admin@certichain.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span>Remember selected institution</span>
                </label>
                <span className="font-mono text-[11px] text-slate-400">
                  Node: {currentInstitution.code}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating Institutional Credentials...</span>
                ) : (
                  <>
                    <span>Sign In to {currentInstitution.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Notice */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-slate-400">
                Authorized Personnel Only • All login attempts and digital signatures are cryptographically logged.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
