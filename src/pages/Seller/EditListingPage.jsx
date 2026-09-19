import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './EditListingPage.css';

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const sellerRaw = localStorage.getItem('bajrix_seller');
  const seller = sellerRaw ? JSON.parse(sellerRaw) : null;
  const sessionToken = localStorage.getItem('bajrix_session_token');

  // Form state
  const [listing, setListing] = useState(location.state?.listing || null);
  const [price, setPrice] = useState(location.state?.listing?.price || '');
  const [stock, setStock] = useState(
    location.state?.listing?.stockQuantity !== undefined
      ? location.state.listing.stockQuantity
      : ''
  );
  const [moq, setMoq] = useState(
    location.state?.listing?.minOrderQuantity !== undefined
      ? location.state.listing.minOrderQuantity
      : ''
  );
  const [isActive, setIsActive] = useState(
    location.state?.listing?.isActive !== undefined
      ? location.state.listing.isActive
      : true
  );
  const [version, setVersion] = useState(location.state?.listing?.version ?? 0);

  const [loading, setLoading] = useState(!location.state?.listing);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [concurrencyConflict, setConcurrencyConflict] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!seller || !sessionToken) {
      navigate('/login');
      return;
    }

    if (!listing) {
      fetchListing();
    }
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    setServerError('');
    setConcurrencyConflict(false);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/sellers/${seller.id}/listings`,
        {
          params: { page: 0, size: 100 },
          headers: { 'X-Session-Token': sessionToken },
        }
      );
      const items = res.data?.data?.content || [];
      const found = items.find((l) => String(l.id) === String(id));

      if (found) {
        setListing(found);
        setPrice(found.price);
        setStock(found.stockQuantity);
        setMoq(found.minOrderQuantity);
        setIsActive(found.isActive);
        setVersion(found.version);
      } else {
        setServerError('Listing not found in your catalogue.');
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('bajrix_seller');
        localStorage.removeItem('bajrix_session_token');
        navigate('/login');
      } else {
        setServerError('Failed to load listing details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!price || isNaN(price) || Number(price) <= 0) {
      errs.price = 'Price must be greater than 0.';
    }
    if (stock === '' || isNaN(stock) || Number(stock) < 0) {
      errs.stock = 'Stock cannot be negative.';
    }
    if (!moq || isNaN(moq) || Number(moq) < 1) {
      errs.moq = 'Minimum order quantity must be at least 1.';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setConcurrencyConflict(false);
    setSuccessMsg('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const payload = {
      price: Number(price),
      stockQuantity: Number(stock),
      minOrderQuantity: Number(moq),
      isActive: Boolean(isActive),
      version: Number(version),
    };

    try {
      const res = await axios.put(
        `http://localhost:8080/api/v1/sellers/${seller.id}/listings/${id}`,
        payload,
        {
          headers: { 'X-Session-Token': sessionToken },
        }
      );

      setSuccessMsg('Listing updated successfully!');
      // Update local version with response data
      if (res.data?.data) {
        setVersion(res.data.data.version);
      }

      setTimeout(() => {
        navigate('/seller/dashboard');
      }, 1000);
    } catch (err) {
      if (err.response?.status === 409) {
        // Concurrency conflict / optimistic locking failure
        setConcurrencyConflict(true);
        setServerError(
          'Concurrency Conflict: This listing was updated by another process. Please refresh the latest version before saving.'
        );
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('bajrix_seller');
        localStorage.removeItem('bajrix_session_token');
        navigate('/login');
      } else {
        setServerError(
          err.response?.data?.message || 'Could not update listing. Please check input values.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!seller) return null;

  return (
    <div className="edit-listing-page">
      <div className="edit-listing-header">
        <button className="btn-back" onClick={() => navigate('/seller/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1 className="edit-listing-title">Edit Listing</h1>
        <p className="edit-listing-sub">
          Update your price, live inventory, or selling status with real-time stock control.
        </p>
      </div>

      {loading && (
        <div className="edit-loading-card">
          <div className="edit-spinner"></div>
          <p>Loading listing details...</p>
        </div>
      )}

      {serverError && !loading && (
        <div className={`edit-alert ${concurrencyConflict ? 'alert-conflict' : 'alert-error'}`}>
          <div className="alert-content">
            <span className="alert-icon">{concurrencyConflict ? '⚠️' : '❌'}</span>
            <div>
              <strong>{concurrencyConflict ? 'Conflict Detected' : 'Error'}</strong>
              <p>{serverError}</p>
            </div>
          </div>
          {concurrencyConflict && (
            <button className="btn-conflict-refresh" onClick={fetchListing}>
              Refresh Latest Data
            </button>
          )}
        </div>
      )}

      {successMsg && (
        <div className="edit-alert alert-success">
          <span className="alert-icon">✅</span>
          <p>{successMsg}</p>
        </div>
      )}

      {!loading && listing && (
        <form onSubmit={handleSubmit} className="edit-listing-form">
          {/* Product Overview (Immutable) */}
          <section className="edit-section">
            <h2 className="edit-section-title">Product Information</h2>
            <div className="readonly-product-box">
              <div>
                <div className="readonly-product-name">{listing.productName}</div>
                <div className="readonly-product-cat">{listing.productCategory}</div>
              </div>
              <div className="version-tag">
                Lock Version: v{version}
              </div>
            </div>
          </section>

          {/* Pricing & Stock (Editable) */}
          <section className="edit-section">
            <h2 className="edit-section-title">Pricing & Stock Inventory</h2>
            <div className="edit-fields-grid">
              <div className="field-group">
                <label>Unit Price (₹) *</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={`field-input ${errors.price ? 'field-error' : ''}`}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 350"
                  required
                />
                {errors.price && <span className="error-msg">{errors.price}</span>}
              </div>

              <div className="field-group">
                <label>Stock Available *</label>
                <input
                  type="number"
                  min="0"
                  className={`field-input ${errors.stock ? 'field-error' : ''}`}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="e.g. 500"
                  required
                />
                {errors.stock && <span className="error-msg">{errors.stock}</span>}
              </div>

              <div className="field-group">
                <label>Min. Order Quantity (MOQ) *</label>
                <input
                  type="number"
                  min="1"
                  className={`field-input ${errors.moq ? 'field-error' : ''}`}
                  value={moq}
                  onChange={(e) => setMoq(e.target.value)}
                  placeholder="e.g. 10"
                  required
                />
                {errors.moq && <span className="error-msg">{errors.moq}</span>}
              </div>
            </div>

            {/* Active Status Switch */}
            <div className="status-toggle-box">
              <div>
                <label className="toggle-label-main">Listing Visibility</label>
                <p className="toggle-label-sub">
                  When active, contractors and builders can view your pricing and order.
                </p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </section>

          <div className="edit-form-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/seller/dashboard')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? 'Saving Changes…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
