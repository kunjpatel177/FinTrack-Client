import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import TransactionFormModal from '../transactions/TransactionFormModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { FaExclamationTriangle, FaPaperPlane } from 'react-icons/fa';

const AppLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isNewTxModalOpen, setIsNewTxModalOpen] = useState(false);
  const [newTxDefaultType, setNewTxDefaultType] = useState('expense');
  const [refreshKey, setRefreshKey] = useState(0);
  const [resendingVerification, setResendingVerification] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  const openNewTransaction = (type = 'expense') => {
    setNewTxDefaultType(type);
    setIsNewTxModalOpen(true);
  };

  const triggerGlobalRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleTransactionCreated = () => {
    triggerGlobalRefresh();
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    try {
      const res = await api.post('/auth/resend-verification', { email: user?.email });
      toast.success(res.data.message || 'Verification email dispatched!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend verification email');
    } finally {
      setResendingVerification(false);
    }
  };

  return (
    <div className="app-container">
      {/* Mobile Sidebar backdrop */}
      {sidebarOpen && <div className="sidebar-backdrop d-lg-none" onClick={closeSidebar} />}

      {/* Responsive Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        <TopNav
          onToggleSidebar={toggleSidebar}
          onOpenNewTransaction={() => openNewTransaction('expense')}
        />

        {/* Unverified Email Warning Banner */}
        {user && !user.isEmailVerified && (
          <div
            className="alert alert-warning border-0 rounded-0 mb-0 py-2 px-3 d-flex flex-wrap align-items-center justify-content-between gap-2 shadow-sm"
            style={{ backgroundColor: '#fffbeb', borderBottom: '1px solid #fef3c7' }}
          >
            <div className="d-flex align-items-center gap-2 small text-dark">
              <FaExclamationTriangle className="text-warning flex-shrink-0" />
              <span>
                <strong>Email Not Verified:</strong> Please check your inbox at <strong>{user.email}</strong> to activate your account.
              </span>
            </div>
            <button
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="btn btn-sm btn-outline-dark py-1 px-3 fw-medium d-inline-flex align-items-center gap-1"
              style={{ fontSize: '0.75rem' }}
            >
              <FaPaperPlane size={10} />
              <span>{resendingVerification ? 'Sending...' : 'Resend Verification Email'}</span>
            </button>
          </div>
        )}

        <main className="page-body">
          <Outlet
            context={{
              openNewTransaction,
              refreshKey,
              handleTransactionCreated,
              triggerGlobalRefresh,
            }}
          />
        </main>
      </div>

      {/* Global Transaction Modal */}
      <TransactionFormModal
        isOpen={isNewTxModalOpen}
        onClose={() => setIsNewTxModalOpen(false)}
        onSuccess={handleTransactionCreated}
        defaultType={newTxDefaultType}
      />
    </div>
  );
};

export default AppLayout;
