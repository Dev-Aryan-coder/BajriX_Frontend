import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import './ContactUsPage.css';

/**
 * ContactUsPage Component:
 * Provides direct contact channels and an inquiry form for both buyers and suppliers.
 */
export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Buyer Enquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate inquiry submission
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-tag">Get in Touch</span>
          <h1 className="contact-title">We're Here to Help Your Build</h1>
          <p className="contact-subtitle">
            Have questions about comparing quotes, vendor onboarding, or wholesale procurement? Drop us a message.
          </p>
        </div>
      </section>

      <section className="contact-content-section">
        <div className="contact-grid">
          {/* Left: Contact Info Cards */}
          <div className="contact-info-column">
            <h2>Contact Information</h2>
            <p className="contact-info-desc">
              Reach out to our platform support team or visit our regional distribution liaison office.
            </p>

            <div className="contact-cards">
              <div className="contact-card">
                <div className="contact-icon"><Mail size={22} /></div>
                <div>
                  <h4>Email Support</h4>
                  <p>support@bajrix.com</p>
                  <span className="contact-sub">Response within 2-4 business hours</span>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon"><Phone size={22} /></div>
                <div>
                  <h4>Supplier Helpline</h4>
                  <p>+91 (022) 2854-9100</p>
                  <span className="contact-sub">Monday – Saturday (9 AM – 7 PM)</span>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon"><MapPin size={22} /></div>
                <div>
                  <h4>Headquarters</h4>
                  <p>Industrial Estate, Yard No. 14, Mumbai, Maharashtra</p>
                  <span className="contact-sub">India</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-column">
            <div className="contact-form-card">
              {submitted ? (
                <div className="contact-success-box">
                  <CheckCircle size={48} color="var(--success)" />
                  <h3>Message Sent Successfully!</h3>
                  <p>Thank you, <strong>{formData.name}</strong>. A BajriX material representative will get back to you shortly.</p>
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', subject: 'Buyer Enquiry', message: '' });
                    }}
                    className="btn-send-another"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h3>Send Us a Message</h3>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Rajesh Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g., rajesh@buildcorp.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Inquiry Type</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="form-select"
                    >
                      <option value="Buyer Enquiry">Buyer: Material & Quote Inquiries</option>
                      <option value="Seller Onboarding">Seller: Registering Hardware Store</option>
                      <option value="Technical Support">Technical & Account Support</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Message / Order Details</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please specify materials, required quantity, or questions..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-textarea"
                    />
                  </div>

                  <button type="submit" className="btn-contact-submit">
                    <Send size={16} />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
