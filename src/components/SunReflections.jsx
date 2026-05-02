import { useEffect, useRef } from 'react';

// Lens-flare / sun-reflection orbs rendered on a canvas
// Each orb is a soft radial gradient that drifts slowly across the viewport

const ORBS = [
  { x: 0.72, y: 0.18, r: 180, color: 'rgba(255,210,100,', baseA: 0.07, driftX: 0.012, driftY: 0.006, speed: 0.00018 },
  { x: 0.55, y: 0.55, r: 90,  color: 'rgba(255,240,180,', baseA: 0.05, driftX: -0.008, driftY: 0.010, speed: 0.00024 },
  { x: 0.85, y: 0.40, r: 140, color: 'rgba(255,200,80,',  baseA: 0.06, driftX: -0.015, driftY: -0.004, speed: 0.00015 },
  { x: 0.30, y: 0.25, r: 60,  color: 'rgba(255,230,150,', baseA: 0.04, driftX: 0.006, driftY: -0.012, speed: 0.00030 },
  { x: 0.60, y: 0.80, r: 110, color: 'rgba(255,180,60,',  baseA: 0.045, driftX: 0.010, driftY: -0.007, speed: 0.00020 },
  // Small sharp specular dots
  { x: 0.45, y: 0.30, r: 22,  color: 'rgba(255,255,220,', baseA: 0.18, driftX: -0.009, driftY: 0.013, speed: 0.00028 },
  { x: 0.78, y: 0.65, r: 16,  color: 'rgba(255,255,200,', baseA: 0.14, driftX: 0.007, driftY: -0.010, speed: 0.00022 },
];

export default function SunReflections() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Mutable state for each orb (normalised 0-1 coords + phase)
    const state = ORBS.map(o => ({
      ...o,
      cx: o.x,
      cy: o.y,
      phase: Math.random() * Math.PI * 2,
    }));

    let raf;
    let t0 = null;

    const draw = (now) => {
      if (t0 === null) t0 = now;
      const t = (now - t0) * 0.001;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of state) {
        // Gentle sinusoidal drift
        const ox = Math.sin(t * s.speed * 6283 + s.phase) * s.driftX;
        const oy = Math.cos(t * s.speed * 6283 + s.phase * 1.3) * s.driftY;
        const nx = s.x + ox;
        const ny = s.y + oy;

        const px = nx * canvas.width;
        const py = ny * canvas.height;

        // Pulse opacity ±30% of base
        const alpha = s.baseA * (0.7 + 0.3 * Math.sin(t * s.speed * 3000 + s.phase * 2));

        const grad = ctx.createRadialGradient(px, py, 0, px, py, s.r);
        grad.addColorStop(0,   s.color + alpha + ')');
        grad.addColorStop(0.4, s.color + alpha * 0.4 + ')');
        grad.addColorStop(1,   s.color + '0)');

        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  );
}
