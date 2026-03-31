import { Link, useLocation } from 'react-router-dom';
import useCustomStore from '../../store/useCustomStore';
import './index.css';

export default function Header({ variant = 'default' }) {
  const cartItems = useCustomStore(s => s.cartItems);
  const totalQty  = cartItems.reduce((s, i) => s + i.qty, 0);
  const location  = useLocation();

  const navLinks = [
    { label: 'Collection', to: '/collection' },
    { label: 'Helpdesk',   to: '/helpdesk'   },
  ];

  return (
    <header className={`site-header ${variant === 'dark' ? 'header-dark' : ''}`}>
      <Link to="/" className="brand-logo">SWIFTSTYLE.</Link>

      <nav className="site-nav" aria-label="Main navigation">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Link to="/cart" className="cart-btn" aria-label={`Cart, ${totalQty} items`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        {totalQty > 0 && <span className="cart-badge">{totalQty}</span>}
      </Link>
    </header>
  );
}
