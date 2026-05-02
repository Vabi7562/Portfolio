import React, { useEffect, useRef } from 'react';

const rand = (a, b) => Math.random() * (b - a) + a;

// ── Global mouse tracker ──────────────────────────────────
let gMouseX = typeof window !== 'undefined' ? window.innerWidth / 2  : 0;
let gMouseY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', e => { gMouseX = e.clientX; gMouseY = e.clientY; }, { passive: true });
}

// ── Single shared rAF loop ────────────────────────────────
const registry = new Set();
let rafId = null;
let t0    = null;

function tick(now) {
  if (t0 === null) t0 = now;
  const t = (now - t0) * 0.001;
  for (const fn of registry) fn(t, gMouseX, gMouseY);
  rafId = requestAnimationFrame(tick);
}

function register(fn) {
  registry.add(fn);
  if (registry.size === 1) { t0 = null; rafId = requestAnimationFrame(tick); }
}

function unregister(fn) {
  registry.delete(fn);
  if (registry.size === 0 && rafId) { cancelAnimationFrame(rafId); rafId = null; }
}

// ── FloatUnit — one floating element ─────────────────────
export function FloatUnit({ children, amp = 8, style, className }) {
  const elRef    = useRef(null);
  const stateRef = useRef({
    phaseX: rand(0, Math.PI * 2),
    phaseY: rand(0, Math.PI * 2),
    speedX: rand(0.18, 0.38),
    speedY: rand(0.12, 0.26),
    repX: 0, repY: 0,
  });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const s = stateRef.current;

    const update = (t, mx, my) => {
      // Idle float
      const fx = Math.sin(t * s.speedX + s.phaseX) * amp;
      const fy = Math.sin(t * s.speedY + s.phaseY) * amp * 0.55;

      // Cursor repulsion
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  * 0.5;
      const cy   = rect.top  + rect.height * 0.5;
      const dx   = mx - cx;
      const dy   = my - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const R    = 160;

      let tRepX = 0, tRepY = 0;
      if (dist < R && dist > 1) {
        const force = Math.pow(1 - dist / R, 2) * 60;
        tRepX = -(dx / dist) * force;
        tRepY = -(dy / dist) * force;
      }

      // Spring damping back to float position
      s.repX += (tRepX - s.repX) * 0.11;
      s.repY += (tRepY - s.repY) * 0.11;

      el.style.transform = `translate(${(fx + s.repX).toFixed(1)}px,${(fy + s.repY).toFixed(1)}px)`;
    };

    register(update);
    return () => unregister(update);
  }, [amp]);

  return (
    <span
      ref={elRef}
      className={className}
      style={{ display: 'inline-block', willChange: 'transform', cursor: 'default', ...style }}
    >
      {children}
    </span>
  );
}

// ── FloatingWords — splits a string into word-level floaters ─
export function FloatingWords({ text, amp = 9, wordStyle }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <FloatUnit amp={amp + rand(-2, 2)}>
            <span style={wordStyle}>{w}</span>
          </FloatUnit>
          {i < words.length - 1 && <span style={{ display: 'inline-block', width: '0.28em' }} />}
        </React.Fragment>
      ))}
    </>
  );
}
