import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Package, 
  Store, 
  Layers, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Search
} from 'lucide-react';
import { API_BASE } from '../../lib/apiBase';
import './AdminDashboardPage.css';

const CATEGORIES = ['Cement', 'Bricks', 'Steel', 'Aggregates', 'Sand', 'Pipes', 'General'];

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  // Stats state
  const [stats, setStats] = useState({ totalProducts: 0, totalListings: 0, totalSellers: 0 });
  
  // Product list state
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Modal (Create / Edit) state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Create, object = Edit
  const [formData, setFormData] = useState({ name: '', category: 'Cement', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Load stats and products on mount with ROLE_ADMIN protection
  useEffect(() => {
    const rawUser = localStorage.getItem('bajrix_seller');
    const user = rawUser ? JSON.parse(rawUser) : null;

    if (!user || user.role !== 'ROLE_ADMIN') {
      alert('Access Denied: Only Admins can access this console.');
      navigate('/login');
      return;
    }

    fetchStats();
    fetchProducts(page);
  }, [page]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  // 1. Fetch live metrics from backend
  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/BajriXadmin@/stats`);
      if (res.data?.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // 2. Fetch paginated products
  const fetchProducts = async (pageNumber) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/BajriXadmin@/products?page=${pageNumber}&size=8`);
      if (res.data?.success) {
        setProducts(res.data.data.content || []);
        setTotalPages(res.data.data.totalPages || 0);
      }
    } catch (err) {
      showNotification('error', 'Failed to load products from server.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', category: 'Cement', description: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // 4. Open Modal for Edit
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // 5. Form validation
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required.';
    if (!formData.category.trim()) errors.category = 'Category is required.';
    return errors;
  };

  // 6. Handle Save (Create or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    try {
      if (editingProduct) {
        // UPDATE
        const res = await axios.put(`${API_BASE}/BajriXadmin@/products/${editingProduct.id}`, formData);
        showNotification('success', res.data?.message || 'Product updated successfully!');
      } else {
        // CREATE
        const res = await axios.post(`${API_BASE}/BajriXadmin@/products`, formData);
        showNotification('success', res.data?.message || 'Product created successfully!');
      }
      setIsModalOpen(false);
      fetchStats();
      fetchProducts(page);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save product.';
      showNotification('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  // 7. Handle Delete
  const handleDeleteProduct = async (product) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(`${API_BASE}/BajriXadmin@/products/${product.id}`);
      showNotification('success', res.data?.message || 'Product deleted successfully!');
      fetchStats();
      fetchProducts(page);
    } catch (err) {
      const msg = err.response?.data?.message || 'Cannot delete product with existing listings.';
      showNotification('error', msg);
    }
  };

  // Filter products by search input
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="admin-dashboard-page">
      {/* Toast Notification */}
      {notification.message && (
        <div className={`admin-toast ${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="admin-header">
        <div>
          <span className="admin-badge">Admin Console</span>
          <h1 className="admin-title">Platform Overview</h1>
          <p className="admin-subtitle">Manage master building materials catalogue and monitor marketplace metrics.</p>
        </div>
        <button className="btn-add-product" onClick={handleOpenCreateModal}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Metric Stat Cards */}
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper products-icon">
            <Package size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Master Products</span>
            <h3 className="stat-value">{stats.totalProducts}</h3>
            <span className="stat-hint">Active catalogue items</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper listings-icon">
            <Layers size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Seller Offers</span>
            <h3 className="stat-value">{stats.totalListings}</h3>
            <span className="stat-hint">Across all materials</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper sellers-icon">
            <Store size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Registered Sellers</span>
            <h3 className="stat-value">{stats.totalSellers}</h3>
            <span className="stat-hint">Material yards & vendors</span>
          </div>
        </div>
      </div>

      {/* Product Management Table Card */}
      <div className="admin-table-card">
        <div className="table-card-header">
          <div>
            <h2 className="table-title">Master Product Catalogue</h2>
            <p className="table-subtitle">All products available for sellers to offer on BajriX.</p>
          </div>

          <div className="table-actions">
            <div className="table-search-box">
              <Search size={16} className="search-icon" />
              <input 
                type="text" 
                placeholder="Filter by name or category..." 
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
            <button className="btn-refresh" title="Refresh list" onClick={() => fetchProducts(page)}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="table-responsive">
          {loading ? (
            <div className="table-loading">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="table-empty">No products found matching your search.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Created At</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td className="font-mono text-muted">#{p.id}</td>
                    <td className="font-semibold">{p.name}</td>
                    <td>
                      <span className={`category-tag cat-${p.category.toLowerCase()}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="text-muted text-sm max-w-desc">
                      {p.description || '—'}
                    </td>
                    <td className="text-muted text-sm">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="text-right">
                      <div className="action-buttons">
                        <button 
                          className="btn-action edit" 
                          title="Edit Product"
                          onClick={() => handleOpenEditModal(p)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn-action delete" 
                          title="Delete Product"
                          onClick={() => handleDeleteProduct(p)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="table-pagination">
            <span className="pagination-info">
              Page {page + 1} of {totalPages}
            </span>
            <div className="pagination-buttons">
              <button 
                disabled={page === 0} 
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
              >
                Previous
              </button>
              <button 
                disabled={page >= totalPages - 1} 
                onClick={() => setPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Master Product' : 'Add New Catalogue Product'}</h3>
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} noValidate>
              <div className="modal-body">
                <div className="admin-form-group">
                  <label>Product Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. UltraTech PPC Cement 50kg"
                    className={formErrors.name ? 'error-border' : ''}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  {formErrors.name && <span className="field-error-text">{formErrors.name}</span>}
                </div>

                <div className="admin-form-group">
                  <label>Category *</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>Technical Description / Specifications</label>
                  <textarea 
                    rows={3}
                    placeholder="e.g. Grade 53 Portland Pozzolana Cement for structural RCC casting"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-save" disabled={submitting}>
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
