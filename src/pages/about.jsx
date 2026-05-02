import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

// ── Scroll-reveal wrapper ──────────────────────────────────────
const Reveal = ({ children, delay = 0, y = 28 }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

// ── Count-up hook ─────────────────────────────────────────────
function useCountUp(target, inView, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p     = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  return val;
}

function Stat({ value, suffix = '', label, style }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSeen(true); }, { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const count = useCountUp(value, seen);
  return (
    <div ref={ref} style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: 24, paddingRight: 24, ...style }}>
      <div style={{
        fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 300, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6,
      }}>
        {count}<span style={{ fontSize: '0.55em', color: 'rgba(160,200,255,0.8)' }}>{suffix}</span>
      </div>
      <p style={{ fontSize: '0.68rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
        {label}
      </p>
    </div>
  );
}

// ── Spotlight card ────────────────────────────────────────────
function SpotlightCard({ children, style, onClick, gold = false }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hot, setHot] = useState(false);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const glowColor  = gold ? 'rgba(244,201,106,0.10)' : 'rgba(160,200,255,0.07)';
  const borderHot  = gold ? 'rgba(244,201,106,0.25)' : 'rgba(160,200,255,0.20)';
  const shadowHot  = gold ? '0 0 40px rgba(244,201,106,0.06)' : '0 0 40px rgba(160,200,255,0.05)';

  return (
    <div
      ref={ref}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{
        ...style,
        position: 'relative', borderRadius: 14, overflow: 'hidden',
        border: `1px solid ${hot ? borderHot : 'rgba(255,255,255,0.08)'}`,
        background: hot
          ? `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${glowColor} 0%, rgba(255,255,255,0.02) 55%, transparent 100%)`
          : 'rgba(255,255,255,0.02)',
        transition: 'border-color 200ms, box-shadow 200ms, transform 220ms',
        boxShadow:  hot ? shadowHot : 'none',
        transform:  hot ? 'translateY(-4px)' : 'translateY(0)',
      }}
    >
      {children}
    </div>
  );
}

// ── Section label ─────────────────────────────────────────────
function SectionLabel({ number, text }) {
  return (
    <p style={{
      fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'rgba(160,200,255,0.5)', marginBottom: 32,
    }}>
      {number} — {text}
    </p>
  );
}

// ── Data ──────────────────────────────────────────────────────
const offerings = [
  {
    title: 'AIFIN Framework',
    desc:  'Track AI costs, measure ROI, and manage risk with a structured financial intelligence layer for AI investments.',
    price: 'From $0 — $1,000 / project',
    icon:  '◈',
  },
  {
    title: 'AI Adoption',
    desc:  'Implement AI successfully in 12 weeks with a phased rollout strategy, change management, and measurable milestones.',
    price: '$4,000 — $8,000 / year',
    icon:  '⬡',
  },
  {
    title: 'AI Advertising',
    desc:  'Monetize your AI interactions by turning every conversation into a targeted, privacy-respecting revenue stream.',
    price: '30 – 50% commission',
    icon:  '◎',
  },
  {
    title: 'Website Development',
    desc:  'Clean, modern websites built to convert — from landing pages to full custom builds with a distinct digital identity.',
    price: '$200 — $600 / site',
    icon:  '⬢',
  },
];

const skills = [
  { category: 'Data Science & ML',  items: ['Python', 'Scikit-learn', 'Pandas', 'TensorFlow', 'Keras', 'NLTK', 'R', 'NLP', 'Statistical Analysis'] },
  { category: 'Visualisation & BI', items: ['Power BI', 'DAX', 'Power Query', 'Tableau', 'Looker Studio', 'Matplotlib', 'Seaborn'] },
  { category: 'Databases & Cloud',  items: ['SQL', 'BigQuery', 'GCP', 'AWS', 'Azure'] },
  { category: 'Workflow',           items: ['Git', 'GitHub', 'Jira', 'Asana'] },
  { category: 'Strategy',           items: ['Mathematical Optimisation', 'Monte Carlo Simulation', 'Risk Analysis', 'Supply Chain'] },
];

const experience = [
  {
    role: 'Junior Business Analyst', company: 'Pinaz International',
    location: 'Ludhiana, India', period: 'Mar 2021 – Jan 2023',
    bullets: ['Authored and maintained 3 weekly Power BI performance dashboards, providing critical KPIs to a management team of 5 for strategic decision-making.'],
  },
];

const projects = [
  {
    title: 'Customer Churn Prediction',
    outcome: '92%', outcomeSuffix: ' accuracy',
    description: 'Built and validated a Python classification model to predict high-risk customer churn. Segmented customers by risk tier and developed targeted retention recommendations.',
    tech: ['Python', 'Scikit-learn', 'Pandas'],
  },
  {
    title: 'Marketing Analytics',
    outcome: '66%', outcomeSuffix: ' coupon CVR',
    description: 'Wrote SQL in BigQuery and built Looker Studio dashboards to analyse 2024 performance. Ran A/B landing page tests and recommended reallocating 20–30% budget to digital.',
    tech: ['BigQuery', 'SQL', 'Looker Studio', 'Excel'],
  },
  {
    title: 'End-to-End BI Solution',
    outcome: '50K+', outcomeSuffix: ' records',
    description: 'Architected a complete BI pipeline from raw data ingestion to executive-ready Power BI dashboards. Built role-specific dashboards with custom DAX measures and 15% faster reporting.',
    tech: ['Power BI', 'DAX', 'Power Query', 'Excel'],
  },
];

