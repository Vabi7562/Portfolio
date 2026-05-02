import { useEffect, useRef } from 'react';

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const lerp  = (a, b, t) => a + (b - a) * t;

// Colour stops — [scrollProgress, r, g, b]
// Transition is LINEAR (no smoothstep) so it feels scroll-driven, not fade-like
const STOPS = [
  [0.00,  0,   0,   0 ],   // pitch black
  [0.68,  0,   0,   0 ],   // still pitch black — through hero scroll
  [0.75,  7,  16,  45 ],   // navy — rapid 7% window (bottom anchor)
  [0.85,  8,  20,  55 ],   // solid navy
  [0.92, 10,  28,  70 ],   // deeper navy
  [0.96,  8,  52,  88 ],   // sea blue
  [1.00,  4,  40,  72 ],   // deep sea
];

function sampleColor(p) {
  let i = 0;
  while (i < STOPS.length - 2 && STOPS[i + 1][0] <= p) i++;
  const [a0, ar, ag, ab] = STOPS[i];
  const [b0, br, bg, bb] = STOPS[i + 1];
  const t = clamp((p - a0) / (b0 - a0), 0, 1); // linear — no smoothstep
  return [
    Math.round(lerp(ar, br, t)),
    Math.round(lerp(ag, bg, t)),
    Math.round(lerp(ab, bb, t)),
  ];
}

export default function AtmosphereTransition() {
  const bgRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p   = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      if (!bgRef.current) return;

      const [r, g, b] = sampleColor(p);
      // opacity: 0 until 0.68, then linear 0→1 over the 0.68→0.75 window
      const opacity = clamp((p - 0.68) / 0.07, 0, 1);

      bgRef.current.style.opacity    = String(opacity);
      bgRef.current.style.background = `rgb(${r},${g},${b})`;
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      ref={bgRef}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 1, pointerEvents: 'none',
        opacity: 0,
      }}
    />
  );
}
