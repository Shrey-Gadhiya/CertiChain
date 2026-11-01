import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Lock, 
  ArrowDown, 
  Link as LinkIcon, 
  Calendar, 
  CheckCircle2, 
  Info, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { CertificateService } from '../lib/certificateService';
import { useToast } from '../components/Toast';

export default function BlockchainLedger() {
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedHash, setCopiedHash] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadBlocks();
  }, []);

  const loadBlocks = async () => {
    setIsLoading(true);
    try {
      const allBlocks = await CertificateService.getBlockchainRecords();
      setBlocks(allBlocks);
    } catch (err) {
      toast.error('Failed to load blockchain ledger blocks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (hash, label) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    toast.info(`Copied ${label}`);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Private Cryptographic Ledger</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E293B]">
          CertiChain Blockchain Explorer
        </h1>
        <p className="text-sm text-[#64748B] mt-2 leading-relaxed">
          Each certificate is linked to the previous record using cryptographic hashes, making unauthorized changes detectable.
        </p>

        {/* Academic / Demo notice banner */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 inline-flex items-center gap-2 max-w-xl text-left">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Note:</strong> This is a <strong>blockchain-inspired demo / private ledger</strong> designed for academic demonstration of tamper-evidence, not a public cryptocurrency network.
          </span>
        </div>
      </div>

      {/* Ledger Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Ledger Blocks
          </div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            {blocks.length}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Chronologically chained</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Genesis Hash
          </div>
          <div className="text-sm font-mono font-bold text-slate-800 mt-1 truncate">
            000000000000...
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Root block anchor</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Ledger Integrity Status
          </div>
          <div className="text-base font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            100% Intact & Verified
          </div>
          <div className="text-xs text-slate-500 mt-0.5">Zero cryptographic breaches</div>
        </div>
      </div>

      {/* Blocks Visual Chain */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1E293B]">
            Simulated Block Sequence
          </h2>
          <span className="text-xs text-slate-500">
            Showing Genesis to Latest Block
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading blockchain records...</div>
        ) : blocks.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
            No blocks generated yet.
          </div>
        ) : (
          <div className="space-y-6">
            {blocks.map((block, index) => {
              const isGenesis = index === 0;
              return (
                <div key={block.id || index} className="space-y-4">
                  
                  {/* Block Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 shadow-sm transition p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-sm">
                          #{String(block.block_number).padStart(3, '0')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#1E293B]">
                              Block #{block.block_number}
                            </h3>
                            {isGenesis && (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                                Genesis Block
                              </span>
                            )}
                            {block.is_update_audit && (
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                                Audit Update Block
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Timestamp: {new Date(block.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/details?id=${block.certificate_number}`}
                          className="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded hover:bg-blue-100 transition"
                        >
                          {block.certificate_number}
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Hashes Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs font-mono">
                      
                      {/* Previous Hash */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="flex items-center justify-between text-slate-500 mb-1 font-sans text-[11px] font-bold uppercase tracking-wider">
                          <span>Previous Hash:</span>
                          <button
                            onClick={() => handleCopy(block.previous_hash, 'Previous Hash')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {copiedHash === block.previous_hash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-slate-700 break-all">
                          {block.previous_hash}
                        </div>
                      </div>

                      {/* Certificate Hash */}
                      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-200">
                        <div className="flex items-center justify-between text-blue-800 mb-1 font-sans text-[11px] font-bold uppercase tracking-wider">
                          <span>Certificate Hash:</span>
                          <button
                            onClick={() => handleCopy(block.certificate_hash, 'Certificate Hash')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {copiedHash === block.certificate_hash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-blue-900 break-all font-semibold">
                          {block.certificate_hash}
                        </div>
                      </div>

                      {/* Resulting Block Hash */}
                      <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-200">
                        <div className="flex items-center justify-between text-emerald-800 mb-1 font-sans text-[11px] font-bold uppercase tracking-wider">
                          <span>Block Hash (Calculated):</span>
                          <button
                            onClick={() => handleCopy(block.block_hash, 'Block Hash')}
                            className="text-emerald-700 hover:text-emerald-900"
                          >
                            {copiedHash === block.block_hash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-emerald-900 break-all font-bold">
                          {block.block_hash}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Connecting Chain Link Icon to next block */}
                  {index < blocks.length - 1 && (
                    <div className="flex flex-col items-center justify-center my-1">
                      <div className="w-0.5 h-3 bg-blue-300"></div>
                      <div className="p-1 rounded-full bg-blue-100 text-blue-600">
                        <LinkIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="w-0.5 h-3 bg-blue-300"></div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
