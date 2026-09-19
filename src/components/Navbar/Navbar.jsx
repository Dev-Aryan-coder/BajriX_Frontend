import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

/**
 * Navbar Component:
 * 
 * Layout:
 * - Left: Official BajriX logo mark (3 listing bars) + wordmark.
 * - Center: Floating pill-shaped navigation container (Home, Materials & Rates, Services, About Us, Contact Us).
 * - Right: Authentication actions (Login, Register / Sign Up, or Seller Session indicator with Dashboard link).
 */
export default function Navbar() {
  const navigate = useNavigate();
  
  // Read current seller session if logged in
  const sellerData = localStorage.getItem('bajrix_seller');
  const currentSeller = sellerData ? JSON.parse(sellerData) : null;

  const handleLogout = () => {
    localStorage.removeItem('bajrix_seller');
    localStorage.removeItem('bajrix_session_token');
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        
        {/* Left: Brand Logo & Wordmark */}
        <NavLink to="/" className="navbar-brand">
          <svg className="navbar-logo-mark" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="BajriX Logo">
            {/* 3 bars representing 3 seller listings of different heights for a product */}
            <rect x="8" y="24" width="12" height="29" rx="2" fill="var(--primary)" />
            <rect x="26" y="10" width="12" height="43" rx="2" fill="var(--secondary)" />
            <rect x="44" y="18" width="12" height="35" rx="2" fill="var(--accent)" />
            <rect x="4" y="53" width="56" height="3" rx="1.5" fill="var(--foreground)" />
          </svg>
          <span className="navbar-wordmark">
            Bajri<span className="navbar-wordmark-x">X</span>
          </span>
        </NavLink>

        {/* Center: Floating Pill-Shaped Navigation */}
        <nav className="navbar-pill">
          <NavLink 
            to="/" 
            className={({ isActive }) => `pill-link ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/products" 
            className={({ isActive }) => `pill-link ${isActive ? 'active' : ''}`}
          >
            Materials & Rates
          </NavLink>
          <NavLink 
            to="/services" 
            className={({ isActive }) => `pill-link ${isActive ? 'active' : ''}`}
          >
            Services
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `pill-link ${isActive ? 'active' : ''}`}
          >
            About Us
          </NavLink>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => `pill-link ${isActive ? 'active' : ''}`}
          >
            Contact Us
          </NavLink>
        </nav>

        {/* Right: Auth Actions */}
        <div className="navbar-auth">
          {currentSeller ? (
            <div className="seller-session-badge">
              <NavLink to="/seller/dashboard" className="btn-dashboard-nav">
                Dashboard
              </NavLink>
              <span className="seller-name-label">
                Shop: <strong>{currentSeller.name}</strong>
              </span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="btn-auth-login">
                Login
              </NavLink>
              <NavLink to="/register" className="btn-auth-register">
                Register / Sign Up
              </NavLink>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
