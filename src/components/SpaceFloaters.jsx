import React, { useState, useEffect, useRef } from 'react';

// ── SVG space debris pieces ───────────────────────────────────
const DEBRIS = [
  // Asteroid A — lumpy rock
  ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <polygon points="14,2 24,4 30,12 26,24 16,30 6,26 2,16 6,6"
        fill="#3a3530" stroke="#6b6058" strokeWidth="1" strokeLinejoin="round"/>
      <circle cx="9" cy="10" r="2.5" fill="#2a2520" opacity="0.7"/>
      <circle cx="20" cy="18" r="3.5" fill="#2a2520" opacity="0.5"/>
      <circle cx="16" cy="8"  r="1.5" fill="#2a2520" opacity="0.6"/>
    </svg>
  ),
  // Asteroid B — smaller jagged
  ({ size }) => (
    <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none">
      <polygon points="12,1 20,5 23,13 18,21 9,23 2,17 1,8 7,2"
        fill="#4a4540" stroke="#7a7068" strokeWidth="1" strokeLinejoin="round"/>
      <circle cx="8"  cy="9"  r="1.8" fill="#2e2a26" opacity="0.7"/>
      <circle cx="15" cy="14" r="2.2" fill="#2e2a26" opacity="0.5"/>
    </svg>
  ),
  // Satellite
  ({ size }) => (
    <svg width={size * 1.4} height={size} viewBox="0 0 48 32" fill="none">
      {/* Body */}
      <rect x="16" y="8" width="16" height="16" rx="2" fill="#2a3a4a" stroke="#4a6a8a" strokeWidth="1"/>
      {/* Left solar panel */}
      <rect x="2"  y="12" width="12" height="8" rx="1" fill="#0d1a2a" stroke="#1a4a7a" strokeWidth="0.8"/>
      <line x1="4"  y1="12" x2="4"  y2="20" stroke="#1a5a9a" strokeWidth="0.5" opacity="0.7"/>
      <line x1="8"  y1="12" x2="8"  y2="20" stroke="#1a5a9a" strokeWidth="0.5" opacity="0.7"/>
      <line x1="12" y1="12" x2="12" y2="20" stroke="#1a5a9a" strokeWidth="0.5" opacity="0.7"/>
      {/* Right solar panel */}
      <rect x="34" y="12" width="12" height="8" rx="1" fill="#0d1a2a" stroke="#1a4a7a" strokeWidth="0.8"/>
      <line x1="36" y1="12" x2="36" y2="20" stroke="#1a5a9a" strokeWidth="0.5" opacity="0.7"/>
      <line x1="40" y1="12" x2="40" y2="20" stroke="#1a5a9a" strokeWidth="0.5" opacity="0.7"/>
      <line x1="44" y1="12" x2="44" y2="20" stroke="#1a5a9a" strokeWidth="0.5" opacity="0.7"/>
      {/* Antenna */}
      <line x1="24" y1="8" x2="24" y2="2" stroke="#4a7aaa" strokeWidth="1"/>
      <circle cx="24" cy="2" r="2" fill="#4a7aaa"/>
      {/* Panel connectors */}
      <line x1="14" y1="16" x2="16" y2="16" stroke="#4a6a8a" strokeWidth="1"/>
      <line x1="32" y1="16" x2="34" y2="16" stroke="#4a6a8a" strokeWidth="1"/>
    </svg>
  ),
  // Hex bolt / nut
  ({ size }) => (
    <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 28 28" fill="none">
      <polygon points="14,2 22,6 22,18 14,22 6,18 6,6"
        fill="#4a4a50" stroke="#7a7a85" strokeWidth="1.2" strokeLinejoin="round"/>
      <circle cx="14" cy="12" r="4.5" fill="#2a2a30" stroke="#6a6a75" strokeWidth="1"/>
      <circle cx="14" cy="12" r="1.5" fill="#1a1a20"/>
    </svg>
  ),
  // Space wrench
  ({ size }) => (
    <svg width={size * 0.55} height={size} viewBox="0 0 18 32" fill="none">
      <rect x="7" y="8" width="4" height="18" rx="2" fill="#3a3a3a" stroke="#6a6a6a" strokeWidth="0.8"/>
      <circle cx="9" cy="7"  r="5" fill="none" stroke="#6a6a6a" strokeWidth="1.5"/>
      <circle cx="9" cy="27" r="4" fill="#3a3a3a" stroke="#6a6a6a" strokeWidth="1.2"/>
    </svg>
  ),
  // Circuit board fragment
  ({ size }) => (
    <svg width={size * 1.1} height={size * 0.75} viewBox="0 0 32 22" fill="none">
      <rect x="1" y="1" width="30" height="20" rx="2" fill="#0d1a0d" stroke="#1a3a1a" strokeWidth="1"/>
      {/* Traces */}
      <line x1="6"  y1="1"  x2="6"  y2="21" stroke="#1a5a1a" strokeWidth="0.6" opacity="0.6"/>
      <line x1="14" y1="1"  x2="14" y2="21" stroke="#1a5a1a" strokeWidth="0.6" opacity="0.6"/>
      <line x1="22" y1="1"  x2="22" y2="21" stroke="#1a5a1a" strokeWidth="0.6" opacity="0.6"/>
      <line x1="1"  y1="7"  x2="31" y2="7"  stroke="#1a5a1a" strokeWidth="0.6" opacity="0.6"/>
      <line x1="1"  y1="14" x2="31" y2="14" stroke="#1a5a1a" strokeWidth="0.6" opacity="0.6"/>
      {/* Components */}
      <circle cx="6"  cy="7"  r="2" fill="#2a7a2a" opacity="0.8"/>
      <circle cx="22" cy="14" r="2" fill="#2a7a2a" opacity="0.8"/>
      <circle cx="14" cy="7"  r="1.5" fill="#7aaa2a" opacity="0.7"/>
      <rect x="11" y="12" width="6" height="4" rx="0.5" fill="#1a3a1a" stroke="#2a6a2a" strokeWidth="0.7"/>
    </svg>
  ),
  // Fuel tank / rocket body
  ({ size }) => (
    <svg width={size * 0.6} height={size} viewBox="0 0 20 32" fill="none">
      <path d="M10,2 C14,2 17,5 17,9 L17,24 C17,27 14,30 10,30 C6,30 3,27 3,24 L3,9 C3,5 6,2 10,2 Z"
        fill="#2a3540" stroke="#4a6070" strokeWidth="1"/>
      <ellipse cx="10" cy="9"  rx="7" ry="3" fill="#1a2530" stroke="#3a5060" strokeWidth="0.8"/>
      <ellipse cx="10" cy="24" rx="7" ry="3" fill="#1a2530" stroke="#3a5060" strokeWidth="0.8"/>
      {/* Fins */}
      <path d="M3,22 L0,28 L3,26 Z" fill="#2a3540" stroke="#3a5060" strokeWidth="0.6"/>
      <path d="M17,22 L20,28 L17,26 Z" fill="#2a3540" stroke="#3a5060" strokeWidth="0.6"/>
      {/* Stripe */}
      <rect x="3" y="14" width="14" height="2" fill="#3a5060" opacity="0.6"/>
    </svg>
  ),
  // Metal plate fragment
  ({ size }) => (
    <svg width={size * 0.9} height={size * 0.7} viewBox="0 0 28 20" fill="none">
      <polygon points="2,4 10,1 26,3 28,14 20,19 4,18 1,10"
        fill="#3a3a40" stroke="#5a5a65" strokeWidth="1" strokeLinejoin="round"/>
      <line x1="6"  y1="5"  x2="22" y2="7"  stroke="#5a5a65" strokeWidth="0.5" opacity="0.5"/>
      <line x1="5"  y1="10" x2="23" y2="12" stroke="#5a5a65" strokeWidth="0.5" opacity="0.5"/>
      <circle cx="8"  cy="8"  r="1.5" fill="#5a5a65" opacity="0.6"/>
      <circle cx="20" cy="13" r="1.5" fill="#5a5a65" opacity="0.6"/>
      <circle cx="14" cy="5"  r="1"   fill="#5a5a65" opacity="0.5"/>
    </svg>
  ),
];

