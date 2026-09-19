import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
  FaWallet,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUserCheck,
  FaShieldAlt,
  FaMobileAlt,
  FaEnvelope,
  FaRedo,
  FaArrowLeft,
} from 'react-icons/fa';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // MFA Challenge States
  const [mfaStage, setMfaStage] = useState(false);
  const [mfaData, setMfaData] = useState(null);
  const [totpCode, setTotpCode] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { login, verifyMfaLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      toast.info('Your session has expired. Please log in again to continue.');
    }
    if (params.get('demo') === 'true') {
      setEmail('demo@fintrack.com');
      setPassword('Password123!');
    }
  }, [location]);

  // Handle resend countdown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const res = await login(email, password);

      // Check if MFA verification is required
      if (res?.mfaRequired) {
        setMfaData(res);
        setMfaStage(true);
        toast.info(res.message || 'Please complete 2-factor authentication');
        return;
      }

      toast.success('Welcome back to FinTrack!');
      navigate('/dashboard');
    } catch (err) {
      let message = 'Login failed. Check your credentials.';
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (!err.response || err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        message = 'Cannot connect to backend server. Please verify the backend is running on port 5000.';
      } else if (err.response?.status >= 500) {
        message = 'Backend server connection error. Please verify the server is running on port 5000.';
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();

    const requiredType = mfaData?.mfaType;

    if (['authenticator', 'both'].includes(requiredType) && (!totpCode || totpCode.trim().length !== 6)) {
      toast.error('Please enter a valid 6-digit Authenticator app code');
      return;
    }

    if (['email', 'both'].includes(requiredType) && (!emailOtp || emailOtp.trim().length !== 6)) {
      toast.error('Please enter the 6-digit verification code sent to your email');
      return;
    }

    setMfaLoading(true);

    try {
      await verifyMfaLogin({
        mfaToken: mfaData.mfaToken,
        totpCode: totpCode.trim(),
        emailOtp: emailOtp.trim(),
      });

      toast.success('Security verification successful! Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      const message = err.response?.data?.message || 'MFA verification failed. Please try again.';
      toast.error(message);
    } finally {
      setMfaLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendingOtp) return;
    setResendingOtp(true);
    try {
      const res = await api.post('/auth/mfa/resend-email-otp', {
        mfaToken: mfaData.mfaToken,
      });
      toast.success(res.data.message || 'Verification code resent to your email');
      if (res.data.debugOtp) {
        setMfaData((prev) => ({ ...prev, debugOtp: res.data.debugOtp }));
      }
      setResendCooldown(30);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setResendingOtp(false);
    }
  };

  const handleFillDemo = (userType = 'demo') => {
    if (userType === 'demo') {
      setEmail('demo@fintrack.com');
      setPassword('Password123!');
    } else {
      setEmail('priya@fintrack.com');
      setPassword('Password123!');
    }
    toast.info(`Filled ${userType === 'demo' ? 'Primary' : 'Household Partner'} demo credentials`);
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
        <p className="text-muted small mt-1">Sign in to manage your finances & household</p>
      </div>

      <div className="card-fintrack bg-white p-4 p-md-5 w-100" style={{ maxWidth: '440px' }}>
        {!mfaStage ? (
          <>
            <h4 className="fw-bold mb-1">Welcome Back</h4>
            <p className="text-muted small mb-4">Enter your email and password to access your dashboard.</p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
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

              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <label className="form-label fw-medium text-muted small mb-0">Password</label>
                  <Link to="/forgot-password" className="text-decoration-none small text-primary fw-medium">
                    Forgot password?
                  </Link>
                </div>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-control form-control-custom"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-2 mt-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <FaSignInAlt />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Box */}
            <div className="mt-4 p-3 bg-light rounded-3 border">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-semibold small text-dark d-flex align-items-center gap-1">
                  <FaUserCheck className="text-success" /> Demo Accounts:
                </span>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('demo')}
                  className="btn btn-sm btn-outline-primary btn-dashboard-action w-100 fw-medium"
                  style={{ fontSize: '0.775rem' }}
                >
                  Aarav (Primary)
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('partner')}
                  className="btn btn-sm btn-outline-secondary btn-dashboard-action w-100 fw-medium"
                  style={{ fontSize: '0.775rem' }}
                >
                  Priya (Household)
                </button>
              </div>
            </div>

            <div className="text-center mt-4 text-muted small">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                Create an account
              </Link>
            </div>
          </>
        ) : (
          /* MFA Challenge View */
          <div>
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="p-2 rounded-circle bg-primary-subtle text-primary">
                <FaShieldAlt size={20} />
              </div>
              <div>
                <h5 className="fw-bold mb-0">Two-Factor Authentication</h5>
                <span className="text-muted small">Extra security layer active</span>
              </div>
            </div>

            <p className="text-muted small mb-4">
              {mfaData?.mfaType === 'authenticator'
                ? 'Enter the 6-digit passcode generated by your Authenticator app.'
                : mfaData?.mfaType === 'email'
                ? `Enter the 6-digit one-time passcode sent to ${mfaData?.email || 'your email'}.`
                : `Enter your Authenticator code and the Email OTP sent to ${mfaData?.email || 'your email'}.`}
            </p>

            <form onSubmit={handleMfaSubmit}>
              {/* Authenticator App Code Input */}
              {['authenticator', 'both'].includes(mfaData?.mfaType) && (
                <div className="mb-3">
                  <label className="form-label fw-medium text-muted small d-flex align-items-center gap-1">
                    <FaMobileAlt className="text-primary" /> Authenticator App Code (6 digits)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    className="form-control form-control-custom text-center fw-bold fs-5 letter-spacing-2"
                    placeholder="000000"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                </div>
              )}

              {/* Email OTP Code Input */}
              {['email', 'both'].includes(mfaData?.mfaType) && (
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <label className="form-label fw-medium text-muted small mb-0 d-flex align-items-center gap-1">
                      <FaEnvelope className="text-success" /> Email Verification OTP (6 digits)
                    </label>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendCooldown > 0 || resendingOtp}
                      className="btn btn-link p-0 text-decoration-none small text-primary fw-medium"
                      style={{ fontSize: '0.75rem' }}
                    >
                      {resendingOtp
                        ? 'Sending...'
                        : resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : 'Resend Code'}
                    </button>
                  </div>

                  {mfaData?.debugOtp && (
                    <div className="alert alert-info py-1 px-2 small d-flex align-items-center justify-content-between mb-2">
                      <span style={{ fontSize: '0.8rem' }}>
                        <strong>Dev OTP:</strong> <code className="fw-bold">{mfaData.debugOtp}</code>
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-info py-0 px-2 fw-medium"
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => setEmailOtp(mfaData.debugOtp)}
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    className="form-control form-control-custom text-center fw-bold fs-5 letter-spacing-2"
                    placeholder="000000"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus={mfaData?.mfaType === 'email'}
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary-custom w-100 py-2 mt-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                disabled={mfaLoading}
              >
                {mfaLoading ? <span>Verifying...</span> : <span>Verify & Access Account</span>}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMfaStage(false);
                  setMfaData(null);
                  setTotpCode('');
                  setEmailOtp('');
                }}
                className="btn btn-link text-muted w-100 mt-2 text-decoration-none small d-flex align-items-center justify-content-center gap-1"
              >
                <FaArrowLeft size={10} />
                <span>Back to Sign In</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default LoginPage;