const links = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/VabiSabharwal' },
  { label: 'GitHub',   href: 'https://github.com/Vabi7562' },
  { label: 'Email',    href: 'mailto:vabi7562@sabharwal.cloud' },
];

// ── Page ──────────────────────────────────────────────────────
export default function About() {
  const isMobile = useIsMobile();
  const px = isMobile ? 20 : 32;

  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: `72px ${px}px 120px` }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <Reveal>
        <div style={{ marginBottom: 72 }}>

          {/* Status pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
            padding: '5px 14px', borderRadius: 9999,
            border: '1px solid rgba(160,200,255,0.2)', background: 'rgba(160,200,255,0.05)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'rgba(120,220,120,0.8)', boxShadow: '0 0 6px rgba(120,220,120,0.6)',
              display: 'inline-block',
            }} />
            <span style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(160,200,255,0.7)' }}>
              Available · Melbourne, VIC
            </span>
          </div>

          {/* Overline */}
          <p style={{ fontSize: '0.72rem', color: '#8A8070', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20 }}>
            About
          </p>

          {/* Title */}
          <h1 style={{
            fontFamily: 'Archivo, sans-serif', fontWeight: 300,
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.03em',
            lineHeight: 1.12, marginBottom: 24,
          }}>
            Vabi Sabharwal — AI Strategy<br />Consultant &amp; Business Analyst
          </h1>

          {/* Links row */}
          <div style={{ display: 'flex', gap: 20, marginBottom: 40 }}>
            {links.map(({ label: l, href }) => (
              <a key={l} href={href} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', letterSpacing: '0.04em', transition: 'color 150ms' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
              >
                {l} ↗
              </a>
            ))}
          </div>

          {/* Bio paragraphs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 620 }}>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, margin: 0 }}>
              I'm a Business Analytics student at Deakin University with a passion for helping companies unlock real value from AI investments. I build frameworks that turn AI spending into measurable business outcomes.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, margin: 0 }}>
              Most companies adopt AI without a clear strategy — they overspend, underdeliver, and lose confidence in the technology. I created three frameworks to fix that: AIFIN for cost and risk management, an AI Adoption Framework for structured implementation, and an AI Advertising Platform to monetise AI interactions.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.85, margin: 0 }}>
              I also build clean, modern websites for businesses that need a strong digital presence — from landing pages to full custom builds.
            </p>
            {/* Gold pullquote */}
            <p style={{
              fontSize: '1.05rem', color: 'rgba(244,201,106,0.85)', lineHeight: 1.85, margin: 0,
              fontFamily: 'Archivo, sans-serif', fontWeight: 300, fontStyle: 'italic',
              borderLeft: '2px solid rgba(244,201,106,0.3)', paddingLeft: 20, marginTop: 8,
            }}>
              I believe AI should make businesses more profitable, not just more complex.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <Reveal delay={0.1}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 0, marginBottom: 80,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '32px 0',
        }}>
          <Stat value={92}    suffix="%"  label="Model accuracy"     style={isMobile ? { width: '50%', boxSizing: 'border-box' } : {}} />
          <Stat value={50000} suffix="+"  label="Records processed"  style={isMobile ? { width: '50%', boxSizing: 'border-box' } : {}} />
          <Stat value={4}     suffix=""   label="End-to-end projects" style={isMobile ? { width: '50%', boxSizing: 'border-box', marginTop: 24 } : {}} />
          <Stat value={3}     suffix=""   label="Live dashboards"     style={isMobile ? { width: '50%', boxSizing: 'border-box', marginTop: 24 } : {}} />
        </div>
      </Reveal>

      {/* ── What I Offer ──────────────────────────────────────── */}
      <section style={{ marginBottom: 88 }}>
        <Reveal>
          <SectionLabel number="01" text="What I Offer" />
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
          {offerings.map((item, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <SpotlightCard gold={i < 2}>
                <div style={{ padding: '28px 28px 26px' }}>
                  {/* Number + icon row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <p style={{
                      fontFamily: 'Archivo, sans-serif', fontSize: '0.6rem',
                      letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: 'rgba(160,200,255,0.4)',
                    }}>0{i + 1}</p>
                    <span style={{ fontSize: '1.1rem', color: 'rgba(244,201,106,0.4)', lineHeight: 1 }}>
                      {item.icon}
                    </span>
                  </div>

                  <p style={{
                    fontFamily: 'Archivo, sans-serif', fontSize: '1.05rem', fontWeight: 400,
                    color: 'rgba(255,255,255,0.9)', marginBottom: 10, letterSpacing: '-0.01em',
                  }}>{item.title}</p>

                  <p style={{
                    fontSize: '0.84rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, marginBottom: 22,
                  }}>{item.desc}</p>

                  {/* Price */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', borderRadius: 6,
                    border: '1px solid rgba(244,201,106,0.18)',
                    background: 'rgba(244,201,106,0.04)',
                  }}>
                    <span style={{
                      fontSize: '0.73rem', color: 'rgba(244,201,106,0.75)',
                      fontFamily: 'Archivo, sans-serif', letterSpacing: '0.02em',
                    }}>{item.price}</span>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Experience ────────────────────────────────────────── */}
      <section style={{ marginBottom: 80 }}>
        <Reveal>
          <SectionLabel number="02" text="Experience" />
        </Reveal>

        {experience.map((job, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '160px 1fr',
              gap: isMobile ? 0 : '0 40px',
              padding: '28px 0',
              borderTop: '1px solid rgba(255,255,255,0.07)',
            }}>
              {!isMobile && (
                <div>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6 }}>{job.period}</p>
                  <p style={{ fontSize: '0.7rem', color: 'rgba(160,200,255,0.4)', marginTop: 4 }}>{job.location}</p>
                </div>
              )}
              <div>
                <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: '1.05rem', fontWeight: 400,
                  color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>{job.role}</p>
                <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: isMobile ? 6 : 14,
                  letterSpacing: '0.02em' }}>{job.company}</p>
                {isMobile && (
                  <p style={{ fontSize: '0.7rem', color: 'rgba(160,200,255,0.4)', marginBottom: 12 }}>
                    {job.period} · {job.location}
                  </p>
                )}
                {job.bullets.map((b, j) => (
                  <p key={j} style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.4)',
                    lineHeight: 1.75, paddingLeft: 14, position: 'relative', marginBottom: 8 }}>
                    <span style={{ position: 'absolute', left: 0, top: 10, width: 3, height: 3,
                      borderRadius: '50%', background: 'rgba(160,200,255,0.4)', display: 'block' }} />
                    {b}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}

        {/* Education row */}
        <Reveal>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '160px 1fr',
            gap: isMobile ? 0 : '0 40px',
            padding: '28px 0',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}>
            {!isMobile && (
              <div>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>2021 – Present</p>
                <p style={{ fontSize: '0.7rem', color: 'rgba(160,200,255,0.4)', marginTop: 4 }}>Melbourne, VIC</p>
              </div>
            )}
            <div>
              <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: '1.05rem', fontWeight: 400,
                color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>Bachelor of Business Analytics</p>
              <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: isMobile ? 6 : 0 }}>Deakin University</p>
              {isMobile && (
                <p style={{ fontSize: '0.7rem', color: 'rgba(160,200,255,0.4)', marginTop: 4 }}>2021 – Present · Melbourne, VIC</p>
              )}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Technical Skills ──────────────────────────────────── */}
      <section style={{ marginBottom: 80 }}>
        <Reveal>
          <SectionLabel number="03" text="Technical Skills" />
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {skills.map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '160px 1fr',
                gap: isMobile ? '8px 0' : '0 40px',
                padding: '20px 0',
                borderTop: '1px solid rgba(255,255,255,0.07)',
              }}>
                <p style={{ fontSize: '0.72rem', color: 'rgba(160,200,255,0.5)', letterSpacing: '0.04em', paddingTop: 2 }}>
                  {s.category}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {s.items.map(item => (
                    <span key={item} style={{
                      fontSize: '0.75rem', padding: '4px 12px', borderRadius: 6,
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.45)', letterSpacing: '0.02em',
                      transition: 'border-color 150ms, color 150ms, background 150ms',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(160,200,255,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.background = 'rgba(160,200,255,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
        </div>
      </section>

      {/* ── Selected Projects ─────────────────────────────────── */}
      <section>
        <Reveal>
          <SectionLabel number="04" text="Selected Projects" />
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
          {projects.map((p, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <SpotlightCard>
                <div style={{ padding: '28px 28px 24px' }}>
                  <div style={{ marginBottom: 16 }}>
                    <span style={{
                      fontFamily: 'Archivo, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                      fontWeight: 300, color: 'rgba(160,200,255,0.9)', letterSpacing: '-0.03em',
                    }}>{p.outcome}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(160,200,255,0.4)', marginLeft: 4 }}>
                      {p.outcomeSuffix}
                    </span>
                  </div>

                  <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: '0.95rem', fontWeight: 400,
                    color: 'rgba(255,255,255,0.85)', marginBottom: 10, letterSpacing: '-0.01em' }}>
                    {p.title}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, marginBottom: 20 }}>
                    {p.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {p.tech.map(t => (
                      <span key={t} style={{
                        fontSize: '0.65rem', padding: '3px 10px', borderRadius: 4,
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

    </main>
  );
}
