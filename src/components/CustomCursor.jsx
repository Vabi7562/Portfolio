import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   CustomCursor
   • Replaces the native pointer with:
     – small white dot  (instant follow)
     – blue ring        (spring-lagged follow)
     – canvas particle trail (blue/gold sparks that drift & fade)
     – slow aurora backdrop glow
   • On hover over interactive elements → ring expands + turns gold
   • On click → ring pulse + particle burst
   • On text inputs → ring morphs into a thin vertical bar
   ──────────────────────────────────────────────────────────── */

const SPRING_DOT    = 0.80;   // dot follow speed
const SPRING_RING   = 0.13;   // ring follow speed
const SPRING_SCALE  = 0.09;   // ring scale lerp
const SPRING_AURORA = 0.032;  // aurora glow follow speed
const MAX_TRAIL     = 40;     // max live particles

function lerp(a, b, t) { return a + (b - a) * t; }

export default function CustomCursor() {
  const canvasRef  = useRef(null);
  const dotRef     = useRef(null);
  const ringRef    = useRef(null);
  const auroraRef  = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    // ── mutable state (no React re-renders) ──────────────────
    const s = {
      mx: -300, my: -300,         // raw mouse
      dx: -300, dy: -300,         // dot position
      rx: -300, ry: -300,         // ring position
      ax: window.innerWidth / 2,  // aurora position
      ay: window.innerHeight / 2,
      ringScale: 1,
      ringScaleTarget: 1,
      visible: false,
      hovering: false,            // over link/button
      isText: false,              // over text input
      clicking: false,
      particles: [],
    };

    // ── resize canvas ─────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // ── mouse tracking ────────────────────────────────────────
    const onMove = (e) => {
      s.mx = e.clientX;
      s.my = e.clientY;
      s.visible = true;

      // Spawn trail particle every move
      if (s.particles.length < MAX_TRAIL) {
        const isGold = s.hovering;
        s.particles.push({
          x:     e.clientX + (Math.random() - 0.5) * 4,
          y:     e.clientY + (Math.random() - 0.5) * 4,
          r:     Math.random() * 1.8 + 0.4,
          alpha: Math.random() * 0.55 + 0.25,
          vx:    (Math.random() - 0.5) * 0.9,
          vy:    (Math.random() - 0.5) * 0.9 - 0.2,
          decay: 0.90 + Math.random() * 0.05,
          color: isGold ? [244, 201, 106] : [160, 200, 255],
        });
      }
    };

    // ── hover detection ───────────────────────────────────────
    const INTERACTIVE = 'a, button, [role="button"], select, summary, label, [data-cursor]';
    const TEXT_ELS    = 'input, textarea, [contenteditable]';

    const onOver = (e) => {
      const t = e.target;
      s.hovering = !!t.closest(INTERACTIVE);
      s.isText   = !!t.closest(TEXT_ELS);
    };

    // ── click ─────────────────────────────────────────────────
    const onDown = () => {
      s.clicking = true;
      // Burst of particles
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2;
        const spd   = Math.random() * 2.5 + 1;
        s.particles.push({
          x:     s.mx, y: s.my,
          r:     Math.random() * 2 + 0.6,
          alpha: 0.75,
          vx:    Math.cos(angle) * spd,
          vy:    Math.sin(angle) * spd,
          decay: 0.88,
          color: s.hovering ? [244, 201, 106] : [200, 220, 255],
        });
      }
    };
    const onUp   = () => { s.clicking = false; };
    const onOut  = () => { s.visible = false; };
    const onIn   = () => { s.visible = true;  };

    window.addEventListener('mousemove',  onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown',  onDown);
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('mouseleave', onOut);
    window.addEventListener('mouseenter', onIn);

    // ── RAF loop ──────────────────────────────────────────────
    let raf;
    const tick = () => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + draw particles
      s.particles = s.particles.filter(p => p.alpha > 0.015);
      for (const p of s.particles) {
        p.x     += p.vx;
        p.y     += p.vy;
        p.vy    += 0.04;            // subtle gravity
        p.alpha *= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]},${p.color[1]},${p.color[2]},${p.alpha.toFixed(3)})`;
        ctx.fill();
      }

      // Spring physics
      s.dx = lerp(s.dx, s.mx, SPRING_DOT);
      s.dy = lerp(s.dy, s.my, SPRING_DOT);
      s.rx = lerp(s.rx, s.mx, SPRING_RING);
      s.ry = lerp(s.ry, s.my, SPRING_RING);
      s.ax = lerp(s.ax, s.mx, SPRING_AURORA);
      s.ay = lerp(s.ay, s.my, SPRING_AURORA);

      // Ring scale target
      let scaleTarget = 1;
      if (s.isText)    scaleTarget = 0.3;
      else if (s.hovering) scaleTarget = 2.1;
      else if (s.clicking) scaleTarget = 0.65;
      s.ringScale = lerp(s.ringScale, scaleTarget, SPRING_SCALE);

      // Dot
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate(${s.dx.toFixed(1)}px,${s.dy.toFixed(1)}px) scale(${s.clicking ? 0.35 : 1})`;
        dot.style.opacity   = s.visible ? '1' : '0';
        // Text cursor → thin bar
        dot.style.width     = s.isText ? '2px'  : '6px';
        dot.style.height    = s.isText ? '14px' : '6px';
        dot.style.borderRadius = s.isText ? '1px' : '50%';
        dot.style.background   = s.isText
          ? 'rgba(160,200,255,0.9)'
          : 'rgba(255,255,255,0.95)';
      }

      // Ring
      const ring = ringRef.current;
      if (ring) {
        const bc = s.hovering
          ? 'rgba(244,201,106,0.80)'
          : s.isText
          ? 'rgba(160,200,255,0.30)'
          : 'rgba(160,200,255,0.55)';
        const bg = s.hovering
          ? 'rgba(244,201,106,0.06)'
          : 'transparent';
        ring.style.transform   = `translate(${s.rx.toFixed(1)}px,${s.ry.toFixed(1)}px) scale(${s.ringScale.toFixed(3)})`;
        ring.style.borderColor = bc;
        ring.style.background  = bg;
        ring.style.opacity     = s.visible ? '1' : '0';
        // Glow on hover
        ring.style.boxShadow   = s.hovering
          ? '0 0 14px 3px rgba(244,201,106,0.25), 0 0 30px 8px rgba(244,201,106,0.08)'
          : '0 0 8px 1px rgba(160,200,255,0.15)';
      }

      // Aurora glow
      const aurora = auroraRef.current;
      if (aurora) {
        aurora.style.background = [
          `radial-gradient(ellipse 420px 320px at ${s.ax.toFixed(0)}px ${s.ay.toFixed(0)}px,`,
          `rgba(120,170,255,0.045) 0%, rgba(100,140,255,0.018) 45%, transparent 70%)`,
        ].join(' ');
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize',    resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('mouseleave',onOut);
      window.removeEventListener('mouseenter',onIn);
    };
  }, []);

  return (
    <>
      {/* ── Aurora backdrop glow ─────────────────────────────── */}
      <div
        ref={auroraRef}
        style={{
          position: 'fixed', inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Particle trail canvas ─────────────────────────────── */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', inset: 0,
          zIndex: 9996,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Ring ─────────────────────────────────────────────── */}
      <div
        ref={ringRef}
        style={{
          position:     'fixed',
          top:          -18,
          left:         -18,
          width:        36,
          height:       36,
          borderRadius: '50%',
          border:       '1.5px solid rgba(160,200,255,0.55)',
          zIndex:       9997,
          pointerEvents:'none',
          willChange:   'transform, border-color, box-shadow, background',
          transition:   'border-color 200ms ease, background 200ms ease, box-shadow 200ms ease, opacity 200ms ease',
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Dot ──────────────────────────────────────────────── */}
      <div
        ref={dotRef}
        style={{
          position:     'fixed',
          top:          -3,
          left:         -3,
          width:        6,
          height:       6,
          borderRadius: '50%',
          background:   'rgba(255,255,255,0.95)',
          zIndex:       9998,
          pointerEvents:'none',
          willChange:   'transform, opacity, width, height',
          transition:   'opacity 200ms ease, width 100ms ease, height 100ms ease, border-radius 100ms ease, background 100ms ease',
          boxShadow:    '0 0 6px 2px rgba(200,220,255,0.55), 0 0 14px 4px rgba(160,200,255,0.2)',
        }}
      />
    </>
  );
}
