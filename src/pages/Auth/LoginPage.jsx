import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';
import { Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import './LoginPage.css';

/**
 * LoginPage Component:
 * 
 * Built with:
 * - shadcn/ui components (Card, Input, Button, Badge)
 * - Axios for direct REST API communication to Spring Boot `/api/v1/auth/login`
 * - Saves the returned session wristband token for genuine authorization
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Submit login credentials to Spring Boot backend
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Connect to real Spring Boot REST API
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email: email.trim(),
        password: password,
      });

      if (response.data && response.data.success) {
        const seller = response.data.data;
        
        // Save the session wristband token and seller details
        localStorage.setItem('bajrix_session_token', seller.sessionToken);
        localStorage.setItem('bajrix_seller', JSON.stringify(seller));

        setSuccessMessage(`Welcome back, ${seller.name}! Logged in successfully.`);
        
        // Brief delay so user sees confirmation before navigating
        setTimeout(() => {
          navigate('/seller/dashboard');
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('Cannot connect to Spring Boot API at http://localhost:8080. Please ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper for one-click demo logins
  const fillDemoSeller = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="auth-split-layout">
      {/* Left Column: Shifted Form Section */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <Card className="auth-card">
            <CardHeader className="auth-card-header">
              <div className="auth-logo-badge">
                <Lock size={24} color="var(--primary)" />
              </div>
              <CardTitle className="auth-title">Seller Login</CardTitle>
              <CardDescription className="auth-subtitle">
                Sign in to manage your yard's catalogue listings, prices, and stock.
              </CardDescription>
            </CardHeader>

            <CardContent>
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

              <form onSubmit={handleLogin} className="auth-form">
                <div className="auth-field">
                  <label>Registered Email</label>
                  <div className="input-with-icon">
                    <Mail size={18} className="field-icon" />
                    {/* shadcn Input */}
                    <Input
                      type="email"
                      required
                      placeholder="seller@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-field">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Password</label>
                    <NavLink to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                      Forgot Password?
                    </NavLink>
                  </div>
                  <div className="input-with-icon">
                    <Lock size={18} className="field-icon" />
                    {/* shadcn Input */}
                    <Input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input"
                    />
                  </div>
                </div>

                {/* shadcn Button */}
                <Button 
                  type="submit" 
                  disabled={loading} 
                  variant="default"
                  className="btn-auth-submit"
                >
                  {loading ? 'Verifying Wristband...' : 'Log In to Store'}
                </Button>
              </form>

              {/* Demo Logins for easy reviewer testing */}
              <div className="demo-accounts-box">
                <span className="demo-accounts-title">Quick Demo Logins (Pre-Seeded):</span>
                <div className="demo-buttons-grid">
                  <button
                    type="button"
                    onClick={() => fillDemoSeller('shree@example.com', 'password123')}
                    className="btn-demo-account"
                  >
                    <span className="demo-seller-name">Shree Traders</span>
                    <span className="demo-badge badge-approved">APPROVED</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoSeller('ramesh@example.com', 'password123')}
                    className="btn-demo-account"
                  >
                    <span className="demo-seller-name">Ramesh Hardware</span>
                    <span className="demo-badge badge-approved">APPROVED</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoSeller('verma@example.com', 'password123')}
                    className="btn-demo-account"
                  >
                    <span className="demo-seller-name">Verma Store</span>
                    <span className="demo-badge badge-pending">PENDING</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillDemoSeller('gupta@example.com', 'password123')}
                    className="btn-demo-account"
                  >
                    <span className="demo-seller-name">Gupta Bros</span>
                    <span className="demo-badge badge-rejected">REJECTED</span>
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="auth-footer-prompt">
              <span className="prompt-text">Don't have a seller account yet?</span>
              <NavLink to="/register" className="auth-link">
                Register your shop here
              </NavLink>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Right Column: Unsplash Construction Material Showcase */}
      <div className="auth-image-side">
        <img 
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80" 
          alt="Civil engineer and construction workers at active building site" 
          className="auth-image-bg"
        />
        <div className="auth-image-overlay"></div>
        <div className="auth-image-content">
          <div className="auth-image-badge">BAJRIX VENDOR PLATFORM</div>
          <h2 className="auth-image-title">
            The Direct Bridge Between Material Yards & Active Construction Sites.
          </h2>
          <p className="auth-image-subtitle">
            Keep your aggregate, river sand, cement, and TMT steel moving. Connect directly with licensed civil contractors and home builders across your region with transparent live rates.
          </p>

          <div className="auth-highlights-grid">
            <div className="auth-highlight-card">
              <span className="highlight-number">500+</span>
              <span className="highlight-label">Verified Regional Yards</span>
            </div>
            <div className="auth-highlight-card">
              <span className="highlight-number">₹0</span>
              <span className="highlight-label">Listing Commission</span>
            </div>
            <div className="auth-highlight-card">
              <span className="highlight-number">100%</span>
              <span className="highlight-label">Direct Buyer Quotes</span>
            </div>
          </div>

          <div className="auth-quote-card">
            <p className="auth-quote-text">
              "BajriX transformed how we sell aggregate and cement across our district. Orders arrive with exact delivery coordinates and guaranteed buyers."
            </p>
            <span className="auth-quote-author">— Satish Sharma, Shree Traders (Approved Vendor)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
