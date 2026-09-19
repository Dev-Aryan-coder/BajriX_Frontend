import React from 'react';
import { Target, Users, Shield, TrendingUp } from 'lucide-react';
import './AboutUsPage.css';

/**
 * AboutUsPage Component:
 * Explains the mission, vision, and core marketplace problem BajriX solves.
 */
export default function AboutUsPage() {
  return (
    <div className="about-page">
      {/* Header Banner */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-tag">Our Story & Purpose</span>
          <h1 className="about-title">
            Revolutionizing how building materials are discovered & compared.
          </h1>
          <p className="about-subtitle">
            Traditionally, comparing cement, brick, or steel rates required calling multiple local hardware stores or physically visiting yards. BajriX replaces that friction with a transparent, multi-seller marketplace.
          </p>
        </div>
      </section>

      {/* Core Mission & Philosophy */}
      <section className="about-section">
        <div className="about-grid-2">
          <div className="about-text-block">
            <h2>The Multi-Seller Difference</h2>
            <p>
              On BajriX, products like <strong>UltraTech PPC Cement 50kg</strong> or <strong>Tata Tiscon TMT Rebar</strong> are shared catalogue entries. Instead of 50 duplicate listings confusing buyers, a single catalogue item shows every approved local vendor offering it.
            </p>
            <p>
              Buyers immediately see who has the best price per unit, how much stock is physically available in the yard, and the minimum order quantity (MOQ) required.
            </p>
          </div>
          <div className="about-highlight-box">
            <h3>Why Local Sellers Love BajriX</h3>
            <ul className="about-points-list">
              <li>
                <strong>Equal Visibility:</strong> Independent vendors compete side-by-side on fair pricing, inventory readiness, and local proximity.
              </li>
              <li>
                <strong>Zero Vendor Overlap:</strong> One seller can never tamper with or alter another seller's stock or pricing data.
              </li>
              <li>
                <strong>Instant Listing:</strong> Sellers can link to existing catalogue items in seconds or introduce new verified products.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="values-section">
        <h2 className="values-heading">Our Core Pillars</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon"><Target size={28} /></div>
            <h3>Price Transparency</h3>
            <p>No hidden contractor markups or arbitrary phone quotes. Live prices are visible to every buyer upfront.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><Shield size={28} /></div>
            <h3>Strict Vendor Verification</h3>
            <p>Only APPROVED sellers' listings appear to buyers. Unverified or pending vendors remain hidden until checked.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><Users size={28} /></div>
            <h3>Empowering Local Trade</h3>
            <p>We give local yards, distributors, and dealers digital discovery without requiring complex e-commerce setups.</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><TrendingUp size={28} /></div>
            <h3>Real-Time Availability</h3>
            <p>See live stock counts and minimum order limits before placing building material enquiries.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
