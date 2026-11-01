import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Layers, FileSearch, Upload, LogIn, LayoutDashboard, LogOut, Menu, X, Database } from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import { useToast } from './Toast';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const isLive = CertificateService.isLiveSupabase();

  useEffect(() => {
    async function checkAuth() {
      const user = await CertificateService.getAdminSession();
      setAdminUser(user);
    }
    checkAuth();
  }, [location.pathname]);

  const handleLogout = async () => {
    await CertificateService.adminLogout();
    setAdminUser(null);
    toast.info('Logged out from Admin session');
    navigate('/');
  };

  const navLinks = [
    { label: 'Verify Certificate', path: '/', icon: ShieldCheck },
    { label: 'Certificate Details', path: '/details', icon: FileSearch },
    { label: 'Upload & Verify', path: '/upload', icon: Upload },
    { label: 'Blockchain Ledger', path: '/ledger', icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#1E293B]">
                Certi<span className="text-[#2563EB]">Chain</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                PBL Demo
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Backend Indicator */}
            <div
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${
                isLive
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
              title={isLive ? 'Connected to live Supabase backend' : 'Running in local demo mode (localStorage simulated DB)'}
            >
              <Database className="w-3 h-3" />
              <span>{isLive ? 'Supabase Live' : 'Demo DB Mode'}</span>
            </div>

            {/* Admin Link / Status */}
            {adminUser ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium bg-[#2563EB] text-white hover:bg-blue-700 transition shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border border-[#E2E8F0] text-[#1E293B] hover:bg-slate-50 transition"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 text-blue-600" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center gap-1.5 text-xs px-3 py-1.5 text-slate-500">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              <span>Backend: {isLive ? 'Supabase Connected' : 'Demo Local Storage Mode'}</span>
            </div>

            {adminUser ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#2563EB] text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-rose-600 border border-rose-200 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <LogIn className="w-4 h-4" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
