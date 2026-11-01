import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  History, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Layers, 
  Menu, 
  X,
  User,
  Database
} from 'lucide-react';
import { CertificateService } from '../lib/certificateService';
import { useToast } from './Toast';

export default function AdminLayout({ children }) {
  const [adminUser, setAdminUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const isLive = CertificateService.isLiveSupabase();

  useEffect(() => {
    async function verifySession() {
      const user = await CertificateService.getAdminSession();
      if (!user) {
        setAdminUser(null);
      } else {
        setAdminUser(user);
      }
      setCheckingAuth(false);
    }
    verifySession();
  }, []);

  const handleLogout = async () => {
    await CertificateService.adminLogout();
    toast.info('Logged out from admin panel');
    navigate('/admin/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Issue Certificate', path: '/admin/issue', icon: PlusCircle },
    { label: 'All Certificates', path: '/admin/certificates', icon: FileText },
    { label: 'Verification Logs', path: '/admin/logs', icon: History },
    { label: 'Blockchain Ledger', path: '/ledger', icon: Layers },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-slate-500 font-medium">Verifying administrator session...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      
      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <span className="font-bold text-slate-800">CertiChain Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#E2E8F0] transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-100'
        }`}
      >
        <div className="h-full flex flex-col justify-between p-4">
          
          <div className="space-y-6">
            {/* Sidebar Brand */}
            <div className="px-2 pt-2 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-[#1E293B]">
                  Certi<span className="text-[#2563EB]">Chain</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Admin Portal
                </span>
              </div>
            </div>

            {/* Admin Badge with Institution */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {adminUser?.user_metadata?.full_name || 'Administrator'}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {adminUser?.email || 'admin@certichain.org'}
                  </p>
                </div>
              </div>
              <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                <span className="font-semibold text-blue-700 truncate max-w-[130px]" title={adminUser?.institution || 'ABC Institute of Technology'}>
                  {adminUser?.institution || 'ABC Institute of Tech'}
                </span>
                <span className="font-mono text-slate-500 shrink-0 font-medium">
                  {adminUser?.institution_code || 'INST-2026-IT'}
                </span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="px-2 flex items-center gap-1.5 text-xs text-slate-500">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>{isLive ? 'Supabase Database' : 'Mock DB (localStorage)'}</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 z-30 md:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl">
        {children || <Outlet />}
      </main>

    </div>
  );
}
