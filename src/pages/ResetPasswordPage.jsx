import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { FaWallet, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      toast.success(res.data.message || 'Password reset successfully!');
      if (res.data.data?.token) {
        localStorage.setItem('fintrack_token', res.data.data.token);
        localStorage.setItem('fintrack_user', JSON.stringify(res.data.data.user));
        updateUser(res.data.data.user);
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed or token expired');
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
        <h4 className="fw-bold mb-1">Set New Password</h4>
        <p className="text-muted small mb-4">Choose a strong, secure password for your account.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium text-muted small">New Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="form-control form-control-custom"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="btn btn-light border text-muted px-3"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium text-muted small">Confirm New Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="form-control form-control-custom"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-light border text-muted px-3"
                onClick={() => setShowConfirmPassword((p) => !p)}
                tabIndex={-1}
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            <FaLock />
            <span>{loading ? 'Updating Password...' : 'Reset Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
