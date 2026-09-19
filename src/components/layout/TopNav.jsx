import React from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaPlus, FaCoins, FaUser, FaBookOpen, FaSignOutAlt } from 'react-icons/fa';

const routeTitles = {
  '/dashboard': 'Dashboard Overview',
  '/transactions': 'Transaction Records',
  '/budgets': 'Budget Planning',
  '/recurring': 'Recurring & Subscriptions',
  '/goals': 'Financial Goals',
  '/household': 'Household & Shared Expenses',
  '/reports': 'Financial Reports & Analytics',
  '/categories': 'Category Management',
  '/activities': 'Activity & Audit Log',
  '/profile': 'Account Settings',
  '/guide': 'User Guide & Instructions',
};

const TopNav = ({ onToggleSidebar, onOpenNewTransaction }) => {
  const location = useLocation();
  const { user, currency, logout } = useAuth();

  const currentTitle = routeTitles[location.pathname] || 'FinTrack';
  const isGuide = location.pathname === '/guide';
  const isProfile = location.pathname === '/profile';

  return (
    <header className="topbar topbar-glass d-flex align-items-center justify-content-between px-3 px-md-4 sticky-top">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-light d-lg-none p-2 rounded-3 border d-flex align-items-center justify-content-center shadow-sm"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <FaBars size={16} />
        </button>
        <div>
          <div className="d-flex align-items-center gap-2">
            <h4 className="mb-0 fs-5 fw-bold text-dark">{currentTitle}</h4>
            <span className="badge bg-light text-secondary border px-2 py-1 rounded-pill d-none d-md-inline-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
              <span className="pulse-dot"></span>
              <span>Live Ledger</span>
            </span>
          </div>
          <span className="text-muted d-none d-sm-inline" style={{ fontSize: '0.775rem' }}>
            Welcome back, <strong className="text-dark fw-semibold">{user?.name || 'User'}</strong>
          </span>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 gap-md-3">
        {/* Currency Badge */}
        <div
          className="d-flex align-items-center gap-1 border px-2 py-1 rounded-pill fw-semibold"
          style={{
            fontSize: '0.75rem',
            backgroundColor: '#fffbeb',
            borderColor: '#fde68a',
            color: '#b45309',
          }}
          title={`Default Display Currency: ${currency}`}
        >
          <FaCoins className="text-warning" size={12} />
          <span>{currency}</span>
        </div>

        {/* Global Quick "+ Add Transaction" button */}
        <button
          onClick={onOpenNewTransaction}
          className="btn d-flex align-items-center gap-2 py-2 px-3 rounded-3 text-white fw-semibold shadow-sm"
          style={{
            fontSize: '0.825rem',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            border: 'none',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          }}
        >
          <FaPlus size={11} />
          <span className="d-none d-sm-inline">Add Transaction</span>
        </button>

        {/* User Guide Link icon */}
        <NavLink
          to="/guide"
          className={`btn rounded-pill px-3 py-2 gap-1 border d-flex align-items-center justify-content-center transition-all ${
            isGuide
              ? 'btn-primary text-white shadow-sm border-primary'
              : 'btn-light text-muted hover-text-dark'
          }`}
          // style={{ width: '38px', height: '38px' }}
          title="User Guide & Documentation"
        >
          <FaBookOpen size={14} />
          <span className="d-none d-sm-inline">User Guide</span>
        </NavLink>

        {/* Profile Link icon */}
        <NavLink
          to="/profile"
          className={`btn rounded-pill px-3 py-2 gap-1 border d-flex align-items-center justify-content-center transition-all ${
            isProfile
              ? 'btn-primary text-white shadow-sm border-primary'
              : 'btn-light text-muted hover-text-dark'
          }`}
          // style={{ width: '38px', height: '38px' }}
          title="Profile & Settings"
        >
          <FaUser size={14} />
          <span className="d-none d-sm-inline">Profile</span>
        </NavLink>

        {/* Prominent Log Out button */}
        <button
          onClick={logout}
          className="btn btn-outline-danger d-flex align-items-center gap-1 px-3 py-2 rounded-pill fw-semibold shadow-xs"
          style={{ fontSize: '0.8rem', borderColor: '#fca5a5' }}
          title="Sign out of FinTrack"
        >
          <FaSignOutAlt size={13} />
          <span className="d-none d-sm-inline">Log Out</span>
        </button>
      </div>
    </header>
  );
};

export default TopNav;
