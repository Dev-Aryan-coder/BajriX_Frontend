import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
              <rect x="8" y="24" width="12" height="29" rx="2" fill="var(--primary)" />
              <rect x="26" y="10" width="12" height="43" rx="2" fill="var(--secondary)" />
              <rect x="44" y="18" width="12" height="35" rx="2" fill="var(--accent)" />
              <rect x="4" y="53" width="56" height="3" rx="1.5" fill="var(--foreground)" />
            </svg>
            <span className="footer-wordmark">Bajri<span className="footer-x">X</span></span>
          </div>
          <p className="footer-tagline">
            The multi-seller marketplace for construction materials. Compare prices, stock, and MOQ across local verified suppliers.
          </p>
        </div>

        <div className="footer-links-group">
          <h4>Marketplace</h4>
          <a href="/">Browse Cement</a>
          <a href="/">Clay Bricks</a>
          <a href="/">TMT Steel</a>
          <a href="/">River Sand</a>
        </div>

        <div className="footer-links-group">
          <h4>Company</h4>
          <a href="/about">About Us</a>
          <a href="/services">Our Services</a>
          <a href="/contact">Contact Support</a>
        </div>

        <div className="footer-links-group">
          <h4>For Sellers</h4>
          <a href="/register">Register Shop</a>
          <a href="/login">Seller Login</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 BajriX Marketplace. All rights reserved.</p>
        <p>Built for transparent construction material sourcing.</p>
      </div>
    </footer>
  );
}
