import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Photography page — vertical scroll, polaroid galleries,
   parallax quotes, lightbox.
   ──────────────────────────────────────────────────────────── */

// ── Photo data, grouped by category ──────────────────────────
const GALLERY = [
  {
    id:    '01',
    label: 'Landscapes',
    photos: [
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85', title: 'Highlands',  roll: 'S.01', date: "01'24", rot: -2.5 },
      { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=85', title: 'Alpine',     roll: 'S.03', date: "08'24", rot:  1.8 },
      { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=85', title: 'Peaks',      roll: 'S.07', date: "09'23", rot: -1.2 },
      { src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900&q=85', title: 'Waves',      roll: 'S.17', date: "12'23", rot:  2.2 },
    ],
  },
  {
    id:    '02',
    label: 'Urban',
    photos: [
      { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900&q=85', title: 'Golden Hr',  roll: 'S.02', date: "11'23", rot:  1.5 },
      { src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&q=85', title: 'Cityscapes', roll: 'S.04', date: "02'24", rot: -2.0 },
      { src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=900&q=85', title: 'Cosmos',     roll: 'S.05', date: "01'24", rot:  0.8 },
    ],
  },
  {
    id:    '03',
    label: 'Portraits & Fauna',
    photos: [
      { src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&q=85', title: 'Dusk',       roll: 'S.09', date: "06'24", rot: -1.8 },
      { src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=900&q=85', title: 'Fauna',      roll: 'S.10', date: "03'24", rot:  2.5 },
      { src: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=900&q=85', title: 'Forest',     roll: 'S.06', date: "06'24", rot: -0.5 },
    ],
  },
];

const QUOTES = [
  {
    h2: 'Every frame, a world.',
    p:  'A collection of moments frozen in light — from alpine dawns to the electric pulse of city nights.',
  },
  {
    h2: 'Concrete constellations.',
    p:  'Urban geometries and golden hours — where architecture meets atmosphere.',
  },
  {
    h2: 'Light studies.',
    p:  'Portraits and fauna — capturing character in the space between seconds.',
  },
];

// ── Polaroid card with IntersectionObserver reveal ────────────
function PolaroidCard({ photo, delay = 0, onOpen }) {
  const ref           = useRef(null);
  const [vis, setVis] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setVis(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  const rot = hot ? 0 : photo.rot;
  const ty  = vis ? (hot ? -10 : 0) : 68;
  const sc  = vis ? (hot ? 1.04 : 1) : 0.90;
  const op  = vis ? 1 : 0;

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onClick={() => onOpen(photo)}
      style={{
        position:     'relative',
        borderRadius: 14,
        overflow:     'hidden',
        background:   hot ? 'rgba(255,255,255,0.025)' : 'rgba(255,255,255,0.015)',
        border:       `1px solid ${hot ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)'}`,
        boxShadow:    hot
          ? '0 14px 52px rgba(0,0,0,0.65), 0 0 70px rgba(244,201,106,0.07)'
          : '0 4px 28px rgba(0,0,0,0.45)',
        transform:    `rotate(${rot}deg) translateY(${ty}px) scale(${sc})`,
        opacity:      op,
        transition:   vis
          ? `transform 0.75s cubic-bezier(0.22,1,0.36,1),
             opacity 0.75s cubic-bezier(0.22,1,0.36,1),
             border-color 0.25s, box-shadow 0.25s, background 0.25s`
          : 'none',
        cursor:       'pointer',
        zIndex:       hot ? 5 : 1,
      }}
    >
      {/* Gold date stamp */}
      <div style={{
        position:   'absolute', top: 12, right: 12, zIndex: 3,
        fontFamily: "'SF Mono','Fira Code',monospace",
        fontSize:   8, letterSpacing: '0.06em',
        color:      'rgba(244,201,106,0.9)',
        background: 'rgba(244,201,106,0.10)',
        padding:    '2px 7px', borderRadius: 3,
        backdropFilter: 'blur(4px)',
      }}>{photo.date}</div>

      {/* Image */}
      <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
        <img
          src={photo.src} alt={photo.title}
          loading="lazy"
          draggable={false}
          style={{
            width:      '100%', height: '100%',
            objectFit:  'cover', display: 'block',
            transform:  hot ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.65s cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </div>

      {/* Metadata strip */}
      <div style={{
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
        padding:        '14px 16px',
      }}>
        <span style={{
          fontFamily: "'SF Mono','Fira Code',monospace",
          fontSize: 9, color: '#8A8070', letterSpacing: '0.06em',
        }}>{photo.roll}</span>
        <span style={{
          fontFamily: 'Archivo, sans-serif',
          fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.15em',
          color: '#C8BFA8',
        }}>{photo.title}</span>
      </div>
    </div>
  );
}

// ── Gallery section ───────────────────────────────────────────
function GallerySection({ section, onOpen }) {
  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '0 32px 100px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Section label */}
      <p style={{
        fontFamily:     'Archivo, sans-serif',
        fontSize:       '0.65rem',
        letterSpacing:  '0.2em',
        textTransform:  'uppercase',
        color:          'rgba(160,200,255,0.55)',
        marginBottom:   48,
        paddingLeft:    4,
      }}>
        {section.id} — {section.label}
      </p>

      {/* Grid */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap:                 32,
      }}>
        {section.photos.map((photo, i) => (
          <PolaroidCard key={photo.roll} photo={photo} delay={i * 110} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}

// ── Parallax quote banner ─────────────────────────────────────
function ParallaxQuote({ h2, p }) {
  const ref         = useRef(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setLit(true); },
      { threshold: 0.38 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '110px 32px' }}>
      <h2 style={{
        fontFamily:     'Archivo, sans-serif',
        fontSize:       'clamp(2rem, 5vw, 4.5rem)',
        fontWeight:     300,
        letterSpacing:  '-0.03em',
        color:          '#F0EBE0',
        margin:         0,
        opacity:        lit ? 1 : 0.07,
        transition:     'opacity 0.7s ease',
      }}>{h2}</h2>
      <p style={{
        color:       '#8A8070',
        fontSize:    '0.82rem',
        letterSpacing: '0.03em',
        lineHeight:  1.8,
        maxWidth:    480, margin: '24px auto 0',
        opacity:     lit ? 1 : 0,
        transform:   lit ? 'translateY(0)' : 'translateY(22px)',
        transition:  'opacity 0.8s 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.8s 0.3s cubic-bezier(0.22,1,0.36,1)',
      }}>{p}</p>
    </section>
  );
}

// ── Float keyframe injected once ─────────────────────────────
const FLOAT_CSS = `
@keyframes ph-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(9px); }
}
@keyframes ph-film-grain {
  0% { background-position: 0 0; }
  100% { background-position: 300px 300px; }
}
`;

// ── Main page ─────────────────────────────────────────────────
export default function Photography() {
  const [lightbox, setLightbox] = useState(null); // { src, title, roll }

  // ESC to close lightbox
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <style>{FLOAT_CSS}</style>

      {/* ── Film grain overlay ──────────────────────────────── */}
      <div style={{
        position:      'fixed', inset: 0, zIndex: 4,
        pointerEvents: 'none',
        opacity:       0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: '180px',
        animation:     'ph-film-grain 8s steps(1) infinite',
      }} />

      {/* ── Hero ────────────────────────────────────────────── */}
      <section style={{
        position:       'relative', zIndex: 1,
        height:         '100vh',
        display:        'flex', flexDirection: 'column',
        alignItems:     'center', justifyContent: 'center',
        textAlign:      'center',
        overflow:       'hidden',
      }}>
        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily:    'Archivo, sans-serif',
            fontSize:      '0.65rem', letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:         'rgba(160,200,255,0.55)',
            marginBottom:  20,
          }}
        >
          05 — Photography
        </motion.p>

        {/* Main heading with cream→gold gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily:    'Archivo, sans-serif',
            fontSize:      'clamp(3rem, 8vw, 7rem)',
            fontWeight:    300,
            letterSpacing: '-0.04em',
            lineHeight:    1.05,
            margin:        0,
            paddingBottom: '0.08em',
          }}
        >
          <span style={{
            display:               'block',
            background:            'linear-gradient(135deg, #F0EBE0 40%, #F4C96A 100%)',
            WebkitBackgroundClip:  'text',
            WebkitTextFillColor:   'transparent',
            backgroundClip:        'text',
          }}>Through</span>
          <span style={{
            display:               'block',
            background:            'linear-gradient(135deg, #F0EBE0 40%, #F4C96A 100%)',
            WebkitBackgroundClip:  'text',
            WebkitTextFillColor:   'transparent',
            backgroundClip:        'text',
          }}>the lens.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ color: '#8A8070', fontSize: '0.82rem', letterSpacing: '0.04em', marginTop: 28 }}
        >
          Landscapes · Cityscapes · Portraits · The cosmos
        </motion.p>

        {/* Bobbing scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            position: 'absolute', bottom: 40,
            color: '#8A8070', fontSize: '1.4rem',
            animation: 'ph-float 2.5s ease-in-out infinite',
          }}
        >↓</motion.div>

        {/* Very faint watermark behind the heading */}
        <div style={{
          position:      'absolute', inset: 0,
          display:       'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', zIndex: -1,
        }}>
          <span style={{
            fontFamily:    'Archivo, sans-serif',
            fontSize:      'clamp(6rem, 22vw, 18rem)',
            fontWeight:    800, letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color:         'rgba(240,235,224,0.025)',
            userSelect:    'none', lineHeight: 1,
          }}>LENS</span>
        </div>
      </section>

      {/* ── Content: quote → gallery, interleaved ───────────── */}
      {GALLERY.map((section, i) => (
        <div key={section.id}>
          <ParallaxQuote h2={QUOTES[i].h2} p={QUOTES[i].p} />
          <GallerySection section={section} onOpen={setLightbox} />
        </div>
      ))}

      {/* Bottom spacer for nav */}
      <div style={{ height: 100 }} />

      {/* ── Lightbox ────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
            style={{
              position:       'fixed', inset: 0, zIndex: 200,
              background:     'rgba(5,5,5,0.92)',
              backdropFilter: 'blur(22px)',
              display:        'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <motion.img
              src={lightbox.src} alt={lightbox.title}
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                maxWidth:     '85vw', maxHeight: '85vh',
                borderRadius: 6,
                boxShadow:    '0 24px 90px rgba(0,0,0,0.75)',
                display:      'block',
              }}
              draggable={false}
              onClick={e => e.stopPropagation()}
            />

            {/* Caption */}
            <div style={{
              position:      'absolute', bottom: 40,
              left:          '50%', transform: 'translateX(-50%)',
              fontFamily:    'Archivo, sans-serif',
              fontSize:      '0.65rem', letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         '#8A8070',
              whiteSpace:    'nowrap',
            }}>
              {lightbox.title} — {lightbox.roll}
            </div>

            {/* Close hint */}
            <div style={{
              position:      'absolute', top: 28, right: 32,
              fontFamily:    "'SF Mono','Fira Code',monospace",
              fontSize:      11, letterSpacing: '0.12em',
              color:         'rgba(255,255,255,0.2)',
            }}>
              ESC / click to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
