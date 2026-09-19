import React from 'react';
import { Scale, CheckCircle2, Lock, Store, FileText, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './ServicesPage.css';

/**
 * ServicesPage Component:
 * Highlights the platform capabilities for both buyers (comparative discovery)
 * and sellers (inventory management, concurrency protection, and catalog listing).
 */
export default function ServicesPage() {
  const services = [
    {
      icon: <Scale size={32} color="var(--primary)" />,
      title: "Live Price Comparison Engine",
      description: "Compare real-time rates from multiple hardware stores and yards for the identical product specification. Find the most competitive rate in your region instantly.",
      badge: "Buyer Service",
    },
    {
      icon: <Store size={32} color="var(--secondary)" />,
      title: "Independent Seller Portals",
      description: "Sellers manage price, stock quantity, and minimum order quantity (MOQ) independently. Strict authorization boundaries prevent any vendor from affecting another's listings.",
      badge: "Seller Service",
    },
    {
      icon: <Lock size={32} color="var(--accent)" />,
      title: "Concurrency-Safe Inventory Updates",
      description: "Our backend utilizes optimistic concurrency locking. If two yard managers update the same listing simultaneously, conflicts are detected and resolved safely without silent overwrites.",
      badge: "Platform Guarantee",
    },
    {
      icon: <CheckCircle2 size={32} color="var(--success)" />,
      title: "Approved Vendor Quality Gating",
      description: "Sellers undergo platform verification. Only APPROVED vendors' listings are presented to buyers, protecting builders from fraudulent or unverified suppliers.",
      badge: "Trust & Safety",
    },
    {
      icon: <FileText size={32} color="var(--primary)" />,
      title: "Standardized Master Catalogue",
      description: "Technical specifications, grade ratings, and packaging units are standardized centrally so buyers make true apples-to-apples comparisons across suppliers.",
      badge: "Catalogue Architecture",
    },
    {
      icon: <ArrowRight size={32} color="var(--secondary)" />,
      title: "Bulk Order MOQ Management",
      description: "Sellers define minimum purchase thresholds (e.g. 500 bricks, 20 cement bags) to ensure wholesale delivery economics remain viable for construction sites.",
      badge: "Procurement Efficiency",
    },
  ];

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-hero-content">
          <span className="services-tag">Platform Capabilities</span>
          <h1 className="services-title">Services Built for the Construction Trade</h1>
          <p className="services-subtitle">
            Engineered from the ground up to solve the real-world friction of sourcing cement, bricks, aggregates, and steel at fair local rates.
          </p>
        </div>
      </section>

      <section className="services-grid-section">
        <div className="services-grid">
          {services.map((srv, idx) => (
            <div key={idx} className="service-card">
              <div className="service-card-top">
                <div className="service-icon-box">{srv.icon}</div>
                <span className="service-badge">{srv.badge}</span>
              </div>
              <h3 className="service-card-title">{srv.title}</h3>
              <p className="service-card-desc">{srv.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="services-cta-section">
        <div className="services-cta-card">
          <h2>Ready to list your materials or compare quotes?</h2>
          <p>Register your hardware store today or explore live rates from our verified supplier network.</p>
          <div className="services-cta-actions">
            <NavLink to="/register" className="btn-cta-register">Register as Seller</NavLink>
            <NavLink to="/" className="btn-cta-browse">Browse Catalogue</NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}
