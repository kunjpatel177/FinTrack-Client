import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import Modal from '../components/common/Modal';
import {
  FaUser,
  FaLock,
  FaCoins,
  FaCheck,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaMobileAlt,
  FaEnvelope,
  FaQrcode,
  FaKey,
  FaCopy,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPaperPlane,
  FaTrashAlt,
} from 'react-icons/fa';

const ProfilePage = () => {
  const { user, updateUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const { triggerGlobalRefresh } = useOutletContext() || {};

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [startingBalance, setStartingBalance] = useState(user?.startingBalance ?? 0);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Email verification state
  const [resendingVerification, setResendingVerification] = useState(false);

  // MFA Preferences state
  const [selectedMfaType, setSelectedMfaType] = useState(user?.mfaType || 'none');
  const [mfaSaveLoading, setMfaSaveLoading] = useState(false);

  // Password confirmation modal for MFA change
  const [isConfirmPasswordModalOpen, setIsConfirmPasswordModalOpen] = useState(false);
  const [mfaCurrentPassword, setMfaCurrentPassword] = useState('');
  const [showMfaCurrentPassword, setShowMfaCurrentPassword] = useState(false);

  // TOTP Setup Modal
  const [isTotpModalOpen, setIsTotpModalOpen] = useState(false);
  const [totpQrCode, setTotpQrCode] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [totpCodeInput, setTotpCodeInput] = useState('');
  const [totpLoading, setTotpLoading] = useState(false);
  const [totpVerifyLoading, setTotpVerifyLoading] = useState(false);

  // Email OTP Setup / Test Modal
  const [isEmailOtpModalOpen, setIsEmailOtpModalOpen] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [sendingEmailTest, setSendingEmailTest] = useState(false);
  const [verifyingEmailTest, setVerifyingEmailTest] = useState(false);

  // Email Sandbox / Debug info state
  const [debugOtp, setDebugOtp] = useState('');
  const [verificationNotice, setVerificationNotice] = useState(null);

  // Delete Account State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCurrency(user.currency || 'INR');
      setStartingBalance(user.startingBalance ?? 0);
      setSelectedMfaType(user.mfaType || 'none');
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error('Name and email cannot be empty');
      return;
    }

    setProfileLoading(true);

    try {
      const res = await api.put('/auth/profile', {
        name: name.trim(),
        email: email.trim(),
        currency,
        startingBalance: parseFloat(startingBalance) || 0,
      });

      if (res.data.success) {
        toast.success('Profile updated successfully');
        updateUser(res.data.data);
        if (triggerGlobalRefresh) triggerGlobalRefresh();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error('Please provide current and new password');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await api.put('/auth/password', {
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    try {
      const res = await api.post('/auth/resend-verification', { email: user?.email });
      toast.success(res.data.message || 'Verification link sent to your email!');
      if (!res.data.isRealDelivery && res.data.verifyLink) {
        setVerificationNotice(res.data.verifyLink);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setResendingVerification(false);
    }
  };

  // 1. Initiate Authenticator Setup (Get QR Code & Secret)
  const handleOpenTotpSetup = async () => {
    setIsTotpModalOpen(true);
    setTotpLoading(true);
    try {
      const res = await api.post('/auth/mfa/totp/setup');
      if (res.data.success) {
        setTotpQrCode(res.data.data.qrCode);
        setTotpSecret(res.data.data.secret);
      }
    } catch (err) {
      toast.error('Failed to generate Authenticator QR code');
      setIsTotpModalOpen(false);
    } finally {
      setTotpLoading(false);
    }
  };

  // 2. Verify TOTP Setup Code
  const handleVerifyTotpSetup = async (e) => {
    e.preventDefault();
    if (!totpCodeInput || totpCodeInput.trim().length !== 6) {
      toast.error('Please enter the 6-digit code from your Authenticator app');
      return;
    }

    setTotpVerifyLoading(true);
    try {
      const res = await api.post('/auth/mfa/totp/verify', {
        token: totpCodeInput.trim(),
      });
      toast.success(res.data.message || 'Authenticator verified successfully!');
      updateUser({ ...user, isTotpVerified: true });
      setIsTotpModalOpen(false);
      setTotpCodeInput('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setTotpVerifyLoading(false);
    }
  };

  // 3. Email OTP Test Send
  const handleSendEmailOtpTest = async () => {
    setSendingEmailTest(true);
    try {
      const res = await api.post('/auth/mfa/email/send-test');
      toast.success(res.data.message || 'Test code dispatched to your email');
      const otpCode = res.data.debugOtp || res.data.otp;
      if (otpCode) {
        setDebugOtp(otpCode);
      }
      setIsEmailOtpModalOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send test email');
    } finally {
      setSendingEmailTest(false);
    }
  };

  // 4. Email OTP Test Verify
  const handleVerifyEmailOtpTest = async (e) => {
    e.preventDefault();
    if (!emailOtpInput || emailOtpInput.trim().length !== 6) {
      toast.error('Please enter the 6-digit code received in your email');
      return;
    }

    setVerifyingEmailTest(true);
    try {
      const res = await api.post('/auth/mfa/email/verify-test', {
        otp: emailOtpInput.trim(),
      });
      toast.success(res.data.message || 'Email OTP verified successfully!');
      updateUser({ ...user, isEmailOtpEnabled: true });
      setIsEmailOtpModalOpen(false);
      setEmailOtpInput('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setVerifyingEmailTest(false);
    }
  };

  // 5. Open password prompt before saving MFA preference
  const handleRequestSaveMfa = () => {
    // Check prerequisites
    if (['authenticator', 'both'].includes(selectedMfaType) && !user?.isTotpVerified) {
      toast.warning('Please set up and verify your Authenticator app before enabling this option.');
      handleOpenTotpSetup();
      return;
    }

    if (['email', 'both'].includes(selectedMfaType) && !user?.isEmailVerified && !user?.isEmailOtpEnabled) {
      toast.warning('Please confirm email delivery before enabling Email OTP.');
      handleSendEmailOtpTest();
      return;
    }

    setMfaCurrentPassword('');
    setIsConfirmPasswordModalOpen(true);
  };

  // 6. Confirm password and commit MFA change
  const handleConfirmSaveMfa = async (e) => {
    e.preventDefault();
    if (!mfaCurrentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    setMfaSaveLoading(true);
    try {
      const res = await api.put('/auth/mfa/preference', {
        mfaType: selectedMfaType,
        currentPassword: mfaCurrentPassword,
      });

      toast.success(res.data.message || 'Security settings updated');
      updateUser({ ...user, mfaType: selectedMfaType });
      setIsConfirmPasswordModalOpen(false);
      setMfaCurrentPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update MFA settings');
    } finally {
      setMfaSaveLoading(false);
    }
  };

  // 7. Permanently Delete Account
  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (deleteConfirmText.trim() !== 'DELETE') {
      toast.error('Please type "DELETE" exactly to confirm');
      return;
    }
    if (!deletePassword) {
      toast.error('Please enter your current password');
      return;
    }

    setDeleteLoading(true);
    try {
      await deleteAccount(deletePassword);
      toast.success('Your account and personal financial records have been permanently deleted.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account. Please verify your password.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h4 className="fw-bold mb-1">Account & Security Settings</h4>
        <p className="text-muted small mb-0">
          Manage your personal profile, preferred display currency, and Multi-Factor Authentication (MFA).
        </p>
      </div>

      {/* Email Verification Status Card */}
      <div className="card-fintrack p-3 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className={`p-2 rounded-circle ${
                user?.isEmailVerified ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
              }`}
            >
              {user?.isEmailVerified ? <FaCheckCircle size={20} /> : <FaExclamationTriangle size={20} />}
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark">Registered Email: {user?.email}</span>
                <span
                  className={`badge rounded-pill ${
                    user?.isEmailVerified
                      ? 'bg-success-subtle text-success border border-success-subtle'
                      : 'bg-warning-subtle text-warning border border-warning-subtle'
                  }`}
                  style={{ fontSize: '0.75rem' }}
                >
                  {user?.isEmailVerified ? 'Verified Account' : 'Pending Verification'}
                </span>
              </div>
              <p className="text-muted small mb-0 mt-1">
                {user?.isEmailVerified
                  ? 'Your email address is verified and active for security notifications and OTP login.'
                  : 'Your email address is currently unverified. Click the button to dispatch a new activation link.'}
              </p>
            </div>
          </div>

          {!user?.isEmailVerified && (
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingVerification}
              className="btn btn-sm btn-outline-primary btn-dashboard-action d-flex align-items-center gap-2 px-3 py-2 fw-medium"
            >
              <FaPaperPlane size={12} />
              <span>{resendingVerification ? 'Dispatching...' : 'Send Verification Email'}</span>
            </button>
          )}
        </div>

        {verificationNotice && !user?.isEmailVerified && (
          <div className="mt-3 pt-2 border-top d-flex align-items-center justify-content-between">
            <span className="small text-muted">
              <strong>Dev Link:</strong> Real SMTP is not configured in server/.env, so click the button to activate directly:
            </span>
            <a
              href={verificationNotice}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary py-1 px-3 fw-medium text-decoration-none"
              style={{ fontSize: '0.8rem' }}
            >
              Activate Email Now
            </a>
          </div>
        )}
      </div>

      <div className="row g-4 mb-4">
        {/* Profile Details Column */}
        <div className="col-12 col-lg-6">
          <div className="card-fintrack p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom">
              <div className="p-2 rounded-circle bg-primary-subtle text-primary">
                <FaUser size={18} />
              </div>
              <div>
                <h5 className="fw-semibold mb-0">Personal Profile</h5>
                <span className="text-muted small">Update your name, email, and preferences</span>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile}>
              <div className="mb-3">
                <label className="form-label fw-medium text-muted small">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control form-control-custom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium text-muted small">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control form-control-custom"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium text-muted small">Display Currency</label>
                <select
                  className="form-select form-select-custom"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="INR">₹ Indian Rupee (INR)</option>
                  <option value="USD">$ US Dollar (USD)</option>
                  <option value="EUR">€ Euro (EUR)</option>
                  <option value="GBP">£ British Pound (GBP)</option>
                </select>
                <div className="form-text small">
                  All charts, transactions, and budget statistics will dynamically format using this currency symbol.
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-medium text-muted small">Opening Starting Balance</label>
                <div className="input-group">
                  <span className="input-group-text bg-light fw-bold">
                    {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹'}
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    className="form-control form-control-custom fw-semibold"
                    placeholder="e.g. 50000"
                    value={startingBalance}
                    onChange={(e) => setStartingBalance(e.target.value)}
                  />
                </div>
                <div className="form-text small">
                  The initial total of your bank accounts and cash when you began tracking with FinTrack.
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="btn btn-primary-custom px-4 fw-medium d-flex align-items-center gap-2"
              >
                <FaCheck size={12} />
                <span>{profileLoading ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Column (with Eye Toggles) */}
        <div className="col-12 col-lg-6">
          <div className="card-fintrack p-4 h-100">
            <div className="d-flex align-items-center gap-2 mb-4 pb-3 border-bottom">
              <div className="p-2 rounded-circle bg-warning-subtle text-warning">
                <FaLock size={18} />
              </div>
              <div>
                <h5 className="fw-semibold mb-0">Change Password</h5>
                <span className="text-muted small">Keep your financial credentials protected</span>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword}>
              <div className="mb-3">
                <label className="form-label fw-medium text-muted small">Current Password</label>
                <div className="input-group">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    className="form-control form-control-custom"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-light border text-muted px-3"
                    onClick={() => setShowCurrentPassword((p) => !p)}
                    tabIndex={-1}
                    title={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-medium text-muted small">New Password (min 6 chars)</label>
                <div className="input-group">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    className="form-control form-control-custom"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-light border text-muted px-3"
                    onClick={() => setShowNewPassword((p) => !p)}
                    tabIndex={-1}
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
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
                    {showConfirmPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="btn btn-primary-custom px-4 fw-medium d-flex align-items-center gap-2"
              >
                <FaShieldAlt size={12} />
                <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Multi-Factor Authentication (MFA) Section */}
      <div className="card-fintrack p-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-success-subtle text-success">
              <FaShieldAlt size={24} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="fw-bold mb-0">Multi-Factor Authentication (MFA)</h5>
                <span
                  className={`badge rounded-pill ${
                    user?.mfaType && user?.mfaType !== 'none'
                      ? 'bg-success-subtle text-success border border-success-subtle'
                      : 'bg-light text-muted border'
                  }`}
                >
                  {user?.mfaType === 'authenticator'
                    ? 'Authenticator Active'
                    : user?.mfaType === 'email'
                    ? 'Email OTP Active'
                    : user?.mfaType === 'both'
                    ? 'Maximum Security (Both Active)'
                    : 'Disabled'}
                </span>
              </div>
              <p className="text-muted small mb-0 mt-1">
                Protect your financial dashboard with secondary verification. MFA is completely optional; you choose whether to disable it, use an Authenticator app, Email OTP, or require both.
              </p>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={handleOpenTotpSetup}
              className="btn btn-outline-primary btn-dashboard-action d-flex align-items-center gap-2 px-3 py-2 fw-medium"
            >
              <FaMobileAlt size={14} />
              <span>{user?.isTotpVerified ? 'Reconfigure Authenticator' : 'Setup Authenticator'}</span>
            </button>
            <button
              type="button"
              onClick={handleSendEmailOtpTest}
              disabled={sendingEmailTest}
              className="btn btn-outline-secondary btn-dashboard-action d-flex align-items-center gap-2 px-3 py-2 fw-medium"
            >
              <FaEnvelope size={14} />
              <span>{sendingEmailTest ? 'Sending Test...' : 'Test Email OTP'}</span>
            </button>
          </div>
        </div>

        {/* MFA Mode Choice Radio Cards */}
        <div className="row g-3 mb-4">
          {/* Option 1: Disabled */}
          <div className="col-12 col-md-6 col-xl-3">
            <label
              className={`p-3 rounded-3 border w-100 h-100 d-block cursor-pointer transition-all ${
                selectedMfaType === 'none' ? 'border-primary bg-primary-subtle' : 'bg-white'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark">Disabled</span>
                <input
                  type="radio"
                  name="mfaOption"
                  className="form-check-input"
                  checked={selectedMfaType === 'none'}
                  onChange={() => setSelectedMfaType('none')}
                />
              </div>
              <p className="text-muted small mb-0">
                Sign in using only your email and password. Fast and simple with no extra steps.
              </p>
            </label>
          </div>

          {/* Option 2: Authenticator App */}
          <div className="col-12 col-md-6 col-xl-3">
            <label
              className={`p-3 rounded-3 border w-100 h-100 d-block cursor-pointer transition-all ${
                selectedMfaType === 'authenticator' ? 'border-primary bg-primary-subtle' : 'bg-white'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark d-flex align-items-center gap-1">
                  <FaMobileAlt className="text-primary" /> Authenticator App
                </span>
                <input
                  type="radio"
                  name="mfaOption"
                  className="form-check-input"
                  checked={selectedMfaType === 'authenticator'}
                  onChange={() => setSelectedMfaType('authenticator')}
                />
              </div>
              <p className="text-muted small mb-0">
                Use Google Authenticator, Microsoft Authenticator, or Authy to generate time-based 6-digit codes.
              </p>
            </label>
          </div>

          {/* Option 3: Email OTP */}
          <div className="col-12 col-md-6 col-xl-3">
            <label
              className={`p-3 rounded-3 border w-100 h-100 d-block cursor-pointer transition-all ${
                selectedMfaType === 'email' ? 'border-primary bg-primary-subtle' : 'bg-white'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark d-flex align-items-center gap-1">
                  <FaEnvelope className="text-success" /> Email OTP
                </span>
                <input
                  type="radio"
                  name="mfaOption"
                  className="form-check-input"
                  checked={selectedMfaType === 'email'}
                  onChange={() => setSelectedMfaType('email')}
                />
              </div>
              <p className="text-muted small mb-0">
                Receive an instant 6-digit one-time passcode to your registered email on each sign-in attempt.
              </p>
            </label>
          </div>

          {/* Option 4: Both */}
          <div className="col-12 col-md-6 col-xl-3">
            <label
              className={`p-3 rounded-3 border w-100 h-100 d-block cursor-pointer transition-all ${
                selectedMfaType === 'both' ? 'border-primary bg-primary-subtle' : 'bg-white'
              }`}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark d-flex align-items-center gap-1">
                  <FaShieldAlt className="text-warning" /> Both (Max Security)
                </span>
                <input
                  type="radio"
                  name="mfaOption"
                  className="form-check-input"
                  checked={selectedMfaType === 'both'}
                  onChange={() => setSelectedMfaType('both')}
                />
              </div>
              <p className="text-muted small mb-0">
                Require both an Authenticator app code AND an Email OTP code for banking-grade protection.
              </p>
            </label>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
          <span className="text-muted small">
            Saving your MFA preference requires current password verification to prevent unauthorized tampering.
          </span>
          <button
            type="button"
            onClick={handleRequestSaveMfa}
            className="btn btn-primary-custom px-4 fw-medium"
          >
            Save MFA Preference
          </button>
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="card-fintrack p-4 border border-danger-subtle bg-danger-subtle bg-opacity-10 mt-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-circle bg-danger-subtle text-danger">
              <FaTrashAlt size={22} />
            </div>
            <div>
              <h5 className="fw-bold text-danger mb-0">Danger Zone: Delete Account</h5>
              <p className="text-muted small mb-0 mt-1">
                Permanently erase your account, personal financial transactions, budgets, saving goals, recurring rules, and custom categories. This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setDeleteConfirmText('');
              setDeletePassword('');
              setShowDeletePassword(false);
              setIsDeleteModalOpen(true);
            }}
            className="btn btn-outline-danger d-flex align-items-center gap-2 px-4 py-2 fw-medium"
          >
            <FaTrashAlt size={14} />
            <span>Delete My Account</span>
          </button>
        </div>
      </div>

      {/* 1. Setup Authenticator App Modal */}
      <Modal
        isOpen={isTotpModalOpen}
        onClose={() => setIsTotpModalOpen(false)}
        title="Configure Authenticator App"
        size="md"
      >
        {totpLoading ? (
          <div className="p-4 text-center text-muted">Generating QR code & secure key...</div>
        ) : (
          <div>
            <p className="text-muted small mb-3">
              1. Open Google Authenticator or Authy on your mobile phone.<br />
              2. Tap <strong>Scan QR code</strong> and point your camera at the barcode below:
            </p>

            {totpQrCode && (
              <div className="text-center mb-3 p-3 bg-light rounded-3 border d-inline-block w-100">
                <img
                  src={totpQrCode}
                  alt="Scan QR Code"
                  className="img-fluid border rounded-2"
                  style={{ maxWidth: '200px' }}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label fw-medium text-muted small">Can't scan? Enter key manually:</label>
              <div className="input-group">
                <input
                  type="text"
                  readOnly
                  className="form-control form-control-custom font-monospace small bg-light"
                  value={totpSecret}
                />
                <button
                  type="button"
                  className="btn btn-light border"
                  onClick={() => {
                    navigator.clipboard.writeText(totpSecret);
                    toast.info('Secret key copied to clipboard');
                  }}
                  title="Copy secret key"
                >
                  <FaCopy size={13} />
                </button>
              </div>
            </div>

            <form onSubmit={handleVerifyTotpSetup}>
              <div className="mb-3">
                <label className="form-label fw-medium text-muted small">
                  3. Enter the 6-digit code shown in your Authenticator app to confirm:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  className="form-control form-control-custom text-center fw-bold fs-5 letter-spacing-2"
                  value={totpCodeInput}
                  onChange={(e) => setTotpCodeInput(e.target.value.replace(/\D/g, ''))}
                  autoFocus
                />
              </div>

              <div className="d-flex justify-content-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setIsTotpModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={totpVerifyLoading}
                  className="btn btn-primary-custom"
                >
                  {totpVerifyLoading ? 'Verifying...' : 'Verify & Confirm'}
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* 2. Email OTP Test Modal */}
      <Modal
        isOpen={isEmailOtpModalOpen}
        onClose={() => setIsEmailOtpModalOpen(false)}
        title="Verify Email OTP Delivery"
        size="md"
      >
        <div>
          <p className="text-muted small mb-3">
            We dispatched a 6-digit test passcode to <strong>{user?.email}</strong>. Enter it below to confirm that you can receive login OTPs:
          </p>

          {debugOtp && (
            <div className="alert alert-info py-2 px-3 small d-flex align-items-center justify-content-between mb-3">
              <span>
                <strong>Dev Sandbox Code:</strong> <span className="font-monospace fw-bold">{debugOtp}</span>
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-info py-0 px-2 fw-medium"
                onClick={() => setEmailOtpInput(debugOtp)}
              >
                Auto-fill
              </button>
            </div>
          )}

          <form onSubmit={handleVerifyEmailOtpTest}>
            <div className="mb-3">
              <input
                type="text"
                maxLength={6}
                required
                placeholder="000000"
                className="form-control form-control-custom text-center fw-bold fs-5 letter-spacing-2"
                value={emailOtpInput}
                onChange={(e) => setEmailOtpInput(e.target.value.replace(/\D/g, ''))}
                autoFocus
              />
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setIsEmailOtpModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={verifyingEmailTest}
                className="btn btn-primary-custom"
              >
                {verifyingEmailTest ? 'Verifying...' : 'Confirm Delivery'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* 3. Password Confirmation Modal for MFA Change */}
      <Modal
        isOpen={isConfirmPasswordModalOpen}
        onClose={() => setIsConfirmPasswordModalOpen(false)}
        title="Confirm Security Changes"
        size="sm"
      >
        <div>
          <p className="text-muted small mb-3">
            You are setting Multi-Factor Authentication to{' '}
            <strong className="text-capitalize text-dark">
              {selectedMfaType === 'none' ? 'Disabled' : selectedMfaType}
            </strong>.
            Please enter your current password to authorize this change:
          </p>

          <form onSubmit={handleConfirmSaveMfa}>
            <div className="mb-3">
              <label className="form-label fw-medium text-muted small">Current Password</label>
              <div className="input-group">
                <input
                  type={showMfaCurrentPassword ? 'text' : 'password'}
                  required
                  className="form-control form-control-custom"
                  placeholder="••••••••"
                  value={mfaCurrentPassword}
                  onChange={(e) => setMfaCurrentPassword(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="btn btn-light border text-muted px-3"
                  onClick={() => setShowMfaCurrentPassword((p) => !p)}
                  tabIndex={-1}
                  title={showMfaCurrentPassword ? 'Hide password' : 'Show password'}
                >
                  {showMfaCurrentPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setIsConfirmPasswordModalOpen(false)}
                disabled={mfaSaveLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mfaSaveLoading}
                className="btn btn-primary-custom"
              >
                {mfaSaveLoading ? 'Authorizing...' : 'Confirm & Save'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* 4. Delete Account Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !deleteLoading && setIsDeleteModalOpen(false)}
        title="Permanently Delete Account"
        size="md"
      >
        <div>
          <div className="alert alert-danger d-flex align-items-start gap-2 mb-3">
            <FaExclamationTriangle className="mt-1 flex-shrink-0" size={18} />
            <div className="small">
              <strong>Caution:</strong> This will irreversibly delete your user profile, transactions, budgets, savings goals, recurring rules, and custom categories. If you own a household, ownership will transfer to the next member or be deleted.
            </div>
          </div>

          <form onSubmit={handleDeleteAccount}>
            <div className="mb-3">
              <label className="form-label fw-medium text-muted small">
                To confirm, type <strong className="text-danger">DELETE</strong> in the box below:
              </label>
              <input
                type="text"
                required
                placeholder="DELETE"
                className="form-control form-control-custom text-danger fw-bold"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium text-muted small">
                Enter your current password to authorize permanent deletion:
              </label>
              <div className="input-group">
                <input
                  type={showDeletePassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="form-control form-control-custom"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-light border text-muted px-3"
                  onClick={() => setShowDeletePassword((prev) => !prev)}
                  tabIndex={-1}
                  title={showDeletePassword ? 'Hide password' : 'Show password'}
                >
                  {showDeletePassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
              <button
                type="button"
                className="btn btn-light"
                disabled={deleteLoading}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={deleteLoading || deleteConfirmText.trim() !== 'DELETE' || !deletePassword}
                className="btn btn-danger d-flex align-items-center gap-2"
              >
                <FaTrashAlt size={13} />
                <span>{deleteLoading ? 'Deleting Account...' : 'Permanently Delete My Account'}</span>
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
