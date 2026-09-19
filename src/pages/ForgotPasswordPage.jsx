import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaWallet, FaArrowLeft, FaKey } from 'react-icons/fa';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email: email.trim() });
      toast.success(res.data.message || 'Password reset instructions generated');
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-3 bg-app">
      <div className="text-center mb-4">
        <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 text-dark">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center text-white"
            style={{
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            }}
          >
            <FaWallet size={20} />
          </div>
          <span className="fw-bold fs-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            FinTrack
          </span>
        </Link>
      </div>

      <div className="card-fintrack bg-white p-4 p-md-5 w-100" style={{ maxWidth: '440px' }}>
        <h4 className="fw-bold mb-1">Reset Password</h4>
        <p className="text-muted small mb-4">
          Enter your registered email and we'll generate a secure password reset token.
        </p>

        {resetToken ? (
          <div className="text-center">
            <div className="alert alert-success small mb-3 text-start">
              <strong>Token Generated!</strong> In production this token is dispatched via email. For testing, your reset token is:
            </div>
            <div className="p-3 bg-light rounded-3 border mb-3 text-break font-monospace small">
              {resetToken}
            </div>
            <button
              onClick={() => navigate(`/reset-password/${resetToken}`)}
              className="btn btn-primary-custom w-100 mb-3"
            >
              Continue to Reset Password Form
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-medium text-muted small">Email Address</label>
              <input
                type="email"
                required
                className="form-control form-control-custom"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary-custom w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              <FaKey />
              <span>{loading ? 'Submitting...' : 'Send Reset Token'}</span>
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="text-decoration-none small text-muted d-inline-flex align-items-center gap-1">
            <FaArrowLeft size={12} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
