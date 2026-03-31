import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Header from '../../components/header';
import { PRODUCTS } from '../../constants/products';
import './index.css';

function HeroJacket3D() {
  return (
    <mesh rotation={[0.1, 0, 0]}>
      {/* Body */}
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 2.0, 0.55]} />
          <meshStandardMaterial color="#111111" roughness={0.7} metalness={0.0} />
        </mesh>
        {/* Left Sleeve */}
        <mesh position={[-1.15, 0.1, 0]} rotation={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.3, 0.28, 1.65, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.05} />
        </mesh>
        {/* Right Sleeve */}
        <mesh position={[1.15, 0.1, 0]} rotation={[0, 0, -0.12]}>
          <cylinderGeometry args={[0.3, 0.28, 1.65, 16]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.4} metalness={0.05} />
        </mesh>
        {/* Collar */}
        <mesh position={[0, 1.08, 0]}>
          <torusGeometry args={[0.35, 0.12, 12, 40, Math.PI * 1.4]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        {/* Chest Stripe */}
        <mesh position={[0, 0.2, 0.28]}>
          <boxGeometry args={[1.55, 0.06, 0.01]} />
          <meshStandardMaterial color="#FF4D00" roughness={0.6} />
        </mesh>
        {/* Pocket Left */}
        <mesh position={[-0.5, -0.35, 0.28]}>
          <boxGeometry args={[0.4, 0.3, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        {/* Pocket Right */}
        <mesh position={[0.5, -0.35, 0.28]}>
          <boxGeometry args={[0.4, 0.3, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
        </mesh>
        {/* Ribbed Hem */}
        <mesh position={[0, -1.1, 0]}>
          <boxGeometry args={[1.65, 0.2, 0.58]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
      </group>
    </mesh>
  );
}

export default function HomePage() {
  const featured = PRODUCTS[0];

  return (
    <div className="home-page">
      <Header />

      {/* ── HERO ─────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-eyebrow">Three clicks. One Jacket.</p>
          <h1 className="hero-headline">YOUR<br/>SIGNATURE<br/>STYLE.</h1>
          <Link to="/collection" className="btn btn-primary hero-cta">
            Start Designing <span>→</span>
          </Link>
        </div>

        <div className="hero-3d-wrapper">
          <Canvas camera={{ position: [0, 0, 4.5], fov: 40 }} style={{ background: 'transparent' }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[4, 6, 4]} intensity={1.8} castShadow />
            <directionalLight position={[-3, -2, -3]} intensity={0.4} color="#4488ff" />
            <HeroJacket3D />
            <OrbitControls autoRotate autoRotateSpeed={1.2} enableZoom={false} enablePan={false} />
            <Environment preset="city" />
          </Canvas>
          <div className="hero-3d-label">
            <span className="label-big">100% CUSTOM</span>
            <span className="label-sub">Every detail, your way</span>
          </div>
        </div>
      </section>

      {/* ── EMOTIONAL STATEMENT ──────────────────────── */}
      <section className="statement-section">
        <div className="statement-left">
          <p className="statement-tag">Real-time 3D · Instant pricing · Runway preview · Direct to factory</p>
          <p className="statement-year">Since 2024 – 2026</p>
        </div>
        <div className="statement-right">
          <h2>DESIGN YOURS</h2>
          <h2 className="accent-line">OWN IT PROUDLY</h2>
        </div>
      </section>

      {/* ── PROCESS STRIP ────────────────────────────── */}
      <section className="process-strip">
        {[
          { num: '01', title: 'Browse', desc: 'Explore our jacket & hoodie collections' },
          { num: '02', title: 'Customize', desc: 'Design every detail in 3D real-time' },
          { num: '03', title: 'Preview', desc: 'Watch your design walk the runway' },
          { num: '04', title: 'Own It', desc: 'Direct to factory, made just for you' },
        ].map(step => (
          <div key={step.num} className="process-step">
            <span className="process-num">{step.num}</span>
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </section>

      {/* ── NAV BAND ─────────────────────────────────── */}
      <nav className="nav-band" aria-label="Category navigation">
        {['Jackets', 'Hoodies', 'Materials', 'Endurance Collection', 'Search designs'].map(item => (
          <Link key={item} to="/collection" className="nav-band-link">{item}</Link>
        ))}
      </nav>

      {/* ── FEATURED PRODUCT CARD ────────────────────── */}
      <section className="featured-section">
        <div className="featured-specs">
          <p className="text-secondary uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}>Deep wool melton · Full-grain leather · Precision stitching</p>
        </div>
        <div className="featured-card">
          <div className="featured-img-wrap">
            <img src={featured.thumbnail} alt={featured.name} className="featured-img" />
          </div>
          <div className="featured-info">
            <span className="badge">VARSITY LEGACY EDITION</span>
            <h2 className="featured-title">{featured.shortName}</h2>
            <p className="featured-desc">Fully customizable</p>
            <p className="price-main">From ${featured.basePrice}</p>
            <Link to={`/product/${featured.id}`} className="btn btn-primary">
              DESIGN NOW →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer className="home-footer">
        <span className="brand-logo" style={{fontFamily:'Oswald',fontSize:'1.2rem',fontWeight:700,letterSpacing:'0.06em'}}>SWIFTSTYLE.</span>
        <p style={{color:'var(--text-secondary)',fontSize:'0.8rem'}}>© 2026 SwiftStyle. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
