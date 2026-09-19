import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaThLarge,
  FaReceipt,
  FaChartPie,
  FaCalendarAlt,
  FaBullseye,
  FaUsers,
  FaTags,
  FaChartBar,
  FaHistory,
  FaUserCog,
  FaSignOutAlt,
  FaWallet,
  FaBookOpen,
} from 'react-icons/fa';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: FaThLarge },
  { name: 'Transactions', path: '/transactions', icon: FaReceipt },
  { name: 'Budgets', path: '/budgets', icon: FaChartPie },
  { name: 'Recurring Bills', path: '/recurring', icon: FaCalendarAlt },
  { name: 'Savings Goals', path: '/goals', icon: FaBullseye },
  { name: 'Household Sharing', path: '/household', icon: FaUsers },
  { name: 'Reports & Analytics', path: '/reports', icon: FaChartBar },
  { name: 'Categories', path: '/categories', icon: FaTags },
  { name: 'Activity History', path: '/activities', icon: FaHistory },
  { name: 'User Guide & Docs', path: '/guide', icon: FaBookOpen },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'show' : ''}`}>
      {/* Brand Header */}
      <div className="p-4 d-flex align-items-center justify-content-between border-bottom border-light">
        <NavLink to="/" className="text-decoration-none d-flex align-items-center gap-3 text-dark">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
            style={{
              width: '38px',
              height: '38px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
            }}
          >
            <FaWallet size={18} />
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-bold fs-5 text-dark lh-1" style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px' }}>
              FinTrack
            </span>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle py-1 px-2 fw-semibold rounded-pill" style={{ fontSize: '11px', lineHeight: '1' }}>
              PRO
            </span>
          </div>
        </NavLink>
      </div>

      {/* Navigation items */}
      <div className="p-2 py-3 overflow-y-auto" style={{ flex: 1 }}>
        <div className="text-uppercase text-muted fw-bold px-3 mb-2" style={{ fontSize: '0.675rem', letterSpacing: '0.08em' }}>
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={16} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      {/* User profile widget and large prominent logout button at bottom */}
      <div className="p-3 border-top border-light bg-light-subtle">
        <NavLink
          to="/profile"
          onClick={onClose}
          className="d-flex align-items-center gap-2 text-decoration-none text-dark p-2 rounded-3 hover-bg-light transition-all mb-2"
          style={{ background: 'rgba(0,0,0,0.02)' }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="rounded-circle border shadow-sm"
              style={{ width: '38px', height: '38px', objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow-sm"
              style={{ width: '38px', height: '38px', fontSize: '0.9rem', flexShrink: 0 }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="text-truncate flex-grow-1">
            <div className="fw-semibold text-truncate" style={{ fontSize: '0.85rem' }}>
              {user?.name}
            </div>
            <div className="text-muted text-truncate" style={{ fontSize: '0.725rem' }}>
              {user?.email}
            </div>
          </div>
        </NavLink>

        {/* Large prominent Logout Button */}
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 py-2 d-flex align-items-center justify-content-center gap-2 rounded-3 fw-semibold shadow-sm"
          style={{ fontSize: '0.85rem', transition: 'all 0.2s ease-in-out' }}
          title="Sign out of FinTrack"
        >
          <FaSignOutAlt size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
