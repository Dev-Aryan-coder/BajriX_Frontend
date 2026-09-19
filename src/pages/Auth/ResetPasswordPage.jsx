import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import './ResetPasswordPage.css';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(searchParams.get('token') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!token.trim()) {
      setErrorMessage('Reset token is required.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/reset-password', {
        token: token.trim(),
        newPassword: password,
      });

      if (response.data && response.data.success) {
        setSuccessMessage(response.data.message || 'Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Failed to reset password. The token may be expired or invalid.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-layout">
      <div className="reset-password-card">
        <NavLink to="/login" className="back-link">
          <ArrowLeft size={16} /> Back to Seller Login
        </NavLink>

        <div className="reset-header">
          <div className="icon-badge">
            <ShieldCheck size={28} color="var(--primary)" />
          </div>
          <h1 className="reset-title">Reset Password</h1>
          <p className="reset-subtitle">
            Set a new secure password for your seller portal access.
          </p>
        </div>

        {errorMessage && (
          <div className="reset-alert alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="reset-alert alert-success">
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="input-group">
            <label htmlFor="token">Security Token</label>
            <input
              id="token"
              type="text"
              required
              placeholder="Paste your reset token here"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="text-input font-mono"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">New Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-input"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="text-input"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-submit-reset">
            {loading ? 'Updating Password…' : 'Set New Password'}
          </button>
        </form>

        <div className="reset-footer">
          <span>Remember your old credentials?</span>
          <NavLink to="/login" className="login-link">Log in</NavLink>
        </div>
      </div>
    </div>
  );
}
