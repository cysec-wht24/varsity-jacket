import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/header';
import { PRODUCTS } from '../../constants/products';
import './index.css';

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  return (
    <div className="gallery-page">
      <Header />
      <div className="gallery-container">
        <div className="gallery-header">
          <h1 className="gallery-title">COLLECTION</h1>
          <p className="gallery-sub text-secondary">Design every detail. Own it completely.</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs" role="tablist">
          {[
            { key: 'all',    label: 'All' },
            { key: 'jacket', label: 'Jackets' },
            { key: 'hoodie', label: 'Hoodies' },
          ].map(tab => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={filter === tab.key}
              className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const [hoveredColor, setHoveredColor] = useState(null);

  return (
    <Link to={`/product/${product.id}`} className="product-card" aria-label={`View ${product.name}`}>
      {/* Image */}
      <div className="product-card-img-wrap">
        <img
          src={hoveredColor ? product.thumbnail : product.thumbnail}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
        {/* Tag */}
        {product.tags?.[0] && (
          <span className="product-tag">{product.tags[0].toUpperCase()}</span>
        )}
        {/* Hover overlay */}
        <div className="product-card-overlay">
          <span className="btn btn-primary quickcust-btn">Customize →</span>
        </div>
      </div>

      {/* Info */}
      <div className="product-card-info">
        <h3 className="product-card-name">{product.shortName}</h3>
        <div className="product-card-pricing">
          <span className="price-main" style={{fontSize:'1.1rem'}}>${product.basePrice}</span>
          {product.originalPrice && (
            <span className="price-strike">${product.originalPrice}</span>
          )}
        </div>
        {/* Color Swatches */}
        <div className="swatch-row product-card-swatches">
          {product.colors.slice(0, 5).map(c => (
            <button
              key={c.name}
              className="swatch"
              style={{ background: c.hex }}
              aria-label={c.name}
              title={c.name}
              onMouseEnter={() => setHoveredColor(c)}
              onMouseLeave={() => setHoveredColor(null)}
              onClick={e => e.preventDefault()}
            />
          ))}
          {product.colors.length > 5 && (
            <span className="swatch-more">+{product.colors.length - 5}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
