import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../../lib/apiBase';
import './ProductListPage.css';

// Categories that match what's in the DB — just shortcuts for the buyer
const CATEGORIES = ['Cement', 'Bricks', 'Tiles', 'Steel', 'Sand', 'Aggregates', 'Wood', 'Paint'];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // pull initial search/category from URL so browser back works
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentPage = parseInt(searchParams.get('page') || '0');

  // fetch runs whenever search params change (page, category, search)
  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (searchParams.get('category')) params.category = searchParams.get('category');
      params.page = searchParams.get('page') || 0;
      params.size = 12;

      const res = await axios.get(`${API_BASE}/products`, { params });
      const pageData = res.data.data;
      setProducts(pageData.content || []);
      setPagination({
        page: pageData.number,
        totalPages: pageData.totalPages,
        totalElements: pageData.totalElements,
      });
    } catch (err) {
      setError('Could not load products. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // reset to page 0 on new search
    const next = {};
    if (searchInput) next.search = searchInput;
    if (category) next.category = category;
    setSearchParams(next);
  };

  const handleCategoryClick = (cat) => {
    const next = {};
    const newCat = category === cat ? '' : cat;
    if (searchInput) next.search = searchInput;
    if (newCat) next.category = newCat;
    setCategory(newCat);
    setSearchParams(next);
  };

  const handlePageChange = (newPage) => {
    const next = {};
    if (searchParams.get('search')) next.search = searchParams.get('search');
    if (searchParams.get('category')) next.category = searchParams.get('category');
    next.page = newPage;
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeSearch = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || '';

  return (
    <div className="product-list-page">

      {/* Search bar + category chips */}
      <div className="plp-search-section">
        <form onSubmit={handleSearchSubmit} className="plp-search-form">
          <input
            className="plp-search-input"
            type="text"
            placeholder="Search for cement, bricks, tiles…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="plp-search-btn">Search</button>
        </form>

        <div className="plp-categories">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`plp-cat-chip ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results header */}
      <div className="plp-results-header">
        {!loading && (
          <p className="plp-result-count">
            {pagination.totalElements > 0
              ? `${pagination.totalElements} product${pagination.totalElements !== 1 ? 's' : ''} found${activeSearch ? ` for "${activeSearch}"` : ''}${activeCategory ? ` in ${activeCategory}` : ''}`
              : ''}
          </p>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="plp-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="plp-card-skeleton" />
          ))}
        </div>
      )}

      {error && (
        <div className="plp-error">
          <span>⚠️</span> {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="plp-empty">
          <div className="plp-empty-icon">📦</div>
          <h3>No products found{activeSearch ? ` for "${activeSearch}"` : ''}</h3>
          <p>Try a different search term or browse by category above.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="plp-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className="plp-card"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="plp-card-category">{product.category}</div>
                <h3 className="plp-card-name">{product.name}</h3>
                {product.description && (
                  <p className="plp-card-desc">{product.description}</p>
                )}
                <div className="plp-card-footer">
                  <div className="plp-card-price">
                    {product.lowestPrice != null
                      ? <>from <strong>₹{Number(product.lowestPrice).toLocaleString('en-IN')}</strong></>
                      : <span className="plp-unavailable">Currently unavailable</span>}
                  </div>
                  <div className="plp-card-sellers">
                    {product.activeListingCount > 0
                      ? `${product.activeListingCount} seller${product.activeListingCount !== 1 ? 's' : ''}`
                      : '—'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="plp-pagination">
              <button
                className="plp-page-btn"
                disabled={pagination.page === 0}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                ← Prev
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`plp-page-btn ${pagination.page === i ? 'active' : ''}`}
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="plp-page-btn"
                disabled={pagination.page === pagination.totalPages - 1}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
