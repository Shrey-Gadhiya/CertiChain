import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  PlusCircle, 
  FileText, 
  History, 
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Search,
  RefreshCw
} from 'lucide-react';
import { CertificateService } from '../lib/certificateService';

export default function AdminDashboard() {
  const [certs, setCerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [adminSession, setAdminSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allCerts, allLogs, allBlocks, session] = await Promise.all([
        CertificateService.getAllCertificates(),
        CertificateService.getVerificationLogs(),
        CertificateService.getBlockchainRecords(),
        CertificateService.getAdminSession()
      ]);
      setCerts(allCerts);
      setLogs(allLogs);
      setBlocks(allBlocks);
      setAdminSession(session);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute Statistics
  const totalCerts = certs.length;
  const verifiedActive = certs.filter(c => c.status === 'active').length;
  const revokedCerts = certs.filter(c => c.status === 'revoked').length;
  const expiredCerts = certs.filter(c => c.status === 'expired').length;

  const statCards = [
    {
      label: 'Total Certificates',
      value: totalCerts,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: FileCheck,
      desc: 'All registered credentials'
    },
    {
      label: 'Verified / Active',
      value: verifiedActive,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: CheckCircle2,
      desc: 'Authentic valid certificates'
    },
    {
      label: 'Expired Certificates',
      value: expiredCerts,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: AlertTriangle,
      desc: 'Exceeded validity timeframe'
    },
    {
      label: 'Revoked Certificates',
      value: revokedCerts,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      icon: XCircle,
      desc: 'Officially invalidated'
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading administrator dashboard metrics...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
            Administrator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Overview of issued credentials, blockchain ledger integrity, and student verification attempts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/issue"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Issue Certificate
          </Link>
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition"
          >
            <ExternalLink className="w-4 h-4" />
            Public View
          </Link>
        </div>
      </div>

      {/* Active Institutional Node Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-blue-600/10 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Active Institutional Authority Node
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                {adminSession?.institution_code || 'INST-2026-IT'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {adminSession?.institution || 'ABC Institute of Technology'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {adminSession?.institution_department || 'Office of Controller of Examinations & Academic Credential Records'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">AISHE Code</span>
              <span className="font-mono font-bold text-white mt-0.5 block">{adminSession?.institution_aishe || 'C-41235'}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Authorized Officer</span>
              <span className="font-bold text-white mt-0.5 block">{adminSession?.user_metadata?.full_name || 'Dr. S. K. Mehta'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl border ${card.border} p-5 shadow-xs hover:shadow-sm transition`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  {card.label}
                </span>
                <div className={`w-9 h-9 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className={`text-3xl font-extrabold ${card.color} mt-3`}>
                {card.value}
              </div>
              <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recent Certificates & Verification Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Recent Certificates */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">
                Recently Issued Certificates
              </h2>
              <p className="text-xs text-[#64748B]">Showing newest registered student certificates</p>
            </div>
            <Link
              to="/admin/certificates"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              View All ({certs.length}) &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-3">Certificate ID</th>
                  <th className="pb-3">Student Name</th>
                  <th className="pb-3">Course / Institution</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certs.slice(0, 5).map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 font-mono font-bold text-blue-600">
                      {cert.certificate_number}
                    </td>
                    <td className="py-3 font-semibold text-slate-800">
                      {cert.student_name}
                    </td>
                    <td className="py-3 text-slate-600">
                      <div className="truncate max-w-[180px]">{cert.course}</div>
                      <div className="text-[10px] text-slate-400">{cert.institution}</div>
                    </td>
                    <td className="py-3">
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
                    <td className="py-3 text-right">
                      <Link
                        to={`/admin/edit/${cert.id}`}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Recent Verification Activity */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-[#1E293B]">
                Verification Logs
              </h2>
              <p className="text-xs text-[#64748B]">Real-time query audits ({logs.length})</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadData}
                className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                title="Refresh logs from Supabase"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <Link
                to="/admin/logs"
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                All Logs &rarr;
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No verification logs yet</p>
            ) : (
              logs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800 truncate">
                      {log.certificate_number}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      log.result === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {log.result}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{log.reason}</p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