const rand    = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));

function spawnFloater(id) {
  const edge     = randInt(0, 3);
  const size     = rand(40, 70);
  const duration = rand(30, 60);
  const opacity  = rand(0.2, 0.5);
  const spinRate = rand(20, 80) * (Math.random() > 0.5 ? 1 : -1); // deg/s

  let startX, startY, endX, endY;
  if (edge === 0) {
    startX = rand(5, 95); startY = -10;
    endX = startX + rand(-25, 25); endY = 110;
  } else if (edge === 1) {
    startX = 110; startY = rand(5, 95);
    endX = -10; endY = startY + rand(-25, 25);
  } else if (edge === 2) {
    startX = rand(5, 95); startY = 110;
    endX = startX + rand(-25, 25); endY = -10;
  } else {
    startX = -10; startY = rand(5, 95);
    endX = 110; endY = startY + rand(-25, 25);
  }

  const debrisIndex = randInt(0, DEBRIS.length - 1);
  return { id, debrisIndex, startX, startY, endX, endY, size, duration, opacity, spinRate };
}

export default function SpaceFloaters() {
  const [floaters, setFloaters] = useState([]);
  const nextId = useRef(0);

  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setFloaters([spawnFloater(nextId.current++)]);
    }, rand(2000, 5000));

    const interval = setInterval(() => {
      setFloaters(prev => {
        const trimmed = prev.length >= 4 ? prev.slice(1) : prev;
        return [...trimmed, spawnFloater(nextId.current++)];
      });
    }, rand(9000, 20000));

    return () => { clearTimeout(initialTimer); clearInterval(interval); };
  }, []);

  const remove = (id) => setFloaters(prev => prev.filter(f => f.id !== id));

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
      {floaters.map(f => <Floater key={f.id} floater={f} onDone={() => remove(f.id)} />)}
    </div>
  );
}

