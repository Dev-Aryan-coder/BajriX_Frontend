import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../lib/apiBase';
import './SellerDashboardPage.css';

export default function SellerDashboardPage() {
  const navigate = useNavigate();

  // grab session from localStorage — set on login/register
  const sellerRaw = localStorage.getItem('bajrix_seller');
  const seller = sellerRaw ? JSON.parse(sellerRaw) : null;
  const sessionToken = localStorage.getItem('bajrix_session_token');

  const [listings, setListings] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toggleLoading, setToggleLoading] = useState(null); // listingId being toggled

  // redirect if not logged in
  useEffect(() => {
    if (!seller || !sessionToken) {
      navigate('/login');
      return;
    }
    fetchListings(0);
  }, []);

  const fetchListings = async (page = 0) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${API_BASE}/sellers/${seller.id}/listings`,
        {
          params: { page, size: 20 },
          headers: { 'X-Session-Token': sessionToken },
        }
      );
      const pageData = res.data.data;
      setListings(pageData.content || []);
      setPagination({ page: pageData.number, totalPages: pageData.totalPages });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        // session expired or tampered — boot to login
        localStorage.removeItem('bajrix_seller');
        localStorage.removeItem('bajrix_session_token');
        navigate('/login');
      } else {
        setError('Could not load your listings. Try refreshing.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (listing) => {
    setToggleLoading(listing.id);
    try {
      const newActive = !listing.isActive;
      await axios.patch(
        `${API_BASE}/sellers/${seller.id}/listings/${listing.id}/status`,
        null,
        {
          params: { active: newActive },
          headers: { 'X-Session-Token': sessionToken },
        }
      );
      // update locally — no full re-fetch needed
      setListings((prev) =>
        prev.map((l) => (l.id === listing.id ? { ...l, isActive: newActive } : l))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Could not update listing status.');
    } finally {
      setToggleLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bajrix_seller');
    localStorage.removeItem('bajrix_session_token');
    navigate('/login');
  };

  if (!seller) return null;

  const statusBannerMap = {
    PENDING: {
      cls: 'status-banner--pending',
      text: "⏳ Your account is pending approval. You can prepare listings now — they'll go live once approved.",
    },
    REJECTED: {
      cls: 'status-banner--rejected',
      text: '❌ Your seller account was not approved. Contact support for more information.',
    },
  };

  const banner = statusBannerMap[seller.status];

  return (
    <div className="dashboard-page">

      {/* Status banner — only shows for PENDING or REJECTED */}
      {banner && (
        <div className={`status-banner ${banner.cls}`}>
          {banner.text}
        </div>
      )}

      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Listings</h1>
          <p className="dashboard-sub">
            Logged in as <strong>{seller.name}</strong> · {seller.email}
          </p>
        </div>
        <div className="dashboard-actions">
          <button
            className="btn-add-listing"
            onClick={() => navigate('/seller/listings/new')}
          >
            + Add Product
          </button>
          <button className="btn-logout-dash" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && <div className="dashboard-error">{error}</div>}

      {/* Loading */}
      {loading && (
        <div className="dashboard-skeletons">
          {[1, 2, 3].map((i) => <div key={i} className="dashboard-skeleton-row" />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && listings.length === 0 && (
        <div className="dashboard-empty">
          <div className="dashboard-empty-icon">📋</div>
          <h3>No listings yet</h3>
          <p>Add your first product to start selling on BajriX.</p>
          <button
            className="btn-add-listing"
            onClick={() => navigate('/seller/listings/new')}
          >
            + Add your first product
          </button>
        </div>
      )}

      {/* Listings table */}
      {!loading && !error && listings.length > 0 && (
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Stock</th>
                <th>MOQ</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className={!listing.isActive ? 'row-inactive' : ''}>
                  <td className="td-product-name">{listing.productName}</td>
                  <td>{listing.productCategory}</td>
                  <td className="td-price">₹{Number(listing.price).toLocaleString('en-IN')}</td>
                  <td>{listing.stockQuantity}</td>
                  <td>{listing.minOrderQuantity}</td>
                  <td>
                    <span className={`status-pill ${listing.isActive ? 'status-pill--active' : 'status-pill--inactive'}`}>
                      {listing.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/seller/listings/${listing.id}/edit`, { state: { listing } })}
                    >
                      Edit
                    </button>
                    <button
                      className={`btn-toggle ${listing.isActive ? 'btn-toggle--stop' : 'btn-toggle--resume'}`}
                      disabled={toggleLoading === listing.id}
                      onClick={() => handleToggleActive(listing)}
                    >
                      {toggleLoading === listing.id
                        ? '...'
                        : listing.isActive
                        ? 'Stop selling'
                        : 'Resume selling'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="dashboard-pagination">
          <button
            disabled={pagination.page === 0}
            onClick={() => fetchListings(pagination.page - 1)}
            className="page-btn"
          >
            ← Prev
          </button>
          <span>Page {pagination.page + 1} of {pagination.totalPages}</span>
          <button
            disabled={pagination.page === pagination.totalPages - 1}
            onClick={() => fetchListings(pagination.page + 1)}
            className="page-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
