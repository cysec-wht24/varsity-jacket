import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import useCustomStore from '../../store/useCustomStore';

export default function RunwayPage() {
  const navigate = useNavigate();
  const { currentProduct, selections } = useCustomStore();
  const canvasRef = useRef(null);

  // Simple animated runway preview drawn on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let animId;

    const bodyColor = selections?.body?.color || '#111111';
    const sleeveColor = selections?.sleeveLeft?.color || '#0a0a0a';

    function draw() {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, W, H);

      // Runway floor gradient
      const floor = ctx.createLinearGradient(0, H * 0.6, 0, H);
      floor.addColorStop(0, '#1a1a1a');
      floor.addColorStop(1, '#0d0d0d');
      ctx.fillStyle = floor;
      ctx.fillRect(0, H * 0.6, W, H * 0.4);

      // Runway center line (perspective)
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(W / 2, H * 0.35);
      ctx.lineTo(W / 2, H);
      ctx.stroke();

      // Spotlight from above
      const grad = ctx.createRadialGradient(W / 2, 0, 10, W / 2, H * 0.4, W * 0.45);
      grad.addColorStop(0, 'rgba(255,240,200,0.08)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Animate figure walking (bob up/down)
      const bob = Math.sin(frame * 0.08) * 3;
      const cx = W / 2;
      const cy = H * 0.28 + bob;
      const scale = 90;

      // Body (jacket)
      ctx.fillStyle = bodyColor;
      ctx.fillRect(cx - scale * 0.22, cy, scale * 0.44, scale * 0.6);

      // Sleeves
      ctx.fillStyle = sleeveColor;
      // Left sleeve
      ctx.fillRect(cx - scale * 0.44, cy + scale * 0.04, scale * 0.22, scale * 0.42);
      // Right sleeve
      ctx.fillRect(cx + scale * 0.22, cy + scale * 0.04, scale * 0.22, scale * 0.42);

      // Head
      ctx.fillStyle = '#c8a05a';
      ctx.beginPath();
      ctx.arc(cx, cy - scale * 0.14, scale * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(cx - scale * 0.14, cy + scale * 0.6, scale * 0.12, scale * 0.48);
      ctx.fillRect(cx + scale * 0.02, cy + scale * 0.6, scale * 0.12, scale * 0.48);

      // Collar highlight
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(cx - scale * 0.08, cy, scale * 0.16, scale * 0.1);

      // "RUNWAY" watermark text
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.font = `bold ${W * 0.12}px "Inter", sans-serif`;
      ctx.textAlign = 'center';
      ctx.letterSpacing = '0.4em';
      ctx.fillText('RUNWAY', W / 2, H * 0.92);

      frame++;
      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, [selections]);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f0ede8' }}>
      <Header />

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.22em', color: '#666', textTransform: 'uppercase', marginBottom: 8 }}>
            Live Preview
          </p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
            RUNWAY MODE
          </h1>
          {currentProduct && (
            <p style={{ color: '#888', marginTop: 8, fontSize: '0.9rem' }}>
              {currentProduct.shortName} — {currentProduct.category}
            </p>
          )}
        </div>

        {/* Canvas preview */}
        <div style={{
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid #1e1e1e',
          background: '#0d0d0d',
          marginBottom: 32,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={420}
            style={{ display: 'block', maxWidth: '100%' }}
          />
        </div>

        {/* Color summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: 32,
        }}>
          {[
            { label: 'Body', color: selections?.body?.color, material: selections?.body?.material },
            { label: 'Left Sleeve', color: selections?.sleeveLeft?.color, material: selections?.sleeveLeft?.material },
            { label: 'Right Sleeve', color: selections?.sleeveRight?.color, material: selections?.sleeveRight?.material },
            { label: 'Collar', color: selections?.collar?.color || selections?.body?.color },
          ].map(({ label, color, material }) => (
            <div key={label} style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: 8,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: color || '#111',
                border: '2px solid #333',
                flexShrink: 0,
              }} />
              <div>
                <div style={{ fontSize: '0.65rem', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontSize: '0.78rem', color: '#ccc', marginTop: 2 }}>{color}</div>
                {material && (
                  <div style={{ fontSize: '0.7rem', color: '#555', marginTop: 1 }}>{material}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#aaa',
              padding: '12px 28px',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              fontWeight: 600,
            }}
          >
            ← BACK TO CUSTOMIZE
          </button>
          <button
            onClick={() => navigate('/cart')}
            style={{
              background: '#f0ede8',
              border: 'none',
              color: '#0a0a0a',
              padding: '12px 28px',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              fontWeight: 700,
            }}
          >
            ADD TO CART →
          </button>
        </div>
      </div>
    </div>
  );
}
