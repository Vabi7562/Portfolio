import { useTransform, useSpring, motion, useMotionValue } from 'motion/react';
import { useRef, useEffect, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { FloatUnit, FloatingWords } from '../FloatingText';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import MarqueeTicker from '../MarqueeTicker';
import { useIsMobile } from '../../hooks/useIsMobile';

// ── Floating moon for center column ──────────────────────────
function FloatingMoon() {
  const gltf = useGLTF('/moon.glb');
  const ref  = useRef();

  useEffect(() => {
    gltf.parser.getDependency('texture', 0).then((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      gltf.scene.traverse((child) => {
        if (!child.isMesh) return;
        child.material = new THREE.MeshStandardMaterial({
          map: tex, roughness: 0.88, metalness: 0.0,
          color: new THREE.Color(1, 1, 1),
        });
      });
    });
  }, [gltf]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.06;
    ref.current.position.y = Math.sin(Date.now() * 0.0007) * 0.12;
  });

  return <primitive ref={ref} object={gltf.scene} scale={0.007} position={[0, 0, 0]} />;
}

function MoonCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
      onCreated={({ gl, scene }) => {
        scene.background = null;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.4;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <ambientLight intensity={0.08} />
      <directionalLight position={[-5, 2, 3]}  intensity={2.4} color="#fff6e8" />
      <directionalLight position={[ 3, -2, -3]} intensity={0.1} color="#4a80c4" />
      <Suspense fallback={null}>
        <FloatingMoon />
      </Suspense>
    </Canvas>
  );
}

// ── Project card styles ───────────────────────────────────────
const CARD_CSS = `
  /* ── Keyframes ── */
  @keyframes card-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-7px); }
  }
  @keyframes prog-grow {
    from { width: 0; }
    to   { width: var(--pw, 0%); }
  }
  @keyframes border-shimmer {
    0%   { box-shadow: 0 0 0px rgba(244,201,106,0); }
    50%  { box-shadow: 0 0 18px rgba(244,201,106,0.06), inset 0 0 18px rgba(244,201,106,0.02); }
    100% { box-shadow: 0 0 0px rgba(244,201,106,0); }
  }
  @keyframes pdot-pulse  { 0%,100%{opacity:1;transform:scale(1)}  50%{opacity:0.35;transform:scale(0.8)} }
  @keyframes pdot-breath { 0%,100%{opacity:0.7;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
  @keyframes num-drift {
    0%,100% { transform: translateY(0px); opacity: var(--num-op, 0.03); }
    50%      { transform: translateY(-4px); opacity: calc(var(--num-op, 0.03) * 2); }
  }

  .pcard {
    position: relative;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.07);
    padding: 2.25rem 2rem;
    cursor: pointer;
    overflow: hidden;
    height: 100%;
    display: flex;
    flex-direction: column;
    animation: card-float var(--float-dur, 5s) var(--float-delay, 0s) ease-in-out infinite,
               border-shimmer var(--shimmer-dur, 6s) var(--shimmer-delay, 0s) ease-in-out infinite;
    transition: border-color 0.35s ease, box-shadow 0.35s ease;
  }
  .pcard:hover {
    animation-play-state: paused;
    transform: translateY(-8px);
    border-color: rgba(255,255,255,0.13);
    box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 40px rgba(244,201,106,0.06);
  }

  /* Sweep shine */
  .pcard-shine {
    position: absolute; top: 0; left: -100%; width: 45%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.025), transparent);
    transition: left 0.75s ease; pointer-events: none;
  }
  .pcard:hover .pcard-shine { left: 155%; }

  /* Ghost number — drifts slowly */
  .pcard-num {
    position: absolute;
    top: -0.15em; right: 1.25rem;
    font-family: Archivo, sans-serif;
    font-size: 7rem;
    font-weight: 700;
    color: rgba(255,255,255,0.03);
    line-height: 1;
    pointer-events: none;
    user-select: none;
    --num-op: 0.03;
    animation: num-drift var(--float-dur, 5s) var(--float-delay, 0s) ease-in-out infinite;
  }
  .pcard:hover .pcard-num { animation-play-state: paused; color: rgba(255,255,255,0.07); }

  /* Status dots */
  .pcard-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .pcard-dot-active { background: #F4C96A; box-shadow: 0 0 6px rgba(244,201,106,0.7); animation: pdot-pulse 2.2s ease-in-out infinite; }
  .pcard-dot-dev    { background: rgba(160,200,255,0.7); box-shadow: 0 0 4px rgba(160,200,255,0.4); animation: pdot-breath 3s ease-in-out infinite; }
  .pcard-dot-soon   { background: rgba(138,128,112,0.5); }

  /* Progress — grows in on mount */
  .pcard-track { height: 1px; background: rgba(255,255,255,0.06); overflow: hidden; flex-shrink: 0; }
  .pcard-fill {
    height: 100%; position: relative;
    background: linear-gradient(90deg, rgba(244,201,106,0.2), rgba(244,201,106,0.7));
    width: 0;
    animation: prog-grow 1.6s var(--prog-delay, 0.4s) cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  .pcard-fill::after {
    content: ''; position: absolute; right: 0; top: -1px;
    width: 12px; height: 3px;
    background: radial-gradient(ellipse, rgba(244,201,106,0.9), transparent);
  }

  /* Arrow */
  .pcard-arrow {
    font-size: 0.9rem;
    color: rgba(240,235,224,0.2);
    transition: color 0.3s ease, transform 0.3s ease;
    display: inline-block;
  }
  .pcard:hover .pcard-arrow { color: rgba(244,201,106,0.7); transform: translate(2px, -2px); }
`;

