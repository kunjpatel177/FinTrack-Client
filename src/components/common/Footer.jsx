import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaWallet,
  FaShieldAlt,
  FaCheck,
  FaArrowRight,
  FaGithub,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';

const Footer = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <footer className="footer-enterprise">
      {/* Top 2px Multi-Stop Accent Line */}
      <div className="footer-top-accent-line"></div>

      {/* Main Footer Container */}
      <div className="container px-md-3 pt-5 pb-4" style={{ maxWidth: '1385px' }}>
        <div className="row g-4 g-lg-5 mb-4">
          {/* Column 1: Brand & Identity (col-12 col-md-6 col-lg-3) */}
          <div className="col-12 col-md-6 col-lg-3">
            {/* Brand Logo */}
            <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
                style={{
                  width: '38px',
                  height: '38px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                }}
              >
                <FaWallet size={18} />
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="footer-brand-title">FinTrack</span>
                <span
                  className="badge rounded-pill fw-semibold"
                  style={{
                    fontSize: '0.65rem',
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '0.2rem 0.5rem',
                    letterSpacing: '0.04em',
                  }}
                >
                  PRO
                </span>
              </div>
            </Link>

            {/* Concise Mission Statement */}
            <p className="small mb-3" style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '320px' }}>
              Production-grade personal and household wealth platform engineered with double-entry banking mathematics and shared ledger workspaces.
            </p>

            {/* System Status Pill */}
            <div
              className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-3"
              style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                  display: 'inline-block',
                }}
              ></span>
              <span className="fw-medium" style={{ fontSize: '0.725rem', color: '#34d399' }}>
                All Systems Operational • 99.99%
              </span>
            </div>

            {/* Currencies line */}
            <div className="mb-3 small" style={{ color: '#64748b', fontSize: '0.775rem' }}>
              <span>Currencies: </span>
              <span style={{ color: '#cbd5e1' }}>INR (₹)</span> • <span style={{ color: '#cbd5e1' }}>USD ($)</span> • <span style={{ color: '#cbd5e1' }}>EUR (€)</span> • <span style={{ color: '#cbd5e1' }}>GBP (£)</span>
            </div>

            {/* Social Icons */}
            <div className="d-flex align-items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                title="GitHub"
                aria-label="GitHub"
              >
                <FaGithub size={15} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                title="Twitter"
                aria-label="Twitter"
              >
                <FaTwitter size={14} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={14} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation (Left side of Platform) (col-6 col-sm-4 col-md-3 col-lg-2) */}
          <div className="col-6 col-sm-4 col-md-3 col-lg-2">
            <div className="footer-nav-heading">Navigation</div>
            <ul className="footer-nav-list">
              <li>
                <Link to="/" className="footer-nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="footer-nav-link">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/guide" className="footer-nav-link">
                  User Guide
                </Link>
              </li>
              <li>
                <Link to="/login" className="footer-nav-link">
                  Log In
                </Link>
              </li>
              <li>
                <Link to="/register" className="footer-nav-link">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Engines (col-6 col-sm-4 col-md-3 col-lg-2) */}
          <div className="col-6 col-sm-4 col-md-3 col-lg-2">
            <div className="footer-nav-heading">Platform</div>
            <ul className="footer-nav-list">
              <li>
                <Link to="/features" className="footer-nav-link">
                  Net Balance Engine
                </Link>
              </li>
              <li>
                <Link to="/features" className="footer-nav-link">
                  Transactions & Incomes
                </Link>
              </li>
              <li>
                <Link to="/features" className="footer-nav-link">
                  Category Budgets
                </Link>
              </li>
              <li>
                <Link to="/features" className="footer-nav-link">
                  Milestone Goals
                </Link>
              </li>
              <li>
                <Link to="/features" className="footer-nav-link">
                  Recurring Subscriptions
                </Link>
              </li>
              <li>
                <Link to="/features" className="footer-nav-link">
                  Household Sharing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Resources & Docs (col-6 col-sm-4 col-md-3 col-lg-2) */}
          <div className="col-6 col-sm-4 col-md-3 col-lg-2">
            <div className="footer-nav-heading">Resources</div>
            <ul className="footer-nav-list">
              <li>
                <Link to="/guide" className="footer-nav-link text-white fw-semibold">
                  Master User Guide
                </Link>
              </li>
              <li>
                <Link to="/features" className="footer-nav-link">
                  50/30/20 Simulator
                </Link>
              </li>
              <li>
                <Link to="/features" className="footer-nav-link">
                  Reconciliation Guide
                </Link>
              </li>
              <li>
                <Link to="/features" className="footer-nav-link">
                  Tax-Ready CSV Export
                </Link>
              </li>
              <li>
                <button
                  onClick={() => navigate('/login?demo=true')}
                  className="btn btn-link p-0 text-start footer-nav-link"
                  style={{ border: 'none', background: 'transparent' }}
                >
                  Interactive Demo
                </button>
              </li>
              <li>
                <Link to="/features" className="footer-nav-link">
                  Cash Flow Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Security & Privacy (col-12 col-md-6 col-lg-3) */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="footer-nav-heading">Security & Trust</div>
            <div className="footer-security-card">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-success"
                  style={{ width: '22px', height: '22px', background: 'rgba(16, 185, 129, 0.12)' }}
                >
                  <FaShieldAlt size={11} />
                </div>
                <span className="fw-semibold text-white" style={{ fontSize: '0.825rem' }}>
                  Banking-Grade Infrastructure
                </span>
              </div>

              <div className="d-flex flex-column gap-1 mb-3" style={{ fontSize: '0.775rem', color: '#94a3b8' }}>
                <div className="d-flex align-items-center gap-2 mt-1">
                  <FaCheck size={10} className="text-success flex-shrink-0" />
                  <span>256-Bit Bcrypt Encryption & Zero Tracking</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaCheck size={10} className="text-info flex-shrink-0" />
                  <span>Autonomous TOTP & Email OTP MFA</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <FaCheck size={10} className="text-primary flex-shrink-0" />
                  <span>Absolute Zero Data Monetization Guarantee</span>
                </div>
              </div>

              <div>
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="btn btn-sm w-100 rounded-pill py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      border: 'none',
                    }}
                  >
                    <span>Open Dashboard</span>
                    <FaArrowRight size={10} />
                  </Link>
                ) : (
                  <Link
                    to="/register"
                    className="btn btn-sm w-100 rounded-pill py-2 fw-semibold d-inline-flex align-items-center justify-content-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      border: 'none',
                    }}
                  >
                    <span>Create Free Account</span>
                    <FaArrowRight size={10} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Minimalist Bar without links */}
        <div className="footer-bottom-row d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 pt-4">
          <div className="text-center text-md-start">
            &copy; {new Date().getFullYear()} FinTrack Platform. Engineered for absolute financial clarity.
          </div>

          <div className="text-center text-md-end small" style={{ color: '#64748b' }}>
            <span>Double-Entry Standard</span>
            <span className="mx-2" style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>
            <span>Zero Data Monetization</span>
            <span className="mx-2" style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>
            <span>256-Bit Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
