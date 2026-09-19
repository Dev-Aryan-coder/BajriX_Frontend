import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import './ForgotPasswordPage.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoToken, setDemoToken] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setMessage('');
    setDemoToken('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/forgot-password', {
        email: email.trim(),
      });

      if (response.data && response.data.success) {
        setMessage(response.data.message || 'If registered, a reset token has been issued.');
        const token = response.data.data?.demoResetToken;
        if (token) {
          setDemoToken(token);
        }
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Cannot reach auth service at http://localhost:8080. Please ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-layout">
      <div className="forgot-password-card">
        <NavLink to="/login" className="back-link">
          <ArrowLeft size={16} /> Back to Seller Login
        </NavLink>

        <div className="forgot-header">
          <div className="icon-badge">
            <KeyRound size={28} color="var(--primary)" />
          </div>
          <h1 className="forgot-title">Forgot Password</h1>
          <p className="forgot-subtitle">
            Enter your registered shop email to generate a secure password reset token.
          </p>
        </div>

        {errorMessage && (
          <div className="forgot-alert alert-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {message && (
          <div className="forgot-alert alert-success">
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        {demoToken ? (
          <div className="demo-token-box">
            <div className="demo-token-header">
              <span className="demo-badge">DEMO MODE ACTIVE</span>
              <span className="demo-hint">In production this is sent via email</span>
            </div>
            <p className="demo-token-desc">
              Your test reset token has been generated:
            </p>
            <div className="token-display">
              <code>{demoToken}</code>
            </div>
            <button
              className="btn-use-token"
              onClick={() => navigate(`/reset-password?token=${demoToken}`)}
            >
              Reset Password Now with this Token <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="input-group">
              <label htmlFor="email">Registered Seller Email</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="e.g. shree@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-input"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-submit-forgot">
              {loading ? 'Issuing Token…' : 'Generate Reset Token'}
            </button>
          </form>
        )}

        <div className="forgot-footer">
          <span>Remembered your password?</span>
          <NavLink to="/login" className="login-link">Log in</NavLink>
        </div>
      </div>
    </div>
  );
}
