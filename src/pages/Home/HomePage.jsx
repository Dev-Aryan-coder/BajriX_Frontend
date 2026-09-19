import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Building2, Layers, Compass, ShieldCheck } from 'lucide-react';
import './HomePage.css';

/**
 * HomePage Component:
 * 
 * Rules strictly followed:
 * - NO FAKE / MOCK DATA: All catalogue products are fetched directly from the Spring Boot API (`/api/v1/products`) via axios.
 * - Displays lowest available price and seller counts for each product.
 * - Allows searching by keyword and filtering by category.
 */
export default function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState(null);

  // Fetch real catalogue data from backend
  const fetchProducts = async (search = '', category = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:8080/api/v1/products', {
        params: {
          search: search || undefined,
          category: category || undefined,
          page: 0,
          size: 12,
        },
      });

      if (response.data && response.data.data) {
        setProducts(response.data.data.content || []);
      }
    } catch (err) {
      console.error('Error fetching products from backend:', err);
      setError('Could not connect to Spring Boot backend at http://localhost:8080. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchQuery, selectedCategory);
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(searchQuery, selectedCategory);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(selectedCategory === category ? '' : category);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero-content">
          <div className="badge-tagline">
            <ShieldCheck size={16} color="var(--primary)" />
            <span>Verified Local Suppliers & Transparent Pricing</span>
          </div>
          <h1 className="home-hero-title">
            Compare every seller <br />
            <span className="highlight-text">before you order.</span>
          </h1>
          <p className="home-hero-desc">
            A single product, priced by every seller who stocks it. Compare live rates, stock quantities, and minimum order limits side by side.
          </p>

          {/* Search Bar */}
          <form className="home-search-form" onSubmit={handleSearchSubmit}>
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by material (e.g., UltraTech Cement, Bricks, TMT Steel)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="home-search-input"
            />
            <button type="submit" className="home-search-btn">
              Search Rates
            </button>
          </form>

          {/* Category Quick Filters */}
          <div className="category-chips">
            <span className="category-chips-label">Popular Categories:</span>
            {['Cement', 'Bricks', 'Steel', 'Aggregates'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Live Catalogue Products Grid */}
      <section className="catalogue-section">
        <div className="catalogue-header">
          <div>
            <h2 className="section-title">Available Materials Catalogue</h2>
            <p className="section-subtitle">
              Real-time prices from APPROVED local vendors. Click any product to compare seller quotes.
            </p>
          </div>
          {selectedCategory && (
            <button 
              onClick={() => setSelectedCategory('')}
              className="btn-clear-filter"
            >
              Clear Filter: <strong>{selectedCategory}</strong> ✕
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="state-card loading-state">
            <div className="spinner"></div>
            <p>Fetching real-time product rates from Spring Boot...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="state-card error-state">
            <h3>Backend Connection Error</h3>
            <p>{error}</p>
            <button onClick={() => fetchProducts(searchQuery, selectedCategory)} className="btn-retry">
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="state-card empty-state">
            <Layers size={48} color="var(--muted-foreground)" />
            <h3>No Products Found</h3>
            <p>No catalogue items match your query. Try a different search term or clear your category filter.</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card"
                onClick={() => navigate(`/products/${product.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="product-category-tag">{product.category}</div>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description || 'Verified industrial grade building material.'}</p>
                
                <div className="product-footer">
                  <div>
                    <div className="price-label">Starting From</div>
                    <div className="product-price">
                      {product.lowestPrice ? `₹${product.lowestPrice}` : 'Unavailable'}
                    </div>
                  </div>
                  <div className="product-sellers-count">
                    <Building2 size={16} />
                    <span>{product.sellerCount} {product.sellerCount === 1 ? 'Seller' : 'Sellers'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