function CardStyle() { return <style>{CARD_CSS}</style>; }

// ── Animated SV logo for home page hero ──────────────────────
const LOGO_GLOW_CSS = `
  @keyframes sv-breathe {
    0%, 100% { opacity: 0.35; }
    50%       { opacity: 0.75; }
  }
  .sv-glow-group { animation: sv-breathe 3s ease-in-out infinite; }
`;

function SVLogoHero({ size = 96 }) {
  return (
    <>
      <style>{LOGO_GLOW_CSS}</style>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ width: size, height: size, position: 'relative', margin: '0 auto 28px' }}
      >
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="hero-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Gold glow backing — breathing */}
          <g className="sv-glow-group">
            <path filter="url(#hero-glow)"
              d="M168,80 L344,80 A88,88 0 0 1 432,168 L432,344 A88,88 0 0 1 344,432 L168,432 A88,88 0 0 1 80,344 L80,168 A88,88 0 0 1 168,80 Z"
              transform="rotate(45 256 256)"
              fill="none" stroke="rgba(244,201,106,0.55)" strokeWidth="26"
              strokeLinecap="round" strokeLinejoin="round"/>
            <path filter="url(#hero-glow)"
              d="M238,192 C238,166 146,166 146,210 C146,255 238,258 238,300 C238,342 146,342 146,320"
              fill="none" stroke="rgba(244,201,106,0.55)" strokeWidth="30" strokeLinecap="round"/>
            <path filter="url(#hero-glow)"
              d="M252,192 L314,334 L376,192"
              fill="none" stroke="rgba(244,201,106,0.55)" strokeWidth="30"
              strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          {/* Main white strokes */}
          <path d="M168,80 L344,80 A88,88 0 0 1 432,168 L432,344 A88,88 0 0 1 344,432 L168,432 A88,88 0 0 1 80,344 L80,168 A88,88 0 0 1 168,80 Z"
            transform="rotate(45 256 256)"
            fill="none" stroke="#F0EBE0" strokeWidth="26"
            strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M238,192 C238,166 146,166 146,210 C146,255 238,258 238,300 C238,342 146,342 146,320"
            fill="none" stroke="#F0EBE0" strokeWidth="30" strokeLinecap="round"/>
          <path d="M252,192 L314,334 L376,192"
            fill="none" stroke="#F0EBE0" strokeWidth="30"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </>
  );
}

