import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FaWallet, FaCheckCircle, FaExclamationCircle, FaArrowRight, FaSignInAlt } from 'react-icons/fa';
import LoadingSpinner from '../components/common/LoadingSpinner';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const verifyToken = async () => {
      try {
        const res = await api.post(`/auth/verify-email/${token}`);
        if (isMounted) {
          setSuccess(true);
          setMessage(res.data.message || 'Your email has been verified successfully!');
          if (user) {
            updateUser({ ...user, isEmailVerified: true });
          }
        }
      } catch (err) {
        if (isMounted) {
          setSuccess(false);
          setMessage(
            err.response?.data?.message ||
              'This verification link is invalid or has expired. Please request a new one.'
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (token) {
      verifyToken();
    } else {
      setLoading(false);
      setSuccess(false);
      setMessage('No verification token provided.');
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

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

      <div className="card-fintrack bg-white p-4 p-md-5 w-100 text-center" style={{ maxWidth: '460px' }}>
        {loading ? (
          <div className="py-4">
            <LoadingSpinner message="Verifying your email address..." />
          </div>
        ) : success ? (
          <div>
            <div
              className="rounded-circle bg-success-subtle text-success d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '64px', height: '64px' }}
            >
              <FaCheckCircle size={32} />
            </div>
            <h4 className="fw-bold text-dark mb-2">Email Verified!</h4>
            <p className="text-muted small mb-4">{message}</p>

            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary-custom w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
              >
                <span>Continue to Dashboard</span>
                <FaArrowRight size={14} />
              </button>
            ) : (
              <Link
                to="/login"
                className="btn btn-primary-custom w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 text-decoration-none"
              >
                <FaSignInAlt size={14} />
                <span>Sign In to Your Account</span>
              </Link>
            )}
          </div>
        ) : (
          <div>
            <div
              className="rounded-circle bg-danger-subtle text-danger d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: '64px', height: '64px' }}
            >
              <FaExclamationCircle size={32} />
            </div>
            <h4 className="fw-bold text-dark mb-2">Verification Failed</h4>
            <p className="text-muted small mb-4">{message}</p>

            <div className="d-flex flex-column gap-2">
              <Link
                to={user ? '/profile' : '/login'}
                className="btn btn-primary-custom w-100 py-2 fw-semibold text-decoration-none"
              >
                {user ? 'Go to Profile Settings' : 'Back to Sign In'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
