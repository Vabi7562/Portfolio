import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';

// ── Scroll-reveal: fade + y + blur ────────────────────────────
const Reveal = ({ children, delay = 0, y = 28 }) => (
  <motion.div
    initial={{ opacity: 0, y, filter: 'blur(6px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

// ── Card reveal: scale + y + blur ─────────────────────────────
const CardReveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 44, scale: 0.96, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    style={{ height: '100%' }}
  >
    {children}
  </motion.div>
);

// ── Label: slide from left ────────────────────────────────────
const LabelReveal = ({ children, delay = 0, style }) => (
  <motion.p
    initial={{ opacity: 0, x: -14 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    style={style}
  >
    {children}
  </motion.p>
);

// ── Animated title: word-by-word stagger on mount ─────────────
const titleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const titleWord = {
  hidden: { opacity: 0, y: 22, filter: 'blur(5px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)',
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedTitle({ lines, style }) {
  return (
    <motion.h1
      variants={titleContainer}
      initial="hidden"
      animate="show"
      style={{ ...style, margin: 0 }}
    >
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {line.split(' ').map((word, wi) => (
            <motion.span
              key={wi}
              variants={titleWord}
              style={{ display: 'inline-block', marginRight: '0.28em' }}
            >
              {word}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  );
}

// ── Spotlight card ─────────────────────────────────────────────
function SpotlightCard({ children, style, gold = false }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hot, setHot] = useState(false);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const glowColor = gold ? 'rgba(244,201,106,0.10)' : 'rgba(160,200,255,0.07)';
  const borderHot = gold ? 'rgba(244,201,106,0.25)' : 'rgba(160,200,255,0.18)';
  const shadowHot = gold ? '0 0 40px rgba(244,201,106,0.07)' : '0 0 40px rgba(160,200,255,0.05)';

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{
        ...style,
        position: 'relative', borderRadius: 14, overflow: 'hidden',
        border: `1px solid ${hot ? borderHot : 'rgba(255,255,255,0.07)'}`,
        background: hot
          ? `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${glowColor} 0%, rgba(255,255,255,0.02) 55%, transparent 100%)`
          : 'rgba(255,255,255,0.02)',
        transition: 'border-color 200ms, box-shadow 200ms, transform 220ms',
        boxShadow: hot ? shadowHot : 'none',
        transform: hot ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {children}
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────
const SERVICES = [
  {
    index: '01',
    icon: '◈',
    title: 'AIFIN Framework',
    tagline: 'Make AI spending measurable.',
    description:
      "Most companies adopt AI without knowing if it's working. AIFIN gives you a structured financial intelligence layer — cost tracking, ROI measurement, and risk scoring built specifically for AI investments.",
    includes: [
      'AI cost tracking dashboard',
      'ROI measurement framework',
      'Risk scoring & exposure report',
      'Executive-ready summary views',
    ],
    price: 'From $0 — $1,000',
    unit: '/ project',
    gold: true,
  },
  {
    index: '02',
    icon: '⬡',
    title: 'AI Adoption',
    tagline: 'Go from zero to live in 12 weeks.',
    description:
      'A phased rollout strategy that gets AI working inside your organisation — with the change management, staff upskilling, and governance frameworks to make it stick long-term.',
    includes: [
      '12-week implementation roadmap',
      'Change management playbook',
      'Workforce upskilling plan',
      'Milestone & outcome tracking',
    ],
    price: '$4,000 — $8,000',
    unit: '/ year',
    gold: true,
  },
  {
    index: '03',
    icon: '◎',
    title: 'AI Advertising',
    tagline: 'Turn AI conversations into revenue.',
    description:
      'Monetise your AI interactions by embedding targeted, privacy-respecting ads into every conversation. No subscription model required — you earn a share of every conversion.',
    includes: [
      'Revenue stream architecture',
      'Privacy-first targeting setup',
      'Performance analytics & reporting',
      'Ongoing optimisation support',
    ],
    price: '30 – 50% commission',
    unit: 'on conversions',
    gold: false,
  },
  {
    index: '04',
    icon: '⬢',
    title: 'Website Development',
    tagline: 'A site that actually converts.',
    description:
      'Clean, modern websites built to give your business a distinct digital identity — from single landing pages to full custom builds with animations and a strong mobile experience.',
    includes: [
      'Custom design & branding',
      'Mobile-first responsive build',
      'Performance-optimised delivery',
      '1 month of post-launch support',
    ],
    price: '$200 — $600',
    unit: '/ site',
    gold: false,
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Discover',
    desc: 'Audit your current state, identify gaps, and define what success actually looks like for your business.',
  },
  {
    step: '02',
    title: 'Build',
    desc: 'Design and implement the framework, strategy, or site — with clear milestones and regular check-ins.',
  },
  {
    step: '03',
    title: 'Measure',
    desc: 'Track outcomes against real metrics. Iterate until results are proven and the value is clear.',
  },
];

// ── Page ───────────────────────────────────────────────────────
export default function Services() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const px = isMobile ? 20 : 32;

  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: `72px ${px}px 120px` }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 72 }}>
        <LabelReveal
          delay={0}
          style={{
            fontSize: '0.72rem', color: '#8A8070',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20,
          }}
        >
          Services
        </LabelReveal>

        <AnimatedTitle
          lines={['Four ways I can help', 'your business grow.']}
          style={{
            fontFamily: 'Archivo, sans-serif', fontWeight: 300,
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.03em',
            lineHeight: 1.14, marginBottom: 24,
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
          style={{
            fontSize: '0.95rem', color: 'rgba(255,255,255,0.4)',
            lineHeight: 1.85, maxWidth: 520,
          }}
        >
          Whether you're figuring out how to make AI pay off, building your digital presence, or ready to monetise AI interactions — there's a clear starting point below.
        </motion.p>
      </div>

      {/* ── Service cards ────────────────────────────────────── */}
      <section style={{ marginBottom: 96 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: 16,
        }}>
          {SERVICES.map((s, i) => (
            <CardReveal key={s.index} delay={i * 0.08}>
              <SpotlightCard gold={s.gold} style={{ height: '100%' }}>
                <div style={{ padding: '28px 28px 26px', display: 'flex', flexDirection: 'column', height: '100%' }}>

                  {/* Header row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                    <p style={{
                      fontFamily: 'Archivo, sans-serif', fontSize: '0.6rem',
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: 'rgba(160,200,255,0.4)',
                    }}>{s.index}</p>
                    <span style={{ fontSize: '1.1rem', color: 'rgba(244,201,106,0.4)', lineHeight: 1 }}>{s.icon}</span>
                  </div>

                  {/* Title + tagline */}
                  <p style={{
                    fontFamily: 'Archivo, sans-serif', fontSize: '1.1rem', fontWeight: 400,
                    color: 'rgba(255,255,255,0.92)', marginBottom: 4, letterSpacing: '-0.01em',
                  }}>{s.title}</p>
                  <p style={{
                    fontSize: '0.75rem', color: s.gold ? 'rgba(244,201,106,0.65)' : 'rgba(160,200,255,0.55)',
                    letterSpacing: '0.02em', marginBottom: 14,
                  }}>{s.tagline}</p>

                  {/* Description */}
                  <p style={{
                    fontSize: '0.83rem', color: 'rgba(255,255,255,0.36)',
                    lineHeight: 1.78, marginBottom: 22, flex: 1,
                  }}>{s.description}</p>

                  {/* Includes list */}
                  <div style={{ marginBottom: 22 }}>
                    {s.includes.map((item) => (
                      <div key={item} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8,
                      }}>
                        <span style={{
                          width: 3, height: 3, borderRadius: '50%', flexShrink: 0, marginTop: 7,
                          background: s.gold ? 'rgba(244,201,106,0.5)' : 'rgba(160,200,255,0.45)',
                        }} />
                        <span style={{
                          fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5,
                        }}>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price badge */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'baseline', gap: 6,
                    padding: '5px 12px', borderRadius: 6,
                    border: '1px solid rgba(244,201,106,0.18)',
                    background: 'rgba(244,201,106,0.04)',
                    alignSelf: 'flex-start',
                  }}>
                    <span style={{
                      fontSize: '0.78rem', fontFamily: 'Archivo, sans-serif',
                      color: 'rgba(244,201,106,0.8)', letterSpacing: '0.02em',
                    }}>{s.price}</span>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(244,201,106,0.45)' }}>{s.unit}</span>
                  </div>

                </div>
              </SpotlightCard>
            </CardReveal>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section style={{ marginBottom: 88 }}>
        <LabelReveal
          style={{
            fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(160,200,255,0.5)', marginBottom: 40,
          }}
        >
          How it works
        </LabelReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 0 : 0,
        }}>
          {PROCESS.map((p, i) => (
            <motion.div
              key={p.step}
              initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.14 }}
            >
              <div style={{
                padding: isMobile ? '20px 0' : '0 32px 0 0',
                borderTop: isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
                borderLeft: !isMobile && i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                paddingLeft: !isMobile && i > 0 ? 32 : 0,
              }}>
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.14 + 0.2 }}
                  style={{
                    fontFamily: 'Archivo, sans-serif', fontSize: '0.6rem',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'rgba(160,200,255,0.4)', marginBottom: 14,
                  }}
                >{p.step}</motion.p>
                <p style={{
                  fontFamily: 'Archivo, sans-serif', fontSize: '1rem', fontWeight: 400,
                  color: 'rgba(255,255,255,0.88)', marginBottom: 10, letterSpacing: '-0.01em',
                }}>{p.title}</p>
                <p style={{
                  fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.75,
                }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
          {isMobile && <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes cta-pulse {
          0%, 100% { box-shadow: 0 0 0px rgba(244,201,106,0); }
          50%       { box-shadow: 0 0 22px 4px rgba(244,201,106,0.18); }
        }
        .cta-btn { animation: cta-pulse 3.2s ease-in-out infinite; }
        .cta-btn:hover { animation: none; }
      `}</style>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          paddingTop: 48,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}>
          <div>
            <p style={{
              fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontWeight: 300, color: 'rgba(255,255,255,0.88)',
              letterSpacing: '-0.02em', marginBottom: 8,
            }}>
              Not sure where to start?
            </p>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
              Send me a message and we'll figure out the right fit together.
            </p>
          </div>
          <a
            href="mailto:vabi7562@sabharwal.cloud"
            className="cta-btn"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 22px', borderRadius: 9999, flexShrink: 0,
              border: '1px solid rgba(244,201,106,0.3)',
              background: 'rgba(244,201,106,0.06)',
              fontFamily: 'Archivo, sans-serif', fontSize: '0.82rem',
              color: 'rgba(244,201,106,0.85)', letterSpacing: '0.03em',
              textDecoration: 'none',
              transition: 'border-color 150ms, background 150ms, color 150ms',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(244,201,106,0.6)';
              e.currentTarget.style.background  = 'rgba(244,201,106,0.10)';
              e.currentTarget.style.color       = 'rgba(244,201,106,1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(244,201,106,0.3)';
              e.currentTarget.style.background  = 'rgba(244,201,106,0.06)';
              e.currentTarget.style.color       = 'rgba(244,201,106,0.85)';
            }}
          >
            vabi7562@sabharwal.cloud ↗
          </a>
        </div>
      </motion.div>

    </main>
  );
}