const PROJECTS = [
  {
    title: 'Email App',
    desc: 'A better way to do email — built for async, not interruption.',
    status: 'In development',
    link: '/email',
    dotClass: 'pcard-dot-dev',
    progress: 38,
    index: '01',
  },
  {
    title: 'Photography',
    desc: 'Visual storytelling through the lens.',
    status: 'Active',
    link: '/photography',
    dotClass: 'pcard-dot-active',
    progress: 91,
    index: '02',
  },
  {
    title: 'Ecosystem',
    desc: 'More products and tools coming soon.',
    status: 'Coming soon',
    link: null,
    dotClass: 'pcard-dot-soon',
    progress: 12,
    index: '03',
  },
];

export default function HeroScrollAnimation() {
  const containerRef = useRef(null);
  const progress = useMotionValue(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // ── Mobile: static layout, skip scroll animation ──────────
  if (isMobile) {
    return (
      <main style={{ padding: '110px 20px 120px' }}>
        <CardStyle />

        {/* Hero text */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{
            fontFamily: 'Archivo, sans-serif', fontSize: '0.7rem',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--color-muted)', marginBottom: 20,
          }}>
            Sabharwal Ventures
          </p>
          <h1 style={{
            fontFamily: 'Archivo, sans-serif',
            fontSize: 'clamp(2.2rem, 10vw, 3.2rem)',
            fontWeight: 300, color: 'var(--color-foreground)',
            lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 20,
          }}>
            Building things<br />worth using.
          </h1>
          <p style={{
            fontSize: '0.9rem', color: 'var(--color-muted)',
            lineHeight: 1.75, maxWidth: 340, margin: '0 auto',
          }}>
            A small ecosystem of products in the making — starting with an email app and a photography practice.
          </p>
        </div>

        {/* Section header */}
        <p style={{
          fontFamily: 'Archivo, sans-serif', fontSize: '0.6rem',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(207,217,224,0.45)', marginBottom: 20,
        }}>
          What we're building
        </p>

        <MarqueeTicker style={{ marginBottom: '1.5rem' }} />

        {/* Cards stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {PROJECTS.map((p) => (
            <div
              key={p.title}
              className="pcard"
              onClick={() => { if (p.link) { window.scrollTo(0, 0); navigate(p.link); } }}
              style={{
                '--float-dur': '9999s',
                '--shimmer-dur': '9999s',
                '--pw': `${p.progress}%`,
                '--prog-delay': '0.4s',
                animation: 'none',
              }}
            >
              <div className="pcard-shine" />
              <span className="pcard-num">{p.index}</span>
              <p style={{
                fontFamily: 'Archivo, sans-serif', fontSize: '0.62rem',
                letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--color-muted)', marginBottom: '1.2rem', opacity: 0.5,
              }}>{p.index}</p>
              <p style={{
                fontFamily: 'Archivo, sans-serif',
                fontSize: 'clamp(1.1rem, 5vw, 1.35rem)',
                fontWeight: 300, color: 'var(--color-foreground)',
                letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: '0.55rem',
              }}>{p.title}</p>
              <p style={{
                fontSize: '0.8rem', color: 'var(--color-muted)',
                lineHeight: 1.7, marginBottom: '1.5rem', flex: 1,
              }}>{p.desc}</p>
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="pcard-track">
                  <div className="pcard-fill" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className={`pcard-dot ${p.dotClass}`} />
                  <span style={{
                    fontFamily: 'Archivo, sans-serif', fontSize: '0.7rem',
                    letterSpacing: '0.06em', color: 'var(--color-muted)', opacity: 0.7,
                  }}>{p.status}</span>
                </div>
                {p.link && <span className="pcard-arrow">↗</span>}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const scrolled = -el.getBoundingClientRect().top;
      const total = el.offsetHeight - window.innerHeight;
      progress.set(Math.min(Math.max(scrolled / total, 0), 1));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section 1: full opacity 0→35%, fades out 35→55%
  const s1Opacity = useTransform(progress, [0, 0.35, 0.55], [1, 1, 0]);
  const s1Scale   = useTransform(progress, [0, 0.55], [1, 0.9]);
  const s1Y       = useTransform(progress, [0, 0.55], ['0px', '-50px']);

  // Section 2 wrapper: fades in 55→72%
  const s2Opacity = useTransform(progress, [0.55, 0.72], [0, 1]);
  const s2Scale   = useTransform(progress, [0.55, 0.78], [0.96, 1]);
  const s2Y       = useTransform(progress, [0.55, 0.78], ['30px', '0px']);

  // Per-card spring reveals — staggered 6% apart
  const SPRING = { stiffness: 280, damping: 22, mass: 0.8 };

  const rawC1Scale = useTransform(progress, [0.60, 0.80], [0.82, 1]);
  const rawC1Y     = useTransform(progress, [0.60, 0.80], [52, 0]);
  const rawC1Op    = useTransform(progress, [0.60, 0.78], [0, 1]);
  const c1Scale    = useSpring(rawC1Scale, SPRING);
  const c1Y        = useSpring(rawC1Y,    SPRING);
  const c1Opacity  = useSpring(rawC1Op,   SPRING);

  const rawC2Scale = useTransform(progress, [0.66, 0.86], [0.82, 1]);
  const rawC2Y     = useTransform(progress, [0.66, 0.86], [52, 0]);
  const rawC2Op    = useTransform(progress, [0.66, 0.84], [0, 1]);
  const c2Scale    = useSpring(rawC2Scale, SPRING);
  const c2Y        = useSpring(rawC2Y,    SPRING);
  const c2Opacity  = useSpring(rawC2Op,   SPRING);

  const rawC3Scale = useTransform(progress, [0.72, 0.92], [0.82, 1]);
  const rawC3Y     = useTransform(progress, [0.72, 0.92], [52, 0]);
  const rawC3Op    = useTransform(progress, [0.72, 0.90], [0, 1]);
  const c3Scale    = useSpring(rawC3Scale, SPRING);
  const c3Y        = useSpring(rawC3Y,    SPRING);
  const c3Opacity  = useSpring(rawC3Op,   SPRING);

  const cardMotion = [
    { scale: c1Scale, y: c1Y, opacity: c1Opacity },
    { scale: c2Scale, y: c2Y, opacity: c2Opacity },
    { scale: c3Scale, y: c3Y, opacity: c3Opacity },
  ];

  return (
    <main ref={containerRef} style={{ position: 'relative', height: '300vh' }}>
      <CardStyle />
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* ── Section 1: Hero ──────────────────────── */}
        <motion.div
          style={{ opacity: s1Opacity, scale: s1Scale, y: s1Y, zIndex: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="text-center px-8 max-w-4xl">
            <FloatUnit amp={3} style={{ display: 'block', marginBottom: '28px' }}>
              <p style={{
                fontFamily: 'Archivo, sans-serif', fontSize: '0.7rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--color-muted)',
              }}>
                Sabharwal Ventures
              </p>
            </FloatUnit>
            <h1 style={{
              fontFamily: 'Archivo, sans-serif',
              fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
              fontWeight: 300, color: 'var(--color-foreground)',
              lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: '28px',
            }}>
              <span style={{ display: 'block' }}>
                <FloatingWords text="Building things" amp={10} wordStyle={{ fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 300, color: 'var(--color-foreground)', letterSpacing: '-0.02em' }} />
              </span>
              <span style={{ display: 'block' }}>
                <FloatingWords text="worth using." amp={10} wordStyle={{ fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 300, color: 'var(--color-foreground)', letterSpacing: '-0.02em' }} />
              </span>
            </h1>
            <FloatUnit amp={4} style={{ display: 'block', marginBottom: '48px' }}>
              <p style={{
                fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
                color: 'var(--color-muted)', lineHeight: 1.75,
                maxWidth: '480px', margin: '0 auto',
              }}>
                A small ecosystem of products in the making — starting with an email app and a photography practice.
              </p>
            </FloatUnit>
            <FloatUnit amp={2}>
              <p style={{ fontSize: '0.72rem', color: 'var(--color-muted)', opacity: 0.45, letterSpacing: '0.1em' }}>
                scroll to explore ↓
              </p>
            </FloatUnit>
          </div>
        </motion.div>

        {/* ── Section 2: Projects ───────────────────── */}
        <motion.div
          style={{ opacity: s2Opacity, scale: s2Scale, y: s2Y, zIndex: 2 }}
          className="absolute inset-0 flex items-center"
        >
          <div style={{
            position: 'relative', zIndex: 1,
            width: '100%', maxWidth: '1060px', margin: '0 auto', padding: '0 32px',
          }}>

            {/* Header row */}
            <motion.div style={{ opacity: s2Opacity }}>
              <p style={{
                fontFamily: 'Archivo, sans-serif', fontSize: '0.6rem',
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(207,217,224,0.45)', marginBottom: 32,
              }}>
                What we're building
              </p>
            </motion.div>

            {/* Marquee ticker */}
            <MarqueeTicker style={{ marginBottom: '2rem' }} />

            {/* Card grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}>
              {PROJECTS.map((p, i) => (
                <motion.div
                  key={p.title}
                  style={{
                    scale:   cardMotion[i].scale,
                    y:       cardMotion[i].y,
                    opacity: cardMotion[i].opacity,
                    height:  '100%',
                  }}
                >
                  <div
                    className="pcard"
                    onClick={() => { if (p.link) { window.scrollTo(0, 0); navigate(p.link); } }}
                    style={{
                      '--float-dur':    `${4.5 + i * 0.9}s`,
                      '--float-delay':  `${i * 1.1}s`,
                      '--shimmer-dur':  `${7 + i * 1.5}s`,
                      '--shimmer-delay':`${i * 2.2}s`,
                      '--pw':           `${p.progress}%`,
                      '--prog-delay':   `${0.5 + i * 0.25}s`,
                    }}
                  >
                    <div className="pcard-shine" />
                    <span className="pcard-num">{p.index}</span>

                    {/* Index */}
                    <p style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontSize: '0.62rem', letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)', marginBottom: '1.4rem',
                      opacity: 0.5,
                    }}>
                      {p.index}
                    </p>

                    {/* Title */}
                    <p style={{
                      fontFamily: 'Archivo, sans-serif',
                      fontSize: 'clamp(1.15rem, 1.8vw, 1.45rem)',
                      fontWeight: 300,
                      color: 'var(--color-foreground)',
                      letterSpacing: '-0.02em',
                      lineHeight: 1.2,
                      marginBottom: '0.65rem',
                    }}>
                      {p.title}
                    </p>

                    {/* Description */}
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--color-muted)',
                      lineHeight: 1.7,
                      marginBottom: '1.75rem',
                      flex: 1,
                    }}>
                      {p.desc}
                    </p>

                    {/* Progress */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div className="pcard-track">
                        <div className="pcard-fill" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className={`pcard-dot ${p.dotClass}`} />
                        <span style={{
                          fontFamily: 'Archivo, sans-serif',
                          fontSize: '0.7rem', letterSpacing: '0.06em',
                          color: 'var(--color-muted)', opacity: 0.7,
                        }}>
                          {p.status}
                        </span>
                      </div>
                      {p.link && <span className="pcard-arrow">↗</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
