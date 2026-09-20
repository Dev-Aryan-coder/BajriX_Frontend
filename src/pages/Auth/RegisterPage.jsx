import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { Store, Mail, Lock, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { API_BASE } from '../../lib/apiBase';
import './RegisterPage.css';

/**
 * RegisterPage Component:
 * 
 * Built with:
 * - shadcn/ui components (Card, Input, Button, Badge)
 * - Axios for direct REST API communication to Spring Boot (/api/v1/auth/register)
 * - Assigns returned session token to localStorage for immediate authorization
 * - Account defaults to PENDING status
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Submit registration to Spring Boot backend
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Client-side password matching validation
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Connect to real Spring Boot REST API
      const response = await axios.post(`${API_BASE}/auth/register`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.data && response.data.success) {
        const seller = response.data.data;
        
        // Save the session wristband token and seller details
        localStorage.setItem('bajrix_session_token', seller.sessionToken);
        localStorage.setItem('bajrix_seller', JSON.stringify(seller));

        setSuccessMessage(`Registration successful! Your store '${seller.name}' has been created with status PENDING. Redirecting...`);

        setTimeout(() => {
          navigate('/seller/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Cannot connect to Spring Boot API. Please ensure backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-layout">
      {/* Left Column: Shifted Form Section */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <Card className="register-card">
            <CardHeader className="register-card-header">
              <div className="register-logo-badge">
                <Store size={24} color="var(--primary)" />
              </div>
              <CardTitle className="register-title">Register Your Shop</CardTitle>
              <CardDescription className="register-subtitle">
                Join the BajriX marketplace as a verified vendor and quote directly to local construction buyers.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Business Rule Notice */}
              <div className="status-notice-banner">
                <ShieldAlert size={20} className="notice-icon" />
                <div className="notice-text">
                  <strong>Approval Lifecycle: </strong> 
                  New seller registrations start as <Badge variant="pending">PENDING</Badge>. You can prepare listings right away; they will go live to buyers once verified.
                </div>
              </div>

              {errorMessage && (
                <div className="auth-alert error-alert">
                  <AlertCircle size={18} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="auth-alert success-alert">
                  <CheckCircle2 size={18} />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="register-form">
                <div className="auth-field">
                  <label>Shop / Business Name</label>
                  <div className="input-with-icon">
                    <Store size={18} className="field-icon" />
                    {/* shadcn Input */}
                    <Input
                      type="text"
                      required
                      placeholder="e.g., Royal Hardware & Building Materials"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>Business Email</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="field-icon" />
                    {/* shadcn Input */}
                    <Input
                      type="email"
                      required
                      placeholder="owner@royalhardware.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>Password (min. 6 characters)</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="field-icon" />
                    {/* shadcn Input */}
                    <Input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <label>Confirm Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} className="field-icon" />
                    {/* shadcn Input */}
                    <Input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="auth-input"
                    />
                  </div>
                </div>

                {/* shadcn Button */}
                <Button 
                  type="submit" 
                  disabled={loading} 
                  variant="default"
                  className="btn-register-submit"
                >
                  {loading ? 'Creating Seller Account...' : 'Complete Shop Registration'}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="auth-footer-prompt">
              <span className="prompt-text">Already registered as a seller?</span>
              <NavLink to="/login" className="auth-link">
                Log in here
              </NavLink>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right Column: Unsplash Construction Architecture & Blueprint Showcase */}
      <div className="auth-image-side">
        <img 
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80" 
          alt="Architectural construction blueprints and building site materials" 
          className="auth-image-bg"
        />
        <div className="auth-image-overlay"></div>
        <div className="auth-image-content">
          <div className="auth-image-badge">EXPAND YOUR REGIONAL REACH</div>
          <h2 className="auth-image-title">
            List Your Yard in Minutes. Supply Major Infrastructure Projects.
          </h2>
          <p className="auth-image-subtitle">
            Join India's most trusted building materials platform. Whether you operate a sand pit, stone crusher, or hardware depot, BajriX gives your yard verified local visibility.
          </p>

          <div className="register-steps-list">
            <div className="register-step-item">
              <div className="step-circle">1</div>
              <div className="step-details">
                <span className="step-title">Submit Store Details</span>
                <span className="step-desc">Register your business name and email in under 60 seconds.</span>
              </div>
            </div>

            <div className="register-step-item">
              <div className="step-circle">2</div>
              <div className="step-details">
                <span className="step-title">Fast Verification</span>
                <span className="step-desc">Our team reviews your yard profile and activates your catalogue for regional buyers.</span>
              </div>
            </div>

            <div className="register-step-item">
              <div className="step-circle">3</div>
              <div className="step-details">
                <span className="step-title">Publish Live Rates</span>
                <span className="step-desc">Receive direct bulk orders for Bajri, cement bags, and steel rods with zero commission.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
