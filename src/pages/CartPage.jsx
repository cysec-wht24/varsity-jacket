import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import useCustomStore from '../store/useCustomStore';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQty } = useCustomStore();

  const cartTotal = cartItems.reduce((sum, item) => sum + item.total * item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede8' }}>
        <Header />
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '120px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🧥</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12, letterSpacing: '-0.01em' }}>
            Your cart is empty
          </h2>
          <p style={{ color: '#666', marginBottom: 32, fontSize: '0.9rem' }}>
            Customize a jacket or hoodie and add it to your cart.
          </p>
          <button
            onClick={() => navigate('/collection')}
            style={{
              background: '#f0ede8',
              color: '#0a0a0a',
              border: 'none',
              padding: '12px 32px',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
            }}
          >
            BROWSE COLLECTION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede8' }}>
      <Header />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#666', textTransform: 'uppercase', marginBottom: 6 }}>
            Review your order
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            YOUR CART ({cartItems.length})
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          {/* Cart items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => removeFromCart(item.id)}
                onQtyChange={(qty) => updateQty(item.id, qty)}
              />
            ))}
          </div>

          {/* Order summary */}
          <div style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: 8,
            padding: '24px',
            position: 'sticky',
            top: 24,
          }}>
            <h3 style={{
              fontSize: '0.72rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: '#666',
              marginBottom: 20,
              margin: '0 0 20px',
            }}>
              ORDER SUMMARY
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#aaa' }}>{item.product.shortName} ×{item.qty}</span>
                  <span>${(item.total * item.qty).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #222', paddingTop: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#888', marginBottom: 8 }}>
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#888', marginBottom: 8 }}>
                <span>Shipping</span>
                <span style={{ color: '#c8a05a' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 700, marginTop: 12 }}>
                <span>Total</span>
                <span style={{ color: '#c8a05a' }}>${cartTotal.toFixed(0)}</span>
              </div>
            </div>

            <button
              className="cart-checkout-btn"
              onClick={() => alert('Checkout coming soon!')}
              style={{
                width: '100%',
                background: '#f0ede8',
                color: '#0a0a0a',
                border: 'none',
                padding: '14px',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.1em',
                marginBottom: 10,
              }}
            >
              CHECKOUT →
            </button>
            <button
              className="cart-download-btn"
              onClick={() => window.print()}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#888',
                border: '1px solid #2a2a2a',
                padding: '10px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}
            >
              DOWNLOAD BILL (PDF)
            </button>
            <button
              className="cart-continue-btn"
              onClick={() => navigate('/collection')}
              style={{
                width: '100%',
                background: 'transparent',
                color: '#888',
                border: '1px solid #2a2a2a',
                padding: '10px',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
              }}
            >
              CONTINUE SHOPPING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, onRemove, onQtyChange }) {
  const { product, selections, addOns, total, qty } = item;

  return (
    <div className="cart-item-card" style={{
      background: '#111',
      border: '1px solid #1e1e1e',
      borderRadius: 8,
      padding: '24px',
      display: 'grid',
      gridTemplateColumns: '72px 1fr auto',
      gap: 20,
    }}>
      {/* Color preview swatch */}
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 6,
        background: `linear-gradient(135deg, ${selections.body.color} 50%, ${selections.sleeveLeft.color} 50%)`,
        border: '1px solid #2a2a2a',
        flexShrink: 0,
      }} />

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.shortName}
        </h3>
        <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>
          {selections.body.material === 'full-grain-leather' ? 'Leather' : 'Wool'} · Size {selections.size}
        </p>

        {/* Add-ons List */}
        {addOns.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
            {addOns.map((a, i) => (
              <span key={i} style={{ color: '#aaa', fontSize: '0.75rem', textTransform: 'capitalize' }}>
                + {a.label} <span style={{ color: '#ff4d00' }}>+${a.price}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Controls: Qty, Price, Remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div className="cart-qty-controls" style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 4, padding: '4px 8px', gap: 12 }}>
          <button onClick={() => qty > 1 && onQtyChange(qty - 1)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: 0 }}>−</button>
          <span style={{ fontSize: '0.8rem', width: 14, textAlign: 'center' }}>{qty}</span>
          <button onClick={() => onQtyChange(qty + 1)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: 0 }}>+</button>
        </div>
        
        <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff', marginTop: 'auto', marginBottom: 12 }}>
          ${(total * qty).toFixed(0)}
        </span>

        <button className="cart-remove-btn" onClick={onRemove} style={{ background: 'none', border: 'none', color: '#777', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          REMOVE
        </button>
      </div>
    </div>
  );
}

