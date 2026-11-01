import React, { useState, useEffect } from 'react';
import { History, Search, RefreshCw, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import { useToast } from '../components/Toast';

export default function VerificationLogs() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const data = await CertificateService.getVerificationLogs();
      setLogs(data);
    } catch (err) {
      toast.error('Failed to load verification logs');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const cert = (log.certificate_number || '').toLowerCase();
    const reason = (log.reason || '').toLowerCase();
    const result = (log.result || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    return cert.includes(query) || reason.includes(query) || result.includes(query);
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B]">
            Verification Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Real-time audit log of all certificate verification queries performed on CertiChain.
          </p>
        </div>

        <button
          onClick={loadLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Logs
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 flex items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by certificate ID, result, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <span className="text-xs text-slate-400">
          Total Recorded: {logs.length}
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading verification audit logs...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No verification records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Certificate ID</th>
                  <th className="py-3 px-4">Verification Result</th>
                  <th className="py-3 px-4">Audit Reason / Detail</th>
                  <th className="py-3 px-4">Hash Checked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => {
                  let badge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {log.result}
                    </span>
                  );

                  if (log.result === 'verified') {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    );
                  } else if (log.result === 'failed') {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 flex items-center gap-1 w-max">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        Failed
                      </span>
                    );
                  } else if (log.result === 'revoked') {
                    badge = (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-900 border border-rose-200 flex items-center gap-1 w-max">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Revoked
                      </span>
                    );
                  }

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                        {log.certificate_number}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {badge}
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                        {log.reason || 'Verification check'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {log.hash_checked ? `${log.hash_checked.substring(0, 16)}...` : 'None (Lookup Failed)'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