function Floater({ floater, onDone }) {
  const { debrisIndex, startX, startY, endX, endY, size, duration, opacity, spinRate } = floater;
  const ref     = useRef(null);
  const spinRef = useRef(0);
  const rafRef  = useRef(null);
  const lastT   = useRef(null);

  const DebrisComponent = DEBRIS[debrisIndex];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fade in
    el.animate([{ opacity: 0 }, { opacity }], { duration: 2000, fill: 'forwards', easing: 'ease-out' });

    // Travel
    el.animate(
      [
        { left: `${startX}vw`, top: `${startY}vh` },
        { left: `${endX}vw`,   top: `${endY}vh`   },
      ],
      { duration: duration * 1000, fill: 'forwards', easing: 'linear' }
    );

    // Fade out near end
    setTimeout(() => {
      el.animate([{ opacity }, { opacity: 0 }], { duration: 2500, fill: 'forwards', easing: 'ease-in' });
    }, (duration - 2.5) * 1000);

    const cleanup = setTimeout(onDone, duration * 1000);

    // Continuous tumble via RAF on inner div
    const inner = el.querySelector('.debris-inner');
    const tick = (t) => {
      if (lastT.current !== null) {
        const dt = (t - lastT.current) / 1000;
        spinRef.current += spinRate * dt;
        if (inner) inner.style.transform = `rotate(${spinRef.current}deg)`;
      }
      lastT.current = t;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearTimeout(cleanup);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: `${startX}vw`,
        top: `${startY}vh`,
        opacity: 0,
        willChange: 'left, top, opacity',
        filter: 'drop-shadow(0 0 4px rgba(180,160,120,0.2))',
      }}
    >
      <div className="debris-inner">
        <DebrisComponent size={size} />
      </div>
    </div>
  );
}
