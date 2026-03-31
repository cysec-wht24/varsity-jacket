import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import Header from '../../components/header';
import { getProductById } from '../../constants/products';
import useCustomStore, { getColorPremium } from '../../store/useCustomStore';
import ConfiguratorScene from '../../components/configurator/scene';
import { PLACEMENT_ZONES } from '../../components/configurator/shirtModel';
import { saveUserData } from '../../../lib/client'; 
import { COLOR_PALETTE, CATEGORIES, DEFAULT_COLOR_ID } from '../../components/configurator/colors';
import './index.css';

const SIZING_GUIDE = [
  { id: 'XXS', cm: '81 - 86 cm', in: '32 - 34"' },
  { id: 'XS',  cm: '86 - 91 cm', in: '34 - 36"' },
  { id: 'S',   cm: '91 - 96 cm', in: '36 - 38"' },
  { id: 'M',   cm: '96 - 101 cm', in: '38 - 40"' },
  { id: 'L',   cm: '101 - 106 cm', in: '40 - 42"' },
  { id: 'XL',  cm: '106 - 111 cm', in: '42 - 44"' },
  { id: 'XXL', cm: '111 - 116 cm', in: '44 - 46"' },
  { id: '3XL', cm: '116 - 121 cm', in: '46 - 48"' },
  { id: '4XL', cm: '121 - 126 cm', in: '48 - 50"' },
  { id: '5XL', cm: '126 - 131 cm', in: '50 - 52"' },
];

/* ── small sub-components ───────────────────────────────── */

function ColorSwatch({ color, isSelected, onClick }) {
  return (
    <button
      className={`cfg-swatch ${isSelected ? 'cfg-swatch--selected' : ''}`}
      onClick={() => onClick(color)}
      title={color.name}
    >
      <span className="cfg-swatch-inner" style={{ background: color.hex }} />
      {isSelected && <span className="cfg-swatch-check">✓</span>}
    </button>
  );
}

function ZoneCard({ zone, isSelected, onClick }) {
  return (
    <button
      className={`cfg-zone-card ${isSelected ? 'cfg-zone-card--selected' : ''}`}
      onClick={() => onClick(zone)}
    >
      <div className="cfg-zone-preview">
        <svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg" className="cfg-zone-svg">
          <path
            d="M18 8 L8 20 L16 23 L16 62 L44 62 L44 23 L52 20 L42 8 L34 12 Q30 14 26 12 Z"
            fill="#2a2520" stroke="#3a3530" strokeWidth="0.8"
          />
          <path d="M18 8 L8 20 L16 23 L18 18 Z" fill="#222" stroke="#3a3530" strokeWidth="0.6" />
          <path d="M42 8 L52 20 L44 23 L42 18 Z" fill="#222" stroke="#3a3530" strokeWidth="0.6" />
          {zone.id === 'left-chest'  && <rect x="18" y="22" width="11" height="9"  fill="#c8a96e" opacity="0.8" rx="1" />}
          {zone.id === 'right-chest' && <rect x="31" y="22" width="11" height="9"  fill="#c8a96e" opacity="0.8" rx="1" />}
          {zone.id === 'left-sleeve' && <rect x="9"  y="13" width="8"  height="8"  fill="#c8a96e" opacity="0.8" rx="1" />}
        </svg>
      </div>
      <span className="cfg-zone-label">{zone.label}</span>
    </button>
  );
}

/* ── main page ──────────────────────────────────────────── */

