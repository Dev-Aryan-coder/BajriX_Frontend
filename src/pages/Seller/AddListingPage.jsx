import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../lib/apiBase';
import './AddListingPage.css';

const CATEGORIES = ['Cement', 'Bricks', 'Tiles', 'Steel', 'Sand', 'Aggregates', 'Wood', 'Paint'];

export default function AddListingPage() {
  const navigate = useNavigate();

  const sellerRaw = localStorage.getItem('bajrix_seller');
  const seller = sellerRaw ? JSON.parse(sellerRaw) : null;
  const sessionToken = localStorage.getItem('bajrix_session_token');

  // Step 1: search catalogue for existing product
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // existing product picked
  const [isNewProduct, setIsNewProduct] = useState(false); // creating new product

  // new product fields
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Step 2: listing fields
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [moq, setMoq] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const debounceRef = useRef(null);

  useEffect(() => {
    if (!seller || !sessionToken) navigate('/login');
  }, []);

  // debounced autocomplete when user types product name
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/autocomplete`, {
          params: { query: searchQuery },
        });
        setSuggestions(res.data.data || []);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, [searchQuery]);

  const handlePickProduct = (product) => {
    setSelectedProduct(product);
    setIsNewProduct(false);
    setSearchQuery(product.name);
    setSuggestions([]);
  };

  const handleCreateNew = () => {
    setSelectedProduct(null);
    setIsNewProduct(true);
    setNewName(searchQuery);
    setSuggestions([]);
  };

  const validate = () => {
    const errs = {};
    if (!selectedProduct && !isNewProduct) errs.product = 'Select an existing product or create a new one.';
    if (isNewProduct && !newName.trim()) errs.newName = 'Product name is required.';
    if (isNewProduct && !newCategory) errs.newCategory = 'Category is required.';
    if (!price || isNaN(price) || Number(price) <= 0) errs.price = 'Price must be greater than 0.';
    if (stock === '' || isNaN(stock) || Number(stock) < 0) errs.stock = 'Stock cannot be negative.';
    if (!moq || isNaN(moq) || Number(moq) < 1) errs.moq = 'MOQ must be at least 1.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);

    const body = {
      price: Number(price),
      stockQuantity: Number(stock),
      minOrderQuantity: Number(moq),
    };

    if (selectedProduct) {
      body.productId = selectedProduct.id;
    } else {
      body.newProductName = newName.trim();
      body.newProductCategory = newCategory;
      body.newProductDescription = newDescription.trim();
    }

    try {
      await axios.post(
        `${API_BASE}/sellers/${seller.id}/listings`,
        body,
        { headers: { 'X-Session-Token': sessionToken } }
      );
      navigate('/seller/dashboard', { state: { success: 'Listing added successfully!' } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      // 409 = duplicate listing for this seller + product
      if (err.response?.status === 409) {
        setServerError(`You already sell this product. Edit your existing listing instead.`);
      } else {
        setServerError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-listing-page">
      <button className="back-btn" onClick={() => navigate('/seller/dashboard')}>
        ← Back to Dashboard
      </button>
      <h1 className="add-listing-title">Add a Product Listing</h1>
      <p className="add-listing-sub">
        Search for a product already in our catalogue, or create a new one.
      </p>

      <form onSubmit={handleSubmit} className="add-listing-form" noValidate>

        {/* Step 1: Product search/select */}
        <section className="form-section">
          <h2 className="form-section-title">1. Choose Product</h2>

          <div className="field-group">
            <label>Search Product Catalogue</label>
            <input
              type="text"
              className={`field-input ${errors.product ? 'field-error' : ''}`}
              placeholder="e.g. UltraTech Cement"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedProduct(null);
                setIsNewProduct(false);
              }}
              disabled={isNewProduct}
            />
            {errors.product && <span className="error-msg">{errors.product}</span>}

            {/* Autocomplete dropdown */}
            {suggestions.length > 0 && !selectedProduct && (
              <div className="autocomplete-dropdown">
                {suggestions.map((p) => (
                  <div
                    key={p.id}
                    className="autocomplete-item"
                    onClick={() => handlePickProduct(p)}
                  >
                    <span className="ac-name">{p.name}</span>
                    <span className="ac-cat">{p.category}</span>
                  </div>
                ))}
                <div className="autocomplete-create" onClick={handleCreateNew}>
                  + Create new product "{searchQuery}"
                </div>
              </div>
            )}

            {/* No matches — create new */}
            {searchQuery.length >= 2 && suggestions.length === 0 && !selectedProduct && !isNewProduct && (
              <button type="button" className="btn-create-new" onClick={handleCreateNew}>
                + Create new product "{searchQuery}"
              </button>
            )}
          </div>

          {/* Selected product chip */}
          {selectedProduct && (
            <div className="selected-product-chip">
              <span>✓ {selectedProduct.name}</span>
              <span className="chip-cat">{selectedProduct.category}</span>
              <button type="button" onClick={() => { setSelectedProduct(null); setSearchQuery(''); }}>✕</button>
            </div>
          )}

          {/* New product form */}
          {isNewProduct && (
            <div className="new-product-fields">
              <div className="field-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  className={`field-input ${errors.newName ? 'field-error' : ''}`}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                {errors.newName && <span className="error-msg">{errors.newName}</span>}
              </div>
              <div className="field-group">
                <label>Category *</label>
                <select
                  className={`field-input ${errors.newCategory ? 'field-error' : ''}`}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.newCategory && <span className="error-msg">{errors.newCategory}</span>}
              </div>
              <div className="field-group">
                <label>Description (optional)</label>
                <textarea
                  className="field-input field-textarea"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief description of this product…"
                />
              </div>
              <button
                type="button"
                className="btn-cancel-new"
                onClick={() => { setIsNewProduct(false); setSearchQuery(''); setNewName(''); }}
              >
                Cancel — search instead
              </button>
            </div>
          )}
        </section>

        {/* Step 2: Listing details */}
        <section className="form-section">
          <h2 className="form-section-title">2. Your Listing Details</h2>

          <div className="listing-fields-grid">
            <div className="field-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className={`field-input ${errors.price ? 'field-error' : ''}`}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 350"
              />
              {errors.price && <span className="error-msg">{errors.price}</span>}
            </div>
            <div className="field-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                min="0"
                className={`field-input ${errors.stock ? 'field-error' : ''}`}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 500"
              />
              {errors.stock && <span className="error-msg">{errors.stock}</span>}
            </div>
            <div className="field-group">
              <label>Min. Order Qty (MOQ) *</label>
              <input
                type="number"
                min="1"
                className={`field-input ${errors.moq ? 'field-error' : ''}`}
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                placeholder="e.g. 10"
              />
              {errors.moq && <span className="error-msg">{errors.moq}</span>}
            </div>
          </div>
        </section>

        {serverError && <div className="server-error">{serverError}</div>}

        <div className="form-footer">
          <button type="button" className="btn-cancel" onClick={() => navigate('/seller/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Adding listing…' : 'Add Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
