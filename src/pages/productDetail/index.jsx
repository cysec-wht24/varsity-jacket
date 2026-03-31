import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../../components/header';
import { getProductById, SIZES } from '../../constants/products';
import useCustomStore from '../../store/useCustomStore';
import './index.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const initProduct = useCustomStore(s => s.initProduct);
  const addToCart = useCustomStore(s => s.addToCart);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize]   = useState('M');
  const [activePhoto, setActivePhoto]     = useState(0);
  const [addedToCart, setAddedToCart]     = useState(false);

  if (!product) return (
    <div className="not-found">
      <Header />
      <div style={{textAlign:'center',paddingTop:'200px'}}>
        <h2>Product not found</h2>
        <Link to="/collection" className="btn btn-primary" style={{marginTop:24,display:'inline-flex'}}>← Back to Collection</Link>
      </div>
    </div>
  );

  const handlePersonalize = () => {
    initProduct({ ...product, selectedColorIndex: selectedColor });
    navigate(`/customize/${product.id}`);
  };

  const handleAddToCart = () => {
    initProduct({ ...product, selectedColorIndex: selectedColor });
    addToCart();
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const color = product.colors[selectedColor];

  return (
    <div className="pdp-page">
      <Header />

      <div className="pdp-container">
        {/* ── Breadcrumb ── */}
        <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
          <Link to="/collection">Collection</Link>
          <span>/</span>
          <span>{product.shortName}</span>
        </nav>

        <div className="pdp-layout">
          {/* LEFT: Photos */}
          <div className="pdp-gallery">
            <div className="pdp-main-photo">
              <img
                src={product.photos[activePhoto]}
                alt={product.name}
                className="pdp-main-img"
              />
            </div>
            {product.photos.length > 1 && (
              <div className="pdp-thumbs">
                {product.photos.map((src, i) => (
                  <button
                    key={i}
                    className={`pdp-thumb ${activePhoto === i ? 'active' : ''}`}
                    onClick={() => setActivePhoto(i)}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Info */}
          <div className="pdp-info">
            {/* Title & Price */}
            <h1 className="pdp-title">{product.name}</h1>
            <div className="pdp-pricing">
              <span className="price-main">${product.basePrice}.00</span>
              {product.originalPrice && (
                <span className="price-strike">${product.originalPrice}.00</span>
              )}
              <span className="badge">SALE</span>
            </div>

            {/* Description */}
            <p className="pdp-desc">{product.description}</p>

            <div className="divider" />

            {/* Color Selector */}
            <div className="pdp-section">
              <div className="pdp-section-header">
                <span className="pdp-label">COLOR</span>
                <span className="pdp-selected-name">{color.name}</span>
              </div>
              <div className="swatch-row">
                {product.colors.slice(0, 6).map((c, i) => (
                  <button
                    key={c.name}
                    className={`swatch swatch-lg ${selectedColor === i ? 'selected' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => setSelectedColor(i)}
                    aria-label={c.name}
                    title={c.name}
                  />
                ))}
                {product.colors.length > 6 && (
                  <span className="more-indicator">36+ more</span>
                )}
              </div>
            </div>

            {/* Support prompt */}
            <div className="pdp-support">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span>We're here to assist! <a href="#" className="support-link">Chat with us →</a></span>
            </div>

            <div className="divider" />

            {/* Specifications */}
            <div className="pdp-specs">
              <div className="spec-row">
                <span className="spec-label">Closure Type</span>
                <span className="spec-value">{product.specs.closure}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Materials</span>
                <span className="spec-value">{product.specs.materials}</span>
              </div>
              {product.specs.weight && (
                <div className="spec-row">
                  <span className="spec-label">Weight</span>
                  <span className="spec-value">{product.specs.weight}</span>
                </div>
              )}
              {product.specs.origin && (
                <div className="spec-row">
                  <span className="spec-label">Origin</span>
                  <span className="spec-value">{product.specs.origin}</span>
                </div>
              )}
            </div>

            <div className="divider" />

            {/* Size Selector */}
            <div className="pdp-section">
              <span className="pdp-label">SIZE</span>
              <div className="size-grid">
                {SIZES.map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Size ${size}`}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pdp-actions">
              <button className="btn btn-primary pdp-btn" onClick={handlePersonalize}>
                Personalize
              </button>
              <button
                className={`btn btn-secondary pdp-btn ${addedToCart ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {addedToCart ? '✓ Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
