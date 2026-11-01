import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Verify from './pages/Verify';
import CertificateDetails from './pages/CertificateDetails';
import UploadPage from './pages/UploadPage';
import BlockchainLedger from './pages/BlockchainLedger';
import AdminLogin from './pages/AdminLogin';

// Admin Components & Pages
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import IssueCertificate from './pages/IssueCertificate';
import AllCertificates from './pages/AllCertificates';
import EditCertificate from './pages/EditCertificate';
import VerificationLogs from './pages/VerificationLogs';
import AdminSettings from './pages/AdminSettings';

// Public Layout Wrapper
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#1E293B]">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
        <Routes>
          
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/verify" element={<PublicLayout><Verify /></PublicLayout>} />
          <Route path="/details" element={<PublicLayout><CertificateDetails /></PublicLayout>} />
          <Route path="/upload" element={<PublicLayout><UploadPage /></PublicLayout>} />
          <Route path="/ledger" element={<PublicLayout><BlockchainLedger /></PublicLayout>} />
          <Route path="/admin/login" element={<PublicLayout><AdminLogin /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/issue" element={<AdminLayout><IssueCertificate /></AdminLayout>} />
          <Route path="/admin/certificates" element={<AdminLayout><AllCertificates /></AdminLayout>} />
          <Route path="/admin/edit/:id" element={<AdminLayout><EditCertificate /></AdminLayout>} />
          <Route path="/admin/logs" element={<AdminLayout><VerificationLogs /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </ToastProvider>
    </ErrorBoundary>
  );
}