export default function CustomizePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const addToCart = useCustomStore(s => s.addToCart);
  const initProduct = useCustomStore(s => s.initProduct);
  const selections = useCustomStore(s => s.selections);
  const setStoreColor = useCustomStore(s => s.setColor);
  const setSize = useCustomStore(s => s.setSize);
  const setSelection = useCustomStore(s => s.setSelection);

  // Configurator state (local UI)
  const [selectedColorId, setSelectedColorId] = useState(DEFAULT_COLOR_ID);
  const [activeCategory, setActiveCategory]   = useState('All');
  const [autoRotate, setAutoRotate]           = useState(false);
  const [isInteracting, setIsInteracting]     = useState(false);
  const [showColorName, setShowColorName]     = useState(false);
  const [activeTab, setActiveTab]             = useState('color');
  const [selectedZoneId, setSelectedZoneId]   = useState(null);
  
  // Custom Graphic/Text
  const [customImageURL, setCustomImageURL]   = useState(null);
  const [logoTexture, setLogoTexture]         = useState(null);
  const nameTimerRef = useRef(null);

  const selectedColor = COLOR_PALETTE.find(c => c.id === selectedColorId);
  const filteredColors = activeCategory === 'All'
    ? COLOR_PALETTE
    : COLOR_PALETTE.filter(c => c.category === activeCategory);

  // Init product in store on mount
  useEffect(() => {
    if (product) initProduct(product);
  }, [product, initProduct]);

  const textValue = selections?.text?.value || '';
  const textFont  = selections?.text?.font || 'Oswald';
  const textColor = selections?.text?.color || '#FFFFFF';
  
  const bodyColor = selections?.body?.color || '#111111';
  const colorPrem = getColorPremium(bodyColor);
  const localTotalPrice = (product?.basePrice || 0) + (textValue.trim() ? 15 : 0) + colorPrem.price;

  // Generate dynamic canvas for Logo + Text
  useEffect(() => {
    if (!product) return;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, 512, 512);

    // Flip context so map applies correctly on the 3D glTF mesh
    ctx.translate(256, 256);
    ctx.rotate(Math.PI);
    ctx.translate(-256, -256);

    const drawText = () => {
      if (textValue) {
        ctx.fillStyle = textColor;
        const cssFont = textFont === 'Inter' ? 'Inter, sans-serif' :
                        textFont === 'Playfair Display' ? '"Playfair Display", serif' :
                        textFont === 'Caveat' ? 'Caveat, cursive' : 
                        textFont === 'Permanent Marker' ? '"Permanent Marker", cursive' :
                        textFont === 'Righteous' ? '"Righteous", cursive' :
                        textFont === 'Teko' ? '"Teko", sans-serif' :
                        '"Oswald", sans-serif';
        ctx.font = `bold 100px ${cssFont}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const y = customImageURL ? 400 : 256;
        ctx.fillText(textValue, 256, y);
      }
      const finalTex = new THREE.CanvasTexture(canvas);
      finalTex.colorSpace = THREE.SRGBColorSpace;
      finalTex.needsUpdate = true;
      setLogoTexture(finalTex);
    };

    if (customImageURL) {
      const img = new Image();
      img.onload = () => {
        const maxDim = textValue ? 360 : 450;
        let w = img.width; let h = img.height;
        const scale = Math.min(maxDim/w, maxDim/h);
        w *= scale; h *= scale;
        const y = textValue ? 20 + (360 - h)/2 : (512 - h)/2;
        ctx.drawImage(img, (512 - w)/2, y, w, h);
        drawText();
      };
      img.src = customImageURL;
    } else {
      drawText();
    }
  }, [product, customImageURL, textValue, textFont, textColor]);

  const handleColorSelect = useCallback((color) => {
    if (color.id === selectedColorId) return;
    setSelectedColorId(color.id);
    
    // Wire to store for pricing
    setStoreColor('body', color.hex);
    setStoreColor('sleeveLeft', color.hex);
    setStoreColor('sleeveRight', color.hex);

    setShowColorName(true);
    clearTimeout(nameTimerRef.current);
    nameTimerRef.current = setTimeout(() => setShowColorName(false), 2200);
  }, [selectedColorId]);

  const handleInteractionChange = useCallback((val) => setIsInteracting(val), []);

  // Keyboard color navigation
  useEffect(() => {
    const handler = (e) => {
      const idx = COLOR_PALETTE.findIndex(c => c.id === selectedColorId);
      if (e.key === 'ArrowRight') handleColorSelect(COLOR_PALETTE[(idx + 1) % COLOR_PALETTE.length]);
      if (e.key === 'ArrowLeft')  handleColorSelect(COLOR_PALETTE[(idx - 1 + COLOR_PALETTE.length) % COLOR_PALETTE.length]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedColorId, handleColorSelect]);

  const handleZoneSelect = (zone) => {
    setSelectedZoneId(prev => prev === zone.id ? null : zone.id);
  };

async function handleAddToCart() {
  const payload = {
    customer_id: crypto.randomUUID(),
    product: product.shortName,
    configuration: {
      color: selectedColor,
      zone: selectedZoneId,
      selectedColor: selectedColor,
      selectedColorHex: selectedColor?.hex,
      selectedZone: selectedZoneId,
      size: selections?.size,
      customImageIncluded: !!customImageURL,
      customText: textValue,
      price: localTotalPrice
    }
  }

  const success = await saveUserData(payload)

  if (success) {
    console.log("✅ Saved to DB")
  } else {
    console.log("❌ Error saving data")
  }
  addToCart();
  navigate('/cart');
};

  const selectedZone = PLACEMENT_ZONES.find(z => z.id === selectedZoneId);

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede8' }}>
      <Header />
      <div style={{ textAlign: 'center', paddingTop: 200 }}>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/collection')} style={{ marginTop: 24 }}>
          ← Back to Collection
        </button>
      </div>
    </div>
  );

  return (
    <div className="cfg-page">
      <Header />

      <div className="cfg-body">
        {/* ── LEFT PANEL ── */}
        <aside className="cfg-panel cfg-panel--left">
          <div className="cfg-panel-section">
            <p className="cfg-panel-label">PRODUCT</p>
            <div className="cfg-product-name">{product.shortName}</div>
            <div className="cfg-product-price">${product.basePrice}.00</div>
            {colorPrem.price > 0 && (
              <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: 8 }}>
                + {colorPrem.label} <span style={{ color: '#ff4d00' }}>+${colorPrem.price}.00</span>
              </div>
            )}
            {textValue.trim() && (
              <div style={{ color: '#aaa', fontSize: '0.8rem', marginTop: 4 }}>
                + Custom Text / Graphic <span style={{ color: '#ff4d00' }}>+$15.00</span>
              </div>
            )}
          </div>

          <div className="cfg-divider" />

          <div className="cfg-panel-section">
            <p className="cfg-panel-label">SPECS</p>
            <div className="cfg-detail-rows">
              {Object.entries(product.specs).map(([k, v]) => (
                <div className="cfg-detail-row" key={k}>
                  <span className="cfg-detail-key">{k.toUpperCase()}</span>
                  <span className="cfg-detail-val">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cfg-divider" />

          <div className="cfg-panel-section">
            <p className="cfg-panel-label">VIEWER</p>
            <button
              className={`cfg-toggle-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(v => !v)}
            >
              <span>{autoRotate ? '⏸' : '▶'}</span>
              <span>{autoRotate ? 'PAUSE' : 'AUTO ROTATE'}</span>
            </button>
            <p className="cfg-hint">Drag to orbit · Scroll to zoom</p>
          </div>

          {selectedZoneId && (
            <>
              <div className="cfg-divider" />
              <div className="cfg-panel-section">
                <p className="cfg-panel-label">ACTIVE PLACEMENT</p>
                <div className="cfg-active-zone">
                  <span className="cfg-active-zone-name">{selectedZone?.label}</span>
                  <button className="cfg-remove-btn" onClick={() => setSelectedZoneId(null)}>✕</button>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* ── VIEWPORT ── */}
        <div className="cfg-viewport">
          <Suspense fallback={null}>
            <ConfiguratorScene
              color={selectedColor?.hex || '#111111'}
              autoRotate={autoRotate && !isInteracting}
              onInteractionChange={handleInteractionChange}
              selectedZoneId={selectedZoneId}
              logoTexture={logoTexture}
            />
          </Suspense>

          {/* Color name toast */}
          <div className={`cfg-toast ${showColorName ? 'cfg-toast--visible' : ''}`}>
            <span className="cfg-toast-swatch" style={{ background: selectedColor?.hex }} />
            <div>
              <div className="cfg-toast-name">{selectedColor?.name}</div>
              <div className="cfg-toast-cat">{selectedColor?.category}</div>
            </div>
          </div>

          {/* Back button */}
          <button
            className="cfg-back-btn"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            ← Back
          </button>
        </div>

        {/* ── RIGHT PANEL ── */}
        <aside className="cfg-panel cfg-panel--right">
          {/* Tabs */}
          <div className="cfg-tabs">
            <button
              className={`cfg-tab ${activeTab === 'color' ? 'cfg-tab--active' : ''}`}
              onClick={() => setActiveTab('color')}
            >COLOR</button>
            <button
              className={`cfg-tab ${activeTab === 'logo' ? 'cfg-tab--active' : ''}`}
              onClick={() => setActiveTab('logo')}
            >LOGO</button>
            <button
              className={`cfg-tab ${activeTab === 'size' ? 'cfg-tab--active' : ''}`}
              onClick={() => setActiveTab('size')}
            >SIZE</button>
          </div>

          <div className="cfg-panel-scroll">

            {/* COLOR TAB */}
            {activeTab === 'color' && (
              <>
                <div className="cfg-panel-section">
                  <div className="cfg-selected-color-display">
                    <div className="cfg-selected-preview" style={{ background: selectedColor?.hex }} />
                    <div>
                      <div className="cfg-selected-name">{selectedColor?.name}</div>
                      <div className="cfg-selected-hex">{selectedColor?.hex}</div>
                      <div className="cfg-selected-cat">{selectedColor?.category}</div>
                    </div>
                  </div>
                </div>

                <div className="cfg-cat-tabs">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      className={`cfg-cat-tab ${activeCategory === cat ? 'cfg-cat-tab--active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat === 'Statement' ? 'STATE' : cat.toUpperCase().slice(0, 6)}
                    </button>
                  ))}
                </div>

                <div className="cfg-color-grid-wrap">
                  <div className="cfg-color-grid">
                    {filteredColors.map(color => (
                      <ColorSwatch
                        key={color.id}
                        color={color}
                        isSelected={color.id === selectedColorId}
                        onClick={handleColorSelect}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* LOGO TAB */}
            {activeTab === 'logo' && (
              <div>
                <div className="cfg-panel-section">
                  <p className="cfg-panel-label">PLACEMENT ZONE</p>
                  <p className="cfg-hint" style={{ marginBottom: 12 }}>
                    Select where to place a logo on the shirt
                  </p>
                </div>
                <div className="cfg-zone-grid-wrap">
                  <div className="cfg-zone-grid">
                    {PLACEMENT_ZONES.map(zone => (
                      <ZoneCard
                        key={zone.id}
                        zone={zone}
                        isSelected={selectedZoneId === zone.id}
                        onClick={handleZoneSelect}
                      />
                    ))}
                  </div>
                </div>
                <div className="cfg-panel-section" style={{ marginTop: 24, padding: '0 14px' }}>
                  <p className="cfg-panel-label" style={{ padding: 0 }}>GRAPHIC UPLOAD</p>
                  <label style={{ display: 'block', background: '#1a1a1a', border: '1px dashed #333', color: '#888', padding: '12px', textAlign: 'center', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem', marginTop: 8 }}>
                    {customImageURL ? 'Image Selected (Click to change)' : '+ Choose Image File'}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                           setCustomImageURL(URL.createObjectURL(e.target.files[0]));
                        }
                      }} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                  {customImageURL && (
                    <button onClick={() => setCustomImageURL(null)} style={{ background: 'none', border: 'none', color: '#ff4d00', fontSize: '0.7rem', marginTop: 8, cursor: 'pointer' }}>Remove Image</button>
                  )}
                </div>

                <div className="cfg-panel-section" style={{ marginTop: 24, padding: '0 14px' }}>
                  <p className="cfg-panel-label" style={{ padding: 0 }}>CUSTOM TEXT</p>
                  <input 
                    type="text" 
                    placeholder="Enter custom text..." 
                    value={textValue} 
                    onChange={e => setSelection('text', 'value', e.target.value)}
                    style={{ width: '100%', padding: '10px', background: '#111', border: '1px solid #333', color: '#fff', marginTop: 8, borderRadius: 4 }}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <select 
                      value={textFont} 
                      onChange={e => setSelection('text', 'font', e.target.value)}
                      style={{ flex: 1, padding: '8px', background: '#111', border: '1px solid #333', color: '#888', borderRadius: 4 }}
                    >
                      <option value="Oswald">Oswald</option>
                      <option value="Inter">Inter (Clean)</option>
                      <option value="Permanent Marker">Marker</option>
                      <option value="Righteous">Righteous (Bold)</option>
                      <option value="Teko">Teko (Athletic)</option>
                      <option value="Playfair Display">Playfair (Serif)</option>
                      <option value="Caveat">Handwritten</option>
                    </select>
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={e => setSelection('text', 'color', e.target.value)}
                      style={{ width: 44, height: 36, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SIZE TAB */}
            {activeTab === 'size' && (
              <div>
                <div className="cfg-panel-section">
                  <p className="cfg-panel-label">SELECT SIZE</p>
                  <p className="cfg-hint" style={{ marginBottom: 12 }}>Chest measurement guide</p>
                </div>
                
                <div style={{ padding: '0 14px 14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr', padding: '0 8px 6px', fontSize: '0.65rem', color: '#5a5550', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #161616', marginBottom: 4 }}>
                      <span>Size</span><span>CM</span><span>Inches</span>
                    </div>
                    {SIZING_GUIDE.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSize(s.id)}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '40px 1fr 1fr',
                          alignItems: 'center',
                          textAlign: 'left',
                          width: '100%',
                          background: selections?.size === s.id ? 'rgba(200,169,110,0.08)' : 'transparent',
                          border: `1px solid ${selections?.size === s.id ? '#c8a96e' : 'transparent'}`,
                          color: selections?.size === s.id ? '#c8a96e' : '#a0998f',
                          padding: '8px',
                          borderRadius: 3,
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          transition: 'all 0.15s',
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>{s.id}</span>
                        <span>{s.cm}</span>
                        <span>{s.in}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="cfg-cta-wrap">
            <div className="cfg-divider" />
            <div className="cfg-panel-section">
              <div className="cfg-price-row">
                <span className="cfg-price">${localTotalPrice}.00</span>
                <span className="cfg-free-ship">FREE SHIPPING</span>
              </div>
              <button className="cfg-add-btn" onClick={handleAddToCart}>
                <span>ADD TO CART</span>
                <span>→</span>
              </button>
              <button className="cfg-back-link" onClick={() => navigate(`/product/${product.id}`)}>
                ← Back to Product
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
