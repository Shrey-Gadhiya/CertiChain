import React from 'react';
import { ShieldCheck, Lock, Cpu, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E2E8F0] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-[#1E293B]">
                Certi<span className="text-[#2563EB]">Chain</span>
              </span>
            </div>
            <p className="text-sm text-[#64748B] max-w-md leading-relaxed">
              <strong>CertiChain — Secure Digital Certificate Verification</strong>.
              A lightweight certificate verification system utilizing SHA-256 cryptographic hashes and simulated immutable blockchain records to prevent credential forgery.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs text-slate-600 font-medium">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Built as an academic mini project.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">
                  Verify Certificate
                </Link>
              </li>
              <li>
                <Link to="/details" className="hover:text-blue-600 transition-colors">
                  Certificate Details
                </Link>
              </li>
              <li>
                <Link to="/upload" className="hover:text-blue-600 transition-colors">
                  Upload Certificate
                </Link>
              </li>
              <li>
                <Link to="/ledger" className="hover:text-blue-600 transition-colors">
                  Blockchain Ledger
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1E293B] mb-3">
              Security & Tech
            </h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>SHA-256 Digesting</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                <span>PostgreSQL & Supabase</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                <span>Immutable Block Chain Link</span>
              </li>
              <li>
                <Link to="/admin/login" className="text-blue-600 font-medium hover:underline">
                  Admin Portal &rarr;
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between text-xs text-[#64748B] gap-3">
          <p>© {new Date().getFullYear()} CertiChain — Academic Mini Project PBL. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Lightweight Blockchain-Style Verification</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">Pure Web Crypto API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
