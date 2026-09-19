import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaWallet, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import Footer from '../components/common/Footer';
import Navbar from '../components/common/Navbar';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [startingBalance, setStartingBalance] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const startBal = startingBalance ? parseFloat(startingBalance) : 0;
      const regRes = await register(name.trim(), email.trim(), password, currency, startBal);
      if (regRes?.verifyLink) {
        toast.info('Account created! Verification link generated for development.', { autoClose: 5000 });
      } else {
        toast.success('Registration successful! Please check your email for the verification link.');
      }
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-3 bg-app">
      <div className="text-center mb-4">
        <Link to="/" className="text-decoration-none d-inline-flex align-items-center gap-2 text-dark">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center text-white"
            style={{
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
            }}
          >
            <FaWallet size={20} />
          </div>
          <span className="fw-bold fs-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            FinTrack
          </span>
        </Link>
        <p className="text-muted small mt-1">Start tracking personal & household wealth today</p>
      </div>

      <div className="card-fintrack bg-white p-4 p-md-5 w-100" style={{ maxWidth: '480px' }}>
        <h4 className="fw-bold mb-1">Create Account</h4>
        <p className="text-muted small mb-4">Set up your free account in under 30 seconds.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-medium text-muted small">Full Name *</label>
            <input
              type="text"
              required
              className="form-control form-control-custom"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-medium text-muted small">Email Address *</label>
            <input
              type="email"
              required
              className="form-control form-control-custom"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="row g-2 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-medium text-muted small">Password (min 6 chars) *</label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className="form-control form-control-custom"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-light border text-muted px-2"
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-medium text-muted small">Confirm Password *</label>
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
                  className="btn btn-light border text-muted px-2"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                  tabIndex={-1}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label fw-medium text-muted small">Currency</label>
              <select
                className="form-select form-select-custom"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="INR">₹ INR</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label fw-medium text-muted small">
                Starting Balance <span className="text-muted fw-normal">(Optional)</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light fw-bold text-muted">
                  {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹'}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="form-control form-control-custom"
                  placeholder="0.00"
                  value={startingBalance}
                  onChange={(e) => setStartingBalance(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2 mt-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <FaUserPlus />
                <span>Create Free Account</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-4 text-muted small">
          Already have an account?{' '}
          <Link to="/login" className="text-primary fw-semibold text-decoration-none">
            Sign In
          </Link>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default RegisterPage;
