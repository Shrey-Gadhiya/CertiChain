import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  PlusCircle, 
  Edit3, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import { useToast } from '../components/Toast';

export default function AllCertificates() {
  const [certs, setCerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setIsLoading(true);
    try {
      const data = await CertificateService.getAllCertificates();
      setCerts(data);
    } catch (err) {
      toast.error('Failed to load certificates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRevoke = async (cert) => {
    if (cert.status === 'revoked') {
      toast.info('Certificate is already revoked.');
      return;
    }

    if (window.confirm(`Are you sure you want to officially REVOKE certificate ${cert.certificate_number} for ${cert.student_name}?`)) {
      try {
        await CertificateService.revokeCertificate(cert.id, 'Revoked by admin via management table');
        toast.warning(`Revoked certificate ${cert.certificate_number}`);
        loadCertificates();
      } catch (err) {
        toast.error('Failed to revoke certificate');
      }
    }
  };

  const handleCopyHash = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    toast.info('Hash copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCerts = certs.filter((cert) => {
    const matchesSearch =
      cert.certificate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.institution.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
            All Registered Certificates
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage official certificates, inspect cryptographic signatures, and adjust validity statuses.
          </p>
        </div>

        <Link
          to="/admin/issue"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          Issue New Certificate
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID, student, course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">All ({certs.length})</option>
            <option value="active">Active ({certs.filter(c => c.status === 'active').length})</option>
            <option value="revoked">Revoked ({certs.filter(c => c.status === 'revoked').length})</option>
            <option value="expired">Expired ({certs.filter(c => c.status === 'expired').length})</option>
          </select>
          <button
            onClick={loadCertificates}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading certificate registry...</div>
        ) : filteredCerts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No certificates match the selected query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Course & Institution</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Hash</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCerts.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                      {cert.certificate_number}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {cert.student_name}
                      {cert.student_email && (
                        <div className="text-[10px] text-slate-400 font-normal">{cert.student_email}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-slate-800">{cert.course}</div>
                      <div className="text-[10px] text-slate-400">{cert.institution}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {cert.issue_date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        cert.status === 'revoked'
                          ? 'bg-rose-100 text-rose-800'
                          : cert.status === 'expired'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {cert.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      <button
                        onClick={() => handleCopyHash(cert.certificate_hash, cert.id)}
                        className="flex items-center gap-1 hover:text-blue-600"
                        title={cert.certificate_hash}
                      >
                        {copiedId === cert.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{cert.certificate_hash.substring(0, 8)}...</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                      <Link
                        to={`/details?id=${cert.certificate_number}`}
                        className="text-xs font-semibold text-slate-600 hover:text-blue-600"
                        title="View Full Public Credential"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/edit/${cert.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      {cert.status !== 'revoked' && (
                        <button
                          onClick={() => handleQuickRevoke(cert)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                          title="Revoke certificate"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
