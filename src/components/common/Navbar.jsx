import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaWallet, FaArrowRight } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isFeatures = location.pathname === '/features';
  const isGuide = location.pathname === '/guide';

  return (
    <header className="public-navbar-glass py-3 px-3 px-md-5 sticky-top z-3">
      <div
        className="container-fluid px-0 d-flex align-items-center justify-content-between"
        style={{ maxWidth: '1360px', margin: '0 auto' }}
      >
        {/* Brand Logo */}
        <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 text-dark">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0"
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.28)',
            }}
          >
            <FaWallet size={19} />
          </div>
          <div className="d-flex align-items-center gap-2">
            <span
              className="fw-bold fs-4 text-dark lh-1"
              style={{ fontFamily: 'Outfit, sans-serif', letterSpacing: '-1px' }}
            >
              FinTrack
            </span>
            <span
              className="badge bg-primary-subtle text-primary border border-primary-subtle py-1 px-2 fw-semibold rounded-pill"
              style={{ fontSize: '11px', lineHeight: '1' }}
            >
              PRO
            </span>
          </div>
        </Link>

        {/* Center Nav Links with pill styling */}
        <nav className="d-none d-md-flex align-items-center gap-1 bg-light px-3 py-1 rounded-pill border shadow-xs">
          <Link
            to="/"
            className={`text-decoration-none px-3 py-1 rounded-pill transition-all ${
              isHome
                ? 'bg-white text-primary fw-semibold shadow-xs'
                : 'text-muted fw-medium hover-bg-light'
            }`}
            style={{ fontSize: '14px' }}
          >
            Home
          </Link>
          <Link
            to="/features"
            className={`text-decoration-none px-3 py-1 rounded-pill transition-all ${
              isFeatures
                ? 'bg-white text-primary fw-semibold shadow-xs'
                : 'text-muted fw-medium hover-bg-light'
            }`}
            style={{ fontSize: '14px' }}
          >
            Features
          </Link>
          {isAuthenticated && (
            <Link
              to="/guide"
              className={`text-decoration-none px-3 py-1 rounded-pill transition-all ${
                isGuide
                  ? 'bg-white text-primary fw-semibold shadow-xs'
                  : 'text-muted fw-medium hover-bg-light'
              }`}
              style={{ fontSize: '14px' }}
            >
              User Guide
            </Link>
          )}
          <button
            onClick={() => navigate('/login?demo=true')}
            className="btn btn-link text-decoration-none text-muted fw-medium px-3 py-1 rounded-pill hover-text-primary p-0"
            style={{ fontSize: '14px' }}
          >
            Live Demo
          </button>
        </nav>

        {/* Auth CTA buttons */}
        <div className="d-flex align-items-center gap-2 gap-md-3">
          {isAuthenticated ? (
            <>
              {/* <Link
                to="/guide"
                className="btn btn-outline-primary btn-sm px-3 py-1 fw-semibold rounded-pill d-none d-sm-inline-flex align-items-center gap-1 shadow-xs"
              >
                User Guide
              </Link> */}
              <Link
                to="/dashboard"
                className="btn text-white px-3 px-md-4 py-2 rounded-pill fw-semibold d-flex align-items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                  border: 'none',
                  fontSize: '14px',
                }}
              >
                <span>Dashboard</span> <FaArrowRight size={12} />
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-light px-3 py-2 fw-semibold text-dark border rounded-pill shadow-xs"
                style={{ fontSize: '14px' }}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn text-white px-3 px-md-4 py-2 rounded-pill fw-semibold shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
                  border: 'none',
                  fontSize: '14px',
                }}
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
