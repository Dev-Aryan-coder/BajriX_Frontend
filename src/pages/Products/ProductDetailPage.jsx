import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../lib/apiBase';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProductDetail();
  }, [id]);

  const fetchProductDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/products/${id}`);
      const detail = res.data.data;
      setProduct(detail);
      // listings come nested in the product detail response as sellerListings
      setListings(detail.sellerListings || detail.listings || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Product not found.');
      } else {
        setError('Could not load product details. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pdp-page">
        <div className="pdp-skeleton-header" />
        <div className="pdp-skeleton-table" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdp-page">
        <div className="pdp-error">
          <span>⚠️</span> {error}
          <button className="pdp-back-btn" onClick={() => navigate(-1)}>← Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pdp-page">

      {/* Back nav */}
      <button className="pdp-back-btn" onClick={() => navigate(-1)}>
        ← Back to products
      </button>

      {/* Product header */}
      <div className="pdp-header">
        <span className="pdp-category-badge">{product.category}</span>
        <h1 className="pdp-product-name">{product.name}</h1>
        {product.description && (
          <p className="pdp-product-desc">{product.description}</p>
        )}
      </div>

      {/* Seller comparison table — the core screen */}
      <div className="pdp-listings-section">
        <h2 className="pdp-listings-title">
          Available from {listings.length} seller{listings.length !== 1 ? 's' : ''}
        </h2>

        {listings.length === 0 ? (
          <div className="pdp-empty">
            <div className="pdp-empty-icon">🏪</div>
            <h3>Currently unavailable</h3>
            <p>
              This product exists in our catalogue but no approved seller is currently
              listing it. Check back later.
            </p>
          </div>
        ) : (
          <div className="pdp-table-wrapper">
            <table className="pdp-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th>Status</th>
                  <th>Price (₹)</th>
                  <th>Stock</th>
                  <th>Min. Order (MOQ)</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing, index) => (
                  <tr key={listing.id} className={index === 0 ? 'pdp-best-price' : ''}>
                    <td>
                      <div className="pdp-seller-name">{listing.sellerName}</div>
                      {index === 0 && (
                        <span className="pdp-best-badge">Best Price</span>
                      )}
                    </td>
                    <td>
                      <span className={`pdp-status-badge pdp-status-${listing.sellerStatus?.toLowerCase()}`}>
                        {listing.sellerStatus === 'APPROVED' ? '✓ APPROVED' : (listing.sellerStatus || 'APPROVED')}
                      </span>
                    </td>
                    <td className="pdp-price-cell">
                      ₹{Number(listing.price).toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className={listing.stockQuantity === 0 ? 'pdp-out-of-stock' : ''}>
                        {listing.stockQuantity === 0 ? 'Out of stock' : `${listing.stockQuantity} units`}
                      </span>
                    </td>
                    <td>{listing.minOrderQuantity} units</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="pdp-table-note">
              ✓ Sorted by lowest price. Only showing listings from approved sellers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
