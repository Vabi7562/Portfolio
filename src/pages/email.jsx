import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   ICONS (inline SVG)
───────────────────────────────────────────────────────────── */
const Ic = {
  zap:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M8.5 2L3 8.5h4.5L6.5 13 12 6.5H7.5L8.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  star:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2l1.4 4.2H13l-3.5 2.5 1.3 4L7.5 10l-3.3 2.7 1.3-4L2 6.2h4.1L7.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  edit:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M10.5 2.5l2 2L5 12H3v-2L10.5 2.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  sun:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3.2 3.2l1 1M10.8 10.8l1 1M3.2 11.8l1-1M10.8 4.2l1-1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  search:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  msg:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="3.5" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 11.5v1.5l2.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  clock:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M7.5 5v2.5L9.5 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  undo:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 6H9a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M3 3.5L1 6l2 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  layers:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2L13 5 7.5 8 2 5l5.5-3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M2 9l5.5 3L13 9" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  palette: <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="7" r="1" fill="currentColor"/><circle cx="7.5" cy="5" r="1" fill="currentColor"/><circle cx="10" cy="7" r="1" fill="currentColor"/><circle cx="7.5" cy="10" r="1" fill="currentColor"/></svg>,
  bell:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2a4 4 0 0 1 4 4v3.5l1 1v.5H3v-.5l1-1V6a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M6 11.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.2"/></svg>,
  cal:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="3" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 2v2M10 2v2M2 7h11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  link:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M6 9l3-3M9.5 5a2 2 0 0 1 0 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M9.5 3.5A3.5 3.5 0 1 1 11 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  mic:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="5" y="2" width="5" height="7" rx="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M3 8a4.5 4.5 0 0 0 9 0M7.5 12.5v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  shield:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 2L3 4v4c0 3 2 5 4.5 6C10 13 12 11 12 8V4L7.5 2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M5.5 7.5l1.5 1.5 2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  face:    <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 8.5s.8 1.5 2.5 1.5 2.5-1.5 2.5-1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="5.5" cy="6.5" r=".75" fill="currentColor"/><circle cx="9.5" cy="6.5" r=".75" fill="currentColor"/></svg>,
  phone:   <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="4" y="1.5" width="7" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="7.5" cy="11.5" r=".8" fill="currentColor"/></svg>,
  inbox2:  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="2" y="3" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 9h3l1.5 2h2L10 9h3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  bot:     <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="3" y="5" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5.5 9h4M6 8v2M9 8v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M7.5 5V3M6 3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
};

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
/* ── Left column (AI-powered features) ── */
const FEATURES_LEFT = [
  { icon: 'zap',    col: 'rgba(244,201,106,0.85)', bg: 'rgba(244,201,106,0.10)', name: 'AI Inbox Triage'   },
  { icon: 'star',   col: 'rgba(160,200,255,0.85)', bg: 'rgba(160,200,255,0.09)', name: 'Smart Summaries'   },
  { icon: 'edit',   col: 'rgba(160,200,255,0.85)', bg: 'rgba(160,200,255,0.09)', name: 'AI Draft Replies'  },
  { icon: 'sun',    col: 'rgba(244,201,106,0.85)', bg: 'rgba(244,201,106,0.10)', name: 'Daily Digest'      },
  { icon: 'search', col: 'rgba(160,200,255,0.85)', bg: 'rgba(160,200,255,0.09)', name: 'Smart Search'      },
  { icon: 'msg',    col: 'rgba(200,180,255,0.85)', bg: 'rgba(200,180,255,0.08)', name: 'Quick Replies'     },
  { icon: 'clock',  col: 'rgba(160,200,255,0.85)', bg: 'rgba(160,200,255,0.09)', name: 'Send Later'        },
  { icon: 'undo',   col: 'rgba(244,201,106,0.85)', bg: 'rgba(244,201,106,0.10)', name: 'Undo Send'         },
  { icon: 'shield', col: 'rgba(244,201,106,0.85)', bg: 'rgba(244,201,106,0.10)', name: 'Tracker Blocking'  },
];

/* ── Right column (platform & utility features) ── */
const FEATURES_RIGHT = [
  { icon: 'bot',    col: 'rgba(244,201,106,0.85)', bg: 'rgba(244,201,106,0.10)', name: 'Powered by Llama'    },
  { icon: 'layers', col: 'rgba(160,200,255,0.85)', bg: 'rgba(160,200,255,0.09)', name: 'Email Templates'     },
  { icon: 'palette',col: 'rgba(200,180,255,0.85)', bg: 'rgba(200,180,255,0.08)', name: 'Fully Customisable'  },
  { icon: 'bell',   col: 'rgba(244,201,106,0.85)', bg: 'rgba(244,201,106,0.10)', name: 'Smart Notifications' },
  { icon: 'cal',    col: 'rgba(160,200,255,0.85)', bg: 'rgba(160,200,255,0.09)', name: 'Calendar Integration'},
  { icon: 'link',   col: 'rgba(200,180,255,0.85)', bg: 'rgba(200,180,255,0.08)', name: 'Integrations'        },
  { icon: 'mic',    col: 'rgba(160,200,255,0.85)', bg: 'rgba(160,200,255,0.09)', name: 'Siri Shortcuts'      },
  { icon: 'face',   col: 'rgba(160,200,255,0.85)', bg: 'rgba(160,200,255,0.09)', name: 'Face ID Lock'        },
  { icon: 'phone',  col: 'rgba(200,180,255,0.85)', bg: 'rgba(200,180,255,0.08)', name: 'iPhone + Mac'        },
  { icon: 'inbox2', col: 'rgba(160,200,255,0.85)', bg: 'rgba(160,200,255,0.09)', name: 'Multiple Accounts'   },
];

/* ── Pre-computed positions (curved arcs) ── */
const NL     = FEATURES_LEFT.length;   // 9
const NR     = FEATURES_RIGHT.length;  // 10
const LEFT_X  = -300;
const RIGHT_X =  300;
const CURVE   =  52;   // max inward bow at centre row (px)

// Left arc: centre features are CURVE px closer to icon than top/bottom
const POSITIONS_LEFT = FEATURES_LEFT.map((_, i) => {
  const t   = NL > 1 ? (i / (NL - 1)) * 2 - 1 : 0;  // -1 … +1
  const bow = CURVE * (1 - t * t);                     // parabola peak at centre
  return { x: LEFT_X + bow, y: (i - (NL - 1) / 2) * 56 };
});

// Right arc: mirror
const POSITIONS_RIGHT = FEATURES_RIGHT.map((_, i) => {
  const t   = NR > 1 ? (i / (NR - 1)) * 2 - 1 : 0;
  const bow = CURVE * (1 - t * t);
  return { x: RIGHT_X - bow, y: (i - (NR - 1) / 2) * 52 };
});

const TRUST = [
  'Zero data collection',
  'Runs on your device',
  'No ads, ever',
  'No third-party AI APIs',
  'Open-source AI models',
];

const PRICING = [
  {
    name: 'Free', amount: '$0', period: 'forever', featured: false,
    items: ['1 email account', 'Basic inbox triage', '5 AI summaries / day', 'Standard notifications'],
    cta: 'Download free',
  },
  {
    name: 'Pro', amount: '$7.99', period: 'per month', featured: true,
    items: ['Unlimited accounts', 'Unlimited AI summaries', 'Smart drafts & quick replies', 'Daily digest', 'Email templates', 'Calendar integration', 'Priority support'],
    cta: 'Start Pro',
  },
  {
    name: 'Bundle', amount: '$19.99', period: 'per month', featured: false,
    items: ['Everything in Pro', 'Aero Finance', 'Aero Health', 'One subscription, full ecosystem'],
    cta: 'Get the Bundle',
  },
];

/* ─────────────────────────────────────────────────────────────
   SCROLL FADE-UP HOOK
───────────────────────────────────────────────────────────── */
function useFadeUp() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('ev-visible'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─────────────────────────────────────────────────────────────
   WORD REVEAL — slides each word up from hidden on scroll enter
───────────────────────────────────────────────────────────── */
function WordReveal({ children, style, className, triggerOnMount = false }) {
  const ref     = useRef(null);
  const [vis, setVis] = useState(triggerOnMount);

  useEffect(() => {
    if (triggerOnMount) { setVis(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggerOnMount]);

  /* Split string on newlines, then words per line */
  const raw   = typeof children === 'string' ? children : '';
  const lines = raw.split('\n');
  let   wi    = 0;

  return (
    <div ref={ref} style={style} className={className}>
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {line.split(' ').map(word => {
            const delay = (wi++) * 0.068;
            return (
              <span key={word + wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', marginRight: '0.24em' }}>
                <span style={{
                  display: 'inline-block',
                  transform: vis ? 'translateY(0%)' : 'translateY(115%)',
                  transition: `transform 0.72s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
                }}>{word}</span>
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   INBOX MOCKUP
───────────────────────────────────────────────────────────── */
function InboxMockup() {
  const rows = [
    { from: 'Alex Chen', subject: 'Re: Q4 strategy deck',       summary: 'Confirms Thursday 3pm, needs slide 4 updated',    time: '9:41 AM',   col: 'rgba(160,200,255,0.15)', ini: 'AC', unread: true,  priority: true  },
    { from: 'GitHub',    subject: '[aero-mail] PR #42 merged',   summary: 'Deploy pipeline triggered, no action needed',     time: '8:12 AM',   col: 'rgba(255,255,255,0.07)', ini: 'GH', unread: true,  priority: false },
    { from: 'Notion',    subject: 'Weekly workspace digest',     summary: '4 pages updated by your team this week',          time: 'Yesterday', col: 'rgba(244,201,106,0.10)', ini: 'N',  unread: false, priority: false },
    { from: 'Mum',       subject: 'Sunday dinner?',              summary: "Asks if you're coming, suggests 6pm",             time: 'Yesterday', col: 'rgba(200,180,255,0.12)', ini: 'M',  unread: false, priority: false },
  ];

  return (
    <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {['rgba(255,90,80,0.7)', 'rgba(255,190,0,0.7)', 'rgba(40,205,65,0.7)'].map((c, i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.04em', marginLeft: 8 }}>Inbox — 2 unread</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, color: 'rgba(160,200,255,0.5)', letterSpacing: '0.08em' }}>AI triage on</span>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(120,220,120,0.8)', boxShadow: '0 0 5px rgba(120,220,120,0.5)' }} />
        </div>
      </div>

      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 20px', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: r.col, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.6)' }}>{r.ini}</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 2 }}>
              {r.from}
              {r.priority && <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 3, background: 'rgba(244,201,106,0.12)', border: '1px solid rgba(244,201,106,0.2)', color: 'rgba(244,201,106,0.7)', letterSpacing: '0.06em', marginLeft: 7 }}>PRIORITY</span>}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.subject}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 4,
              background: r.priority ? 'rgba(244,201,106,0.07)' : 'rgba(160,200,255,0.07)',
              border: `1px solid ${r.priority ? 'rgba(244,201,106,0.2)' : 'rgba(160,200,255,0.15)'}`,
              fontSize: 10, color: r.priority ? 'rgba(244,201,106,0.8)' : 'rgba(160,200,255,0.7)',
            }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', opacity: 0.7, display: 'inline-block', flexShrink: 0 }} />
              {r.summary}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>{r.time}</span>
            {r.unread && <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F4C96A', boxShadow: '0 0 5px rgba(244,201,106,0.6)' }} />}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   APP ICON
   Recreates the HTML mock: dark rounded square, scattered stars,
   origami paper plane, blue→gold mix-blend-mode:color overlay.
───────────────────────────────────────────────────────────── */
function AppIcon({ size = 96, style: extraStyle }) {
  const radius  = Math.round(size * 0.225);  // ~54 / 240 = 0.225
  const planeW  = Math.round(size * 0.625);

  const STARS = [
    { top: '18%', left: '14%', gold: true,  tiny: false },
    { top: '28%', left: '78%', gold: false, tiny: true  },
    { top: '72%', left: '20%', gold: true,  tiny: true  },
    { top: '76%', left: '82%', gold: false, tiny: false },
    { top: '12%', left: '55%', gold: true,  tiny: true  },
  ];

  return (
    <div style={{
      width:        size,
      height:       size,
      borderRadius: radius,
      background:   '#08080E',
      position:     'relative',
      overflow:     'hidden',
      flexShrink:   0,
      boxShadow:    '0 12px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
      ...extraStyle,
    }}>

      {/* Radial glow — top-left (blue) */}
      <div style={{
        position:   'absolute',
        width: '60%', height: '60%',
        background: 'radial-gradient(circle, rgba(160,200,255,0.12), transparent 70%)',
        top: '35%',  left: '35%',
        transform:  'translate(-50%, -50%)',
        zIndex:     1,
      }} />

      {/* Radial glow — bottom-right (gold) */}
      <div style={{
        position:   'absolute',
        width: '50%', height: '50%',
        background: 'radial-gradient(circle, rgba(244,201,106,0.10), transparent 70%)',
        bottom: '25%', right: '25%',
        transform:  'translate(50%, 50%)',
        zIndex:     1,
      }} />

      {/* Star particles */}
      {STARS.map((s, i) => (
        <div key={i} style={{
          position:     'absolute',
          top:          s.top,  left: s.left,
          width:        s.tiny ? 2 : 3,
          height:       s.tiny ? 2 : 3,
          borderRadius: '50%',
          background:   s.gold ? 'rgba(244,201,106,0.7)' : 'rgba(160,200,255,0.6)',
          boxShadow:    s.gold ? '0 0 4px rgba(244,201,106,0.4)' : '0 0 4px rgba(160,200,255,0.3)',
          opacity:      s.tiny ? 0.5 : 1,
          zIndex:       2,
        }} />
      ))}

      {/* Paper plane SVG — centred */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width={planeW} height={planeW} viewBox="0 0 100 100" fill="none">
          {/* Main body */}
          <path
            d="M8 52 L92 18 L72 82 L50 60 L40 76 L37 57 Z"
            fill="white" opacity="0.93"
          />
          {/* Inner fold — underside shadow */}
          <path
            d="M92 18 L50 60 L37 57 Z"
            fill="rgba(0,0,0,0.18)"
          />
          {/* Tail flap */}
          <path
            d="M50 60 L40 76 L37 57 Z"
            fill="rgba(255,255,255,0.55)"
          />
          {/* Spine crease */}
          <line x1="8" y1="52" x2="72" y2="82"
            stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
          {/* Leading-edge fold line */}
          <line x1="92" y1="18" x2="72" y2="82"
            stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Blue → gold gradient, mix-blend-mode:color — same as HTML mock */}
      <div style={{
        position:     'absolute', inset: 0, zIndex: 4,
        background:   'linear-gradient(135deg, rgba(160,200,255,0.82), rgba(244,201,106,0.82))',
        mixBlendMode: 'color',
        pointerEvents:'none',
      }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRIMITIVES
───────────────────────────────────────────────────────────── */
const C = { maxWidth: 960, margin: '0 auto', padding: '0 32px', width: '100%' };

function Overline({ children, center }) {
  return (
    <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(160,200,255,0.5)', marginBottom: 20, textAlign: center ? 'center' : 'left' }}>
      {children}
    </p>
  );
}

function FadeBox({ children, style, onMouseEnter, onMouseLeave }) {
  const ref = useFadeUp();
  return <div ref={ref} className="ev-fade" style={style} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{children}</div>;
}

/* ─────────────────────────────────────────────────────────────
   SECTIONS
───────────────────────────────────────────────────────────── */
function Hero() {
  const [email, setEmail]      = useState('');
  const [submitted, setSubmit] = useState(false);

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 0 80px' }}>
      <div style={C}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 64, alignItems: 'center' }}>

          {/* Copy */}
          <div>
            {/* App icon */}
            <div className="ev-fade ev-visible" style={{ marginBottom: 28 }}>
              <AppIcon size={80} />
            </div>
            <Overline>Aero Mail</Overline>
            <h1 className="ev-fade ev-visible ev-h1" style={{
              fontFamily: 'Archivo, sans-serif', fontWeight: 300,
              fontSize: 'clamp(2.2rem, 5vw, 4rem)', color: '#F0EBE0',
              letterSpacing: '-0.03em', lineHeight: 1.08, marginBottom: 24,
            }}>
              The email app<br />
              that thinks like you.<br />
              <em style={{ fontStyle: 'italic', color: 'rgba(160,200,255,0.7)' }}>Privately.</em>
            </h1>
            <p className="ev-fade ev-visible ev-p" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 460, marginBottom: 40, fontFamily: 'Space Grotesk, sans-serif' }}>
              Aero Mail uses local AI to triage, summarise and draft your emails — without sending a single byte to the cloud.
            </p>

            {/* Waitlist */}
            <div className="ev-fade ev-visible" style={{ marginBottom: 28 }}>
              {submitted ? (
                <p style={{ fontSize: '0.82rem', color: 'rgba(120,220,120,0.8)', letterSpacing: '0.03em' }}>
                  ✓ You're on the list — we'll be in touch.
                </p>
              ) : (
                <div style={{ display: 'flex', gap: 10, maxWidth: 420 }}>
                  <input
                    type="email" placeholder="your@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    style={{
                      flex: 1, padding: '11px 18px', borderRadius: 9999,
                      background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#F0EBE0', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.82rem', outline: 'none',
                    }}
                  />
                  <button onClick={() => email && setSubmit(true)} style={{
                    padding: '11px 24px', borderRadius: 9999, border: 'none',
                    background: '#F4C96A', color: '#0A0A0A',
                    fontFamily: 'Archivo, sans-serif', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.04em', cursor: 'pointer',
                  }}>
                    Join waitlist ↗
                  </button>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="ev-fade ev-visible" style={{ display: 'flex', gap: 8 }}>
              {['iPhone', 'Mac'].map(p => (
                <span key={p} style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>{p}</span>
              ))}
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: 6, border: '1px solid rgba(244,201,106,0.15)', fontSize: '0.7rem', color: 'rgba(244,201,106,0.5)', letterSpacing: '0.04em' }}>Coming 2025</span>
            </div>
          </div>

          {/* Inbox mockup */}
          <div className="ev-fade ev-visible ev-float">
            <InboxMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

const TRUST_TICKER_ITEMS = [
  'Zero data collection', '·',
  'Runs on your device',  '·',
  'No ads, ever',         '·',
  'No third-party AI',    '·',
  'Open-source models',   '·',
  'End-to-end private',   '·',
  'On-device Llama',      '·',
  'Zero telemetry',       '·',
];

function TrustStrip() {
  const ref = useFadeUp();
  const all = [...TRUST_TICKER_ITEMS, ...TRUST_TICKER_ITEMS];
  return (
    <div ref={ref} className="ev-fade" style={{
      borderTop:    '1px solid rgba(255,255,255,0.07)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      padding: '18px 0',
      overflow: 'hidden',
      maskImage: 'linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 6%, black 94%, transparent 100%)',
    }}>
      <div style={{
        display: 'flex',
        width: 'max-content',
        animation: 'trust-scroll 32s linear infinite',
      }}>
        {all.map((item, i) => {
          const isDot = item === '·';
          return (
            <span key={i} style={{
              fontFamily: 'Archivo, sans-serif',
              fontSize: isDot ? '0.55rem' : '0.62rem',
              fontWeight: 300,
              letterSpacing: isDot ? 0 : '0.2em',
              textTransform: 'uppercase',
              color: isDot ? 'rgba(160,200,255,0.3)' : 'rgba(240,235,224,0.28)',
              whiteSpace: 'nowrap',
              padding: isDot ? '0 1.2rem' : '0 1.8rem',
              transition: 'color 0.3s ease',
              display: 'flex',
              alignItems: 'center',
            }}>
              {!isDot && (
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(160,200,255,0.5)', boxShadow: '0 0 4px rgba(160,200,255,0.35)', display: 'inline-block', marginRight: '0.85rem', flexShrink: 0 }} />
              )}
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function PrivacySection() {
  const ref = useFadeUp();
  return (
    <section style={{ padding: '100px 0' }}>
      <div style={C}>
        <div ref={ref} className="ev-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          {/* Stats card */}
          <div className="ev-float-b" style={{ background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 32 }}>
            {[
              { label: 'Email processed',     val: 'On device',     col: 'rgba(120,220,120,0.8)' },
              { label: 'Data sent to cloud',  val: '0 bytes',       col: 'rgba(160,200,255,0.8)' },
              { label: 'Third-party AI APIs', val: 'None',          col: 'rgba(160,200,255,0.8)' },
              { label: 'Ads',                 val: 'Never',         col: 'rgba(160,200,255,0.8)' },
              { label: 'AI model',            val: 'Llama (local)', col: 'rgba(244,201,106,0.8)' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'Space Grotesk, sans-serif' }}>{r.label}</span>
                <span style={{ fontSize: '0.78rem', color: r.col, fontFamily: 'Archivo, sans-serif', letterSpacing: '0.03em' }}>{r.val}</span>
              </div>
            ))}
          </div>

          {/* Copy */}
          <div>
            <Overline>Privacy by design</Overline>
            <WordReveal
              className="ev-h2"
              style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 300, fontSize: 'clamp(1.8rem,3vw,2.8rem)', color: '#F0EBE0', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: 20 }}
            >{"100% private\nby default."}</WordReveal>
            <p className="ev-p" style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.85, marginBottom: 28, maxWidth: 380, fontFamily: 'Space Grotesk, sans-serif' }}>
              Your emails never leave your device. All AI processing runs locally. No cloud. No tracking. No ads. Not even us can see your inbox.
            </p>
            {['All AI runs on-device via Ollama', 'Zero telemetry, zero analytics', 'Open-source Llama models — auditable'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(160,200,255,0.5)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'Space Grotesk, sans-serif' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


const ICON_SIZE   = 220;
const ICON_RADIUS = Math.round(ICON_SIZE * 0.225); // ~50px

const ORBIT_CSS = `
/* ── Icon drop from top ── */
@keyframes icon-drop {
  0%   { transform: translateY(-380px) scale(0.68); opacity: 0; }
  58%  { transform: translateY(20px)   scale(1.06); opacity: 1; }
  76%  { transform: translateY(-10px)  scale(0.97); }
  88%  { transform: translateY(5px)    scale(1.02); }
  100% { transform: translateY(0px)    scale(1);    opacity: 1; }
}
.icon-dropping {
  animation: icon-drop 0.95s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
/* ── Feature floating bob ── */
@keyframes feature-bob {
  0%, 100% { transform: translateY(0px);  }
  50%       { transform: translateY(-7px); }
}
.feature-bob-inner {
  animation: feature-bob var(--bob-dur, 2.6s) ease-in-out var(--bob-delay, 0s) infinite;
}
/* ── Golden power-up surge ── */
@keyframes gold-surge {
  0%   { opacity: 0; box-shadow: none; }
  20%  { opacity: 1; box-shadow:
           0 0 40px  8px  rgba(244,201,106,0.60),
           0 0 90px  24px rgba(244,201,106,0.30); }
  55%  { box-shadow:
           0 0 70px  18px rgba(244,201,106,0.90),
           0 0 140px 50px rgba(244,201,106,0.50),
           0 0 240px 80px rgba(244,201,106,0.18); }
  100% { opacity: 1; box-shadow:
           0 0 45px  10px rgba(244,201,106,0.55),
           0 0 110px 30px rgba(244,201,106,0.25),
           0 0 180px 55px rgba(244,201,106,0.10); }
}
/* ── Steady heartbeat after surge ── */
@keyframes gold-pulse {
  0%, 100% { box-shadow:
               0 0 45px  10px rgba(244,201,106,0.55),
               0 0 110px 30px rgba(244,201,106,0.25); }
  50%       { box-shadow:
               0 0 65px  16px rgba(244,201,106,0.75),
               0 0 150px 45px rgba(244,201,106,0.38),
               0 0 220px 70px rgba(244,201,106,0.14); }
}
/* ── Burst rings expand & fade ── */
@keyframes ring-burst-a {
  0%   { transform: scale(1);   opacity: 0.80; }
  100% { transform: scale(3.8); opacity: 0; }
}
@keyframes ring-burst-b {
  0%   { transform: scale(1);   opacity: 0.50; }
  100% { transform: scale(5.5); opacity: 0; }
}
/* ── Applied via class ── */
.orbit-powered .orbit-glow {
  animation:
    gold-surge 1.4s cubic-bezier(0.22,1,0.36,1) forwards,
    gold-pulse 2.8s ease-in-out 1.4s infinite;
}
.orbit-powered .burst-a {
  animation: ring-burst-a 1.0s cubic-bezier(0.22,1,0.36,1) 0.05s forwards;
}
.orbit-powered .burst-b {
  animation: ring-burst-b 1.3s cubic-bezier(0.22,1,0.36,1) 0.20s forwards;
}
`;

function FeatureGrid() {
  const sectionRef  = useRef(null);
  const iconWrapRef = useRef(null);  // receives .orbit-powered
  const iconDropRef = useRef(null);  // receives .icon-dropping
  const titleRef    = useRef(null);
  const leftRefs    = useRef([]);
  const rightRefs   = useRef([]);
  const powered     = useRef(false);
  const landed      = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;

    /* ── Start everything hidden ── */
    leftRefs.current.forEach((el, i) => {
      if (!el) return;
      const { x, y } = POSITIONS_LEFT[i];
      el.style.transition = 'none';
      el.style.transform  = `translateX(${x - 80}px) translateY(${y}px) scale(0)`;
      el.style.opacity    = '0';
    });
    rightRefs.current.forEach((el, i) => {
      if (!el) return;
      const { x, y } = POSITIONS_RIGHT[i];
      el.style.transition = 'none';
      el.style.transform  = `translateX(${x + 80}px) translateY(${y}px) scale(0)`;
      el.style.opacity    = '0';
    });

    /* ── IntersectionObserver: drop icon then fly features in ── */
    const flyIn = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      flyIn.disconnect();

      /* 1. Drop icon */
      if (iconDropRef.current) iconDropRef.current.classList.add('icon-dropping');

      /* 2. After icon lands (~950ms), fly features in from left/right */
      const allRefs = [
        ...leftRefs.current.map((el, i) => ({ el, pos: POSITIONS_LEFT[i], side: 'L' })),
        ...rightRefs.current.map((el, i) => ({ el, pos: POSITIONS_RIGHT[i], side: 'R' })),
      ];
      allRefs.forEach(({ el, pos, side }, idx) => {
        if (!el) return;
        setTimeout(() => {
          el.style.transition = 'transform 0.65s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease';
          el.style.transform  = `translateX(${pos.x}px) translateY(${pos.y}px) scale(1)`;
          el.style.opacity    = '1';
        }, 980 + idx * 45);
      });

      /* 3. Once all landed, strip transitions so scroll handler drives cleanly */
      const totalDelay = 980 + allRefs.length * 45 + 800;
      setTimeout(() => {
        landed.current = true;
        [...leftRefs.current, ...rightRefs.current].forEach(el => {
          if (el) el.style.transition = 'none';
        });
      }, totalDelay);
    }, { threshold: 0.06 });

    flyIn.observe(section);

    const onScroll = () => {
      const rect        = section.getBoundingClientRect();
      const totalScroll = Math.max(1, section.offsetHeight - window.innerHeight);
      const p           = Math.min(1, Math.max(0, -rect.top) / totalScroll);

      /* Fade title */
      if (titleRef.current) {
        const op = Math.max(0, 1 - p / 0.12);
        titleRef.current.style.opacity   = op.toFixed(3);
        titleRef.current.style.transform = `translateY(${((1 - op) * -18).toFixed(1)}px)`;
      }

      /* Scroll animation + collapse (only after landing) */
      if (landed.current) {
        // Breathe-in: features drift toward icon as scroll increases (before collapse)
        const breathe = Math.min(1, p / 0.28) * 26; // up to 26px inward over first 28% scroll
        const NAll = NL + NR;

        leftRefs.current.forEach((el, i) => {
          if (!el) return;
          const { x, y } = POSITIONS_LEFT[i];
          const thresh = 0.18 + (i / NAll) * 0.58;
          const fp     = Math.max(0, Math.min(1, (p - thresh) / 0.11));

          if (fp > 0) {
            // Collapse phase — converge to icon
            el.style.transform = `translateX(${(x * (1 - fp)).toFixed(1)}px) translateY(${(y * (1 - fp)).toFixed(1)}px) scale(${Math.max(0.001, 1 - fp).toFixed(3)})`;
            el.style.opacity   = Math.max(0, 1 - fp * 1.4).toFixed(3);
          } else {
            // Idle phase — gentle wave + breathe toward icon
            const wave = Math.sin(p * Math.PI * 5 + i * 0.65) * 5;
            const bx   = x + breathe; // move closer (left features have negative x so +breathe = inward)
            el.style.transform = `translateX(${bx.toFixed(1)}px) translateY(${(y + wave).toFixed(1)}px) scale(1)`;
            el.style.opacity   = '1';
          }
        });

        rightRefs.current.forEach((el, i) => {
          if (!el) return;
          const { x, y } = POSITIONS_RIGHT[i];
          const thresh = 0.22 + (i / NAll) * 0.56;
          const fp     = Math.max(0, Math.min(1, (p - thresh) / 0.11));

          if (fp > 0) {
            el.style.transform = `translateX(${(x * (1 - fp)).toFixed(1)}px) translateY(${(y * (1 - fp)).toFixed(1)}px) scale(${Math.max(0.001, 1 - fp).toFixed(3)})`;
            el.style.opacity   = Math.max(0, 1 - fp * 1.4).toFixed(3);
          } else {
            const wave = Math.sin(p * Math.PI * 5 + i * 0.65 + Math.PI) * 5; // opposite phase from left
            const bx   = x - breathe; // move closer (right features have positive x so -breathe = inward)
            el.style.transform = `translateX(${bx.toFixed(1)}px) translateY(${(y + wave).toFixed(1)}px) scale(1)`;
            el.style.opacity   = '1';
          }
        });
      }

      /* Golden power-up */
      if (p >= 0.96 && !powered.current) {
        powered.current = true;
        iconWrapRef.current?.classList.add('orbit-powered');
      }
      if (p < 0.88 && powered.current) {
        powered.current = false;
        iconWrapRef.current?.classList.remove('orbit-powered');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); flyIn.disconnect(); };
  }, []);

  const renderFeature = (f, i, side, refs) => {
    const pos    = side === 'L' ? POSITIONS_LEFT[i] : POSITIONS_RIGHT[i];
    const isLeft = side === 'L';
    return (
      <div
        key={`${side}-${i}`}
        ref={el => (refs.current[i] = el)}
        style={{
          position:   'absolute', top: '50%', left: '50%',
          /* outer div is exactly badge-sized so the transform anchors to the badge centre */
          width: 44, height: 44,
          marginLeft: -22, marginTop: -22,
          zIndex: 5, willChange: 'transform, opacity',
          transform: `translateX(${pos.x}px) translateY(${pos.y}px) scale(0)`,
          opacity: 0,
        }}
      >
        <div
          className="feature-bob-inner"
          style={{
            '--bob-dur':   `${2.2 + (i % 5) * 0.3}s`,
            '--bob-delay': `${((i * 0.22) % 1.4).toFixed(2)}s`,
            position: 'relative', width: 44, height: 44,
          }}
        >
          {/* Badge — always at 0,0 of this div */}
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: f.bg,
            border: '1px solid rgba(255,255,255,0.09)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>
            <span style={{ color: f.col }}>{Ic[f.icon]}</span>
          </div>

          {/* Label — absolutely placed OUTSIDE the badge, away from icon */}
          <span style={{
            position: 'absolute',
            top: '50%', transform: 'translateY(-50%)',
            ...(isLeft
              ? { right: '100%', marginRight: 10, textAlign: 'right' }
              : { left:  '100%', marginLeft:  10, textAlign: 'left'  }),
            fontFamily:    'Archivo, sans-serif',
            fontSize:      9, letterSpacing: '0.10em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.38)',
            whiteSpace:    'nowrap',
          }}>{f.name}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{ORBIT_CSS}</style>
      <section ref={sectionRef} style={{ height: '320vh', position: 'relative' }}>
        <div style={{
          position: 'sticky', top: 0,
          height: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Title */}
          <div ref={titleRef} style={{
            position: 'absolute', top: 40, left: 0, right: 0,
            textAlign: 'center', zIndex: 20, willChange: 'opacity, transform',
          }}>
            <p style={{
              fontFamily: 'Archivo, sans-serif', fontSize: '0.62rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(160,200,255,0.5)', marginBottom: 14,
              textShadow: '0 0 24px rgba(10,10,10,0.9)',
            }}>Everything you need</p>
            <h2 style={{
              fontFamily: 'Archivo, sans-serif', fontWeight: 300,
              fontSize: 'clamp(1.6rem,3vw,2.4rem)',
              color: '#F0EBE0', letterSpacing: '-0.03em', lineHeight: 1.15,
              textShadow: '0 0 40px rgba(10,10,10,1)',
            }}>
              Built for how you actually<br />use email.
            </h2>
          </div>

          {/* Scene */}
          <div style={{ position: 'relative', width: 760, height: 660, flexShrink: 0 }}>

            {/* Left features */}
            {FEATURES_LEFT.map((f, i) => renderFeature(f, i, 'L', leftRefs))}

            {/* Right features */}
            {FEATURES_RIGHT.map((f, i) => renderFeature(f, i, 'R', rightRefs))}

            {/* Icon — drops from top */}
            <div ref={iconWrapRef} style={{
              position: 'absolute', top: '50%', left: '50%',
              marginLeft: -(ICON_SIZE / 2), marginTop: -(ICON_SIZE / 2),
              zIndex: 10,
            }}>
              {/* Glow */}
              <div className="orbit-glow" style={{
                position: 'absolute', inset: -28,
                borderRadius: ICON_RADIUS + 28, opacity: 0, pointerEvents: 'none',
              }} />
              {/* Burst A */}
              <div className="burst-a" style={{
                position: 'absolute', top: '50%', left: '50%',
                width: ICON_SIZE, height: ICON_SIZE,
                marginLeft: -(ICON_SIZE / 2), marginTop: -(ICON_SIZE / 2),
                borderRadius: ICON_RADIUS,
                border: '1.5px solid rgba(244,201,106,0.75)',
                opacity: 0, pointerEvents: 'none',
              }} />
              {/* Burst B */}
              <div className="burst-b" style={{
                position: 'absolute', top: '50%', left: '50%',
                width: ICON_SIZE, height: ICON_SIZE,
                marginLeft: -(ICON_SIZE / 2), marginTop: -(ICON_SIZE / 2),
                borderRadius: ICON_RADIUS,
                border: '1px solid rgba(244,201,106,0.40)',
                opacity: 0, pointerEvents: 'none',
              }} />
              {/* Icon with drop animation target */}
              <div ref={iconDropRef} style={{ opacity: 0 }}>
                <AppIcon size={ICON_SIZE} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   AI FEATURE DETAIL SECTIONS
───────────────────────────────────────────────────────────── */
function AITriageMockup() {
  const rows = [
    { tag: 'URGENT',     col: 'rgba(244,201,106,0.85)', bg: 'rgba(244,201,106,0.08)', from: 'Alex Chen',  subj: 'Q4 deck — need by 3pm', ai: 'Action needed today' },
    { tag: 'RESPOND',    col: 'rgba(160,200,255,0.85)', bg: 'rgba(160,200,255,0.07)', from: 'Sarah K.',   subj: 'Catch-up this week?',   ai: 'Awaiting your reply' },
    { tag: 'FYI',        col: 'rgba(200,180,255,0.7)',  bg: 'rgba(200,180,255,0.05)', from: 'GitHub',     subj: 'PR #42 merged',         ai: 'No action required'  },
    { tag: 'NEWSLETTER', col: 'rgba(255,255,255,0.25)', bg: 'rgba(255,255,255,0.03)', from: 'Medium',     subj: 'Top stories for you',   ai: 'Auto-archived'       },
  ];
  return (
    <div style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {['rgba(255,90,80,0.7)', 'rgba(255,190,0,0.7)', 'rgba(40,205,65,0.7)'].map((c, i) => (
          <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em', marginLeft: 8 }}>Aero Triage · 4 categories</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(120,220,120,0.9)', boxShadow: '0 0 5px rgba(120,220,120,0.5)' }} />
          <span style={{ fontSize: 9, color: 'rgba(120,220,120,0.7)', letterSpacing: '0.06em' }}>AI ACTIVE</span>
        </div>
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 18px', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
          <span style={{ fontSize: 8, fontFamily: 'Archivo, sans-serif', letterSpacing: '0.1em', padding: '2px 7px', borderRadius: 4, background: r.bg, color: r.col, border: `1px solid ${r.col.replace('0.85', '0.2').replace('0.25', '0.1')}`, flexShrink: 0 }}>{r.tag}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'Archivo, sans-serif', marginBottom: 2 }}>{r.from}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.subj}</div>
          </div>
          <span style={{ fontSize: 9, color: r.col, fontFamily: 'Space Grotesk, sans-serif', opacity: 0.8, flexShrink: 0 }}>{r.ai}</span>
        </div>
      ))}
    </div>
  );
}

function AISummaryMockup() {
  return (
    <div style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(160,200,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'rgba(160,200,255,0.8)' }}>{Ic.star}</span>
        </div>
        <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, color: 'rgba(160,200,255,0.7)', letterSpacing: '0.08em' }}>AERO SUMMARY</span>
      </div>
      <div style={{ background: 'rgba(160,200,255,0.06)', border: '1px solid rgba(160,200,255,0.15)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontFamily: 'Space Grotesk, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>
        "Alex confirms Thursday 3pm — needs slide 4 updated before the call. No other action items."
      </div>
      <div style={{ opacity: 0.35 }}>
        {['Hey, just wanted to follow up on the deck...', 'Can you make sure slide 4 has the updated...', '...let me know if you need anything else before Thursday.'].map((line, i) => (
          <div key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'Space Grotesk, sans-serif', padding: '6px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>{line}</div>
        ))}
      </div>
    </div>
  );
}

function AIDraftMockup() {
  const drafts = [
    { label: 'Formal',  col: 'rgba(160,200,255,0.8)', text: "Thank you for the update. I'll have slide 4 revised and sent over before 3pm Thursday." },
    { label: 'Casual',  col: 'rgba(200,180,255,0.8)', text: "Got it! I'll get slide 4 sorted before Thursday — talk then." },
    { label: 'Brief',   col: 'rgba(244,201,106,0.8)', text: 'On it. See you Thursday.' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {drafts.map((d, i) => (
        <div key={i} style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: d.col }}>{d.label}</span>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontFamily: 'Space Grotesk, sans-serif' }}>Tap to use</span>
          </div>
          <p style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{d.text}</p>
        </div>
      ))}
    </div>
  );
}

function DigestMockup() {
  return (
    <div style={{ background: 'rgba(255,255,255,0.022)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 16, marginBottom: 18 }}>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 10, color: 'rgba(244,201,106,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Good morning — Mon 24 Apr</div>
        <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 18, fontWeight: 300, color: '#F0EBE0', marginBottom: 4 }}>Your inbox, briefed.</div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          {[['4', 'Priority'], ['12', 'New'], ['3', 'To Reply']].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 20, fontWeight: 300, color: 'rgba(244,201,106,0.9)' }}>{n}</div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {[
        { ini: 'AC', name: 'Alex Chen', note: 'Needs slide 4 before Thursday 3pm call' },
        { ini: 'M',  name: 'Mum',       note: "Asking if you're coming Sunday at 6pm"  },
        { ini: 'N',  name: 'Notion',    note: '4 workspace pages updated this week'     },
      ].map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(160,200,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 9, color: 'rgba(160,200,255,0.7)', fontFamily: 'Archivo, sans-serif' }}>{r.ini}</span>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'Archivo, sans-serif', marginBottom: 2 }}>{r.name}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'Space Grotesk, sans-serif' }}>{r.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LlamaMockup() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: 'rgba(244,201,106,0.05)', border: '1px solid rgba(244,201,106,0.18)', borderRadius: 14, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(244,201,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(244,201,106,0.9)' }}>{Ic.bot}</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Archivo, sans-serif', fontSize: 11, color: 'rgba(244,201,106,0.85)', letterSpacing: '0.06em' }}>Llama 3.2 · 3B params</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>Running on-device · Neural Engine</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(120,220,120,0.9)', boxShadow: '0 0 5px rgba(120,220,120,0.5)' }} />
            <span style={{ fontSize: 9, color: 'rgba(120,220,120,0.7)', letterSpacing: '0.05em' }}>ACTIVE</span>
          </div>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
          <div style={{ height: '100%', width: '73%', background: 'linear-gradient(90deg, rgba(244,201,106,0.6), rgba(244,201,106,0.9))', borderRadius: 2 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>Processing email thread…</span>
          <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: 9, color: 'rgba(244,201,106,0.6)' }}>73%</span>
        </div>
      </div>
      {[
        { icon: 'shield', label: 'Zero network calls', col: 'rgba(120,220,120,0.8)' },
        { icon: 'phone',  label: 'Runs fully offline',  col: 'rgba(160,200,255,0.8)' },
        { icon: 'zap',    label: 'No OpenAI / Claude subscriptions', col: 'rgba(244,201,106,0.8)' },
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: 'rgba(255,255,255,0.018)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
          <span style={{ color: item.col }}>{Ic[item.icon]}</span>
          <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

const AI_SECTIONS = [
  {
    num: '01', label: 'AI Inbox Triage',
    title: 'Your inbox, ranked\nby what matters.',
    body: 'Aero reads every email and assigns it a priority — Urgent, Respond, FYI, or Newsletter. The most important messages are always at the top, the rest quietly filed away. No rules to write, no folders to manage. Aero figures it out.',
    stats: [['4 categories', 'Urgent · Respond · FYI · Archive'], ['<200ms', 'Sort time per email'], ['Learns', 'Adapts to your behaviour']],
    Visual: AITriageMockup,
  },
  {
    num: '02', label: 'Smart Summaries',
    title: 'Know what every\nemail says in one line.',
    body: 'Open any email and Aero has already read it for you. A single-sentence summary tells you exactly what’s in it — no skimming, no scrolling. Works in 40+ languages, entirely offline, in under half a second.',
    stats: [['1 sentence', 'Per email thread'], ['40+ languages', 'Supported'], ['On-device', 'Zero latency, fully private']],
    Visual: AISummaryMockup,
  },
  {
    num: '03', label: 'AI Draft Replies',
    title: 'Three replies, ready\nbefore you even ask.',
    body: 'Aero drafts three contextually-aware responses for every email — Formal, Casual, and Brief. Each one is written in your tone, using your vocabulary. Pick the closest, tweak it, send it. Most replies take under 15 seconds.',
    stats: [['3 options', 'Every time'], ['Your tone', 'Learns from your sent history'], ['15 sec', 'Average reply time']],
    Visual: AIDraftMockup,
  },
  {
    num: '04', label: 'Daily Digest',
    title: 'Your morning briefing,\nprivately prepared.',
    body: 'Every morning at a time you choose, Aero generates a private digest of your entire inbox — priorities, threads that need replies, and everything you missed. Read it in under 90 seconds. Start your day with clarity, not chaos.',
    stats: [['90 sec', 'Average read time'], ['7am default', 'Fully configurable'], ['100% local', 'Never leaves your device']],
    Visual: DigestMockup,
  },
  {
    num: '05', label: 'Powered by Llama',
    title: 'State-of-the-art AI.\nZero cloud. Zero cost.',
    body: 'Aero runs Llama 3.2 directly on your iPhone’s Neural Engine or Mac’s Apple Silicon — no subscriptions to OpenAI, Claude, or Gemini. The model never leaves your device, so your emails stay completely private. Works in airplane mode.',
    stats: [['Llama 3.2', 'Open-source model'], ['Apple Silicon', 'Optimised for Neural Engine'], ['$0 / month', 'No AI service subscription']],
    Visual: LlamaMockup,
  },
];

/* Accent colour per section */
const SEC_ACCENTS = [
  'rgba(244,201,106,',   // 01 triage  — gold
  'rgba(160,200,255,',   // 02 summary — blue
  'rgba(200,180,255,',   // 03 drafts  — purple
  'rgba(244,201,106,',   // 04 digest  — gold
  'rgba(120,220,140,',   // 05 llama   — green
];

/* ─────────────────────────────────────────────────────────────
   FLOATING CARD — reusable 3D tilt · shimmer · anti-gravity
   Used by both AI feature mockups and pricing cards
───────────────────────────────────────────────────────────── */
function FloatingCard({ children, accent = 'rgba(160,200,255,', floatDelay = 0, floatDur = 6.4 }) {
  const cardRef    = useRef(null);
  const shimmerRef = useRef(null);
  const glowRef    = useRef(null);
  const isHov      = useRef(false);

  const onEnter = () => {
    isHov.current = true;
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1)';
      cardRef.current.style.transform  = 'perspective(1000px) translateY(-12px) scale(1.018) rotateX(0deg) rotateY(0deg)';
    }
    if (glowRef.current) {
      glowRef.current.style.opacity    = '1';
      glowRef.current.style.transition = 'opacity 0.4s ease';
    }
    /* shimmer sweep */
    if (shimmerRef.current) {
      shimmerRef.current.style.transition = 'none';
      shimmerRef.current.style.transform  = 'translateX(-140%)';
      shimmerRef.current.style.opacity    = '1';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (shimmerRef.current) {
          shimmerRef.current.style.transition = 'transform 0.72s ease';
          shimmerRef.current.style.transform  = 'translateX(240%)';
        }
      }));
    }
  };

  const onMove = (e) => {
    if (!cardRef.current || !isHov.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mx   = (e.clientX - rect.left)  / rect.width  - 0.5;
    const my   = (e.clientY - rect.top)   / rect.height - 0.5;
    cardRef.current.style.transition = 'transform 0.07s linear';
    cardRef.current.style.transform  =
      `perspective(1000px) translateY(-12px) scale(1.018) rotateX(${(-my * 13).toFixed(2)}deg) rotateY(${(mx * 11).toFixed(2)}deg)`;
  };

  const onLeave = () => {
    isHov.current = false;
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
      cardRef.current.style.transform  = 'perspective(1000px) translateY(0px) scale(1) rotateX(0deg) rotateY(0deg)';
    }
    if (glowRef.current) {
      glowRef.current.style.opacity    = '0';
      glowRef.current.style.transition = 'opacity 0.5s ease';
    }
    if (shimmerRef.current) {
      shimmerRef.current.style.transition = 'none';
      shimmerRef.current.style.transform  = 'translateX(-140%)';
      shimmerRef.current.style.opacity    = '0';
    }
  };

  return (
    <div style={{ animation: `card-float ${floatDur}s ease-in-out infinite ${floatDelay}s` }}>
      <div
        ref={cardRef}
        onMouseEnter={onEnter}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ position: 'relative', willChange: 'transform', transformStyle: 'preserve-3d' }}
      >
        {/* Shimmer */}
        <div ref={shimmerRef} style={{
          position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none',
          borderRadius: 'inherit',
          background: 'linear-gradient(108deg, transparent 22%, rgba(255,255,255,0.08) 50%, transparent 78%)',
          transform: 'translateX(-140%)',
          opacity: 0,
        }} />
        {/* Corner glow */}
        <div ref={glowRef} style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          opacity: 0,
          background: `radial-gradient(ellipse 80% 45% at 50% 0%, ${accent}0.12), transparent 70%)`,
        }} />
        {children}
      </div>
    </div>
  );
}

function AIFeatureCopy({ sec, accent }) {
  return (
    <div>
      {/* Feature pill */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '5px 14px', borderRadius: 999, marginBottom: 28,
        background: `${accent}0.06)`,
        border:     `1px solid ${accent}0.22)`,
      }}>
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: `${accent}0.9)`, boxShadow: `0 0 6px ${accent}0.5)` }} />
        <span style={{ fontFamily: 'Archivo, sans-serif', fontSize: '0.58rem', letterSpacing: '0.16em', color: `${accent}0.75)`, textTransform: 'uppercase' }}>
          {sec.num} — {sec.label}
        </span>
      </div>

      <WordReveal
        className="ev-h2"
        style={{
          fontFamily: 'Archivo, sans-serif', fontWeight: 300,
          fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
          color: '#F0EBE0', letterSpacing: '-0.035em', lineHeight: 1.15,
          marginBottom: 24,
        }}
      >{sec.title}</WordReveal>

      <p style={{
        fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.92rem',
        color: 'rgba(255,255,255,0.42)', lineHeight: 1.9,
        marginBottom: 40, maxWidth: 440,
      }}>{sec.body}</p>

      {/* Stats — hover: value scales + border glows */}
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
        {sec.stats.map(([val, lbl]) => (
          <div
            key={val}
            style={{ borderLeft: `2px solid ${accent}0.28)`, paddingLeft: 16, transition: 'border-color 0.3s ease' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderLeftColor = `${accent}0.75)`;
              const v = e.currentTarget.querySelector('.stat-val');
              if (v) { v.style.transform = 'scale(1.1) translateY(-2px)'; v.style.color = `${accent}1)`; }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderLeftColor = `${accent}0.28)`;
              const v = e.currentTarget.querySelector('.stat-val');
              if (v) { v.style.transform = ''; v.style.color = `${accent}0.9)`; }
            }}
          >
            <div className="stat-val" style={{
              fontFamily: 'Archivo, sans-serif', fontSize: '1.15rem', fontWeight: 300,
              color: `${accent}0.9)`, marginBottom: 4,
              transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), color 0.3s ease',
              transformOrigin: 'left center', display: 'inline-block',
            }}>{val}</div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em' }}>{lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIFeatureItem({ sec, idx }) {
  const ref     = useFadeUp();
  const reverse = idx % 2 === 1;
  const accent  = SEC_ACCENTS[idx] || SEC_ACCENTS[0];

  const VisualPanel = (
    <FloatingCard accent={accent} floatDelay={idx * 0.6} floatDur={6 + idx * 0.5}>
      <sec.Visual />
    </FloatingCard>
  );

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '100px 0',
    }}>
      {/* Ambient radial wash */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 55% 60% at ${reverse ? '72%' : '28%'} 50%, ${accent}0.055), transparent 70%)`,
      }} />

      {/* Giant watermark number */}
      <div style={{
        position: 'absolute', zIndex: 0, pointerEvents: 'none',
        fontSize: 'clamp(180px, 26vw, 320px)',
        fontFamily: 'Archivo, sans-serif', fontWeight: 700,
        color: 'rgba(255,255,255,0.025)',
        top: '50%', transform: 'translateY(-50%)',
        ...(reverse ? { left: '-1vw' } : { right: '-1vw' }),
        lineHeight: 1, letterSpacing: '-0.06em',
        userSelect: 'none',
      }}>{sec.num}</div>

      {/* Content */}
      <div style={{ ...C, maxWidth: 1060, position: 'relative', zIndex: 1, width: '100%' }}>
        <div ref={ref} className="ev-fade" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 80, alignItems: 'center',
        }}>
          {!reverse ? (
            <>
              <AIFeatureCopy sec={sec} accent={accent} />
              {VisualPanel}
            </>
          ) : (
            <>
              {VisualPanel}
              <AIFeatureCopy sec={sec} accent={accent} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function AIFeatures() {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {AI_SECTIONS.map((sec, idx) => (
        <AIFeatureItem key={sec.num} sec={sec} idx={idx} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   PRICING CARD — 3D tilt · shimmer · anti-gravity float · glow
───────────────────────────────────────────────────────────── */
function PricingCard({ p, i }) {
  const fadeRef    = useFadeUp();
  const cardRef    = useRef(null);      // receives direct DOM transforms
  const shimmerRef = useRef(null);
  const priceRef   = useRef(null);
  const glowRef    = useRef(null);
  const isHovered  = useRef(false);
  const [hovered, setHovered] = useState(false); // drives border/shadow via React

  /* ── Mouse enter: lift + shimmer + glow pulse ── */
  const handleEnter = (e) => {
    isHovered.current = true;
    setHovered(true);

    /* Lift — drives base transform; tilt applied on top in handleMove */
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.38s cubic-bezier(0.34,1.56,0.64,1)';
      cardRef.current.style.transform  = 'perspective(900px) translateY(-14px) scale(1.022) rotateX(0deg) rotateY(0deg)';
    }
    /* Price pop */
    if (priceRef.current) {
      priceRef.current.style.transition = 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), color 0.3s ease';
      priceRef.current.style.transform  = 'scale(1.08)';
      priceRef.current.style.color      = p.featured ? '#F4C96A' : '#ffffff';
    }
    /* Shimmer sweep */
    if (shimmerRef.current) {
      shimmerRef.current.style.transition = 'none';
      shimmerRef.current.style.transform  = 'translateX(-140%)';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (shimmerRef.current) {
          shimmerRef.current.style.transition = 'transform 0.7s ease';
          shimmerRef.current.style.transform  = 'translateX(240%)';
        }
      }));
    }
    /* Ambient glow pulse */
    if (glowRef.current) {
      glowRef.current.style.opacity    = '1';
      glowRef.current.style.transition = 'opacity 0.4s ease';
    }
  };

  /* ── Mouse move: 3-D tilt following cursor ── */
  const handleMove = (e) => {
    if (!cardRef.current || !isHovered.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mx   = (e.clientX - rect.left)  / rect.width  - 0.5;   // -0.5 … +0.5
    const my   = (e.clientY - rect.top)   / rect.height - 0.5;
    const rx   = -my * 14;   // tilt up/down
    const ry   =  mx * 12;   // tilt left/right
    cardRef.current.style.transition = 'transform 0.08s linear';
    cardRef.current.style.transform  =
      `perspective(900px) translateY(-14px) scale(1.022) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  /* ── Mouse leave: snap back to float baseline ── */
  const handleLeave = () => {
    isHovered.current = false;
    setHovered(false);

    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1)';
      cardRef.current.style.transform  = 'perspective(900px) translateY(0px) scale(1) rotateX(0deg) rotateY(0deg)';
    }
    if (priceRef.current) {
      priceRef.current.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), color 0.35s ease';
      priceRef.current.style.transform  = 'scale(1)';
      priceRef.current.style.color      = '#F0EBE0';
    }
    if (shimmerRef.current) {
      shimmerRef.current.style.transition = 'none';
      shimmerRef.current.style.transform  = 'translateX(-140%)';
    }
    if (glowRef.current) {
      glowRef.current.style.opacity    = '0';
      glowRef.current.style.transition = 'opacity 0.5s ease';
    }
  };

  const accentCol = p.featured ? 'rgba(244,201,106,' : 'rgba(160,200,255,';
  const borderCol = p.featured
    ? (hovered ? 'rgba(244,201,106,0.6)' : 'rgba(244,201,106,0.25)')
    : (hovered ? 'rgba(160,200,255,0.22)' : 'rgba(255,255,255,0.07)');
  const shadowVal = p.featured
    ? (hovered
        ? '0 0 100px rgba(244,201,106,0.22), 0 32px 80px rgba(0,0,0,0.6)'
        : '0 0 60px rgba(244,201,106,0.06)')
    : (hovered
        ? '0 0 60px rgba(160,200,255,0.10), 0 32px 80px rgba(0,0,0,0.55)'
        : 'none');

  return (
    /* Float wrapper — anti-gravity bob; independent from hover transform */
    <div style={{ animation: `card-float ${6.2 + i * 0.8}s ease-in-out infinite ${i * 1.1}s` }}>
      {/* Fade-up entrance with stagger */}
      <div ref={fadeRef} className="ev-fade" style={{ transitionDelay: `${i * 0.15}s`, height: '100%' }}>
        {/* Tilt / lift target */}
        <div
          ref={cardRef}
          onMouseEnter={handleEnter}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          style={{
            position: 'relative', overflow: 'hidden',
            background: p.featured ? 'rgba(244,201,106,0.04)' : 'rgba(255,255,255,0.018)',
            border:     `1px solid ${borderCol}`,
            boxShadow:  shadowVal,
            borderRadius: 16, padding: '32px 28px',
            display: 'flex', flexDirection: 'column', height: '100%',
            transition: 'border-color 0.3s ease, box-shadow 0.35s ease',
            willChange: 'transform',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Shimmer sweep */}
          <div ref={shimmerRef} style={{
            position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
            background: 'linear-gradient(108deg, transparent 22%, rgba(255,255,255,0.09) 50%, transparent 78%)',
            transform: 'translateX(-140%)',
          }} />

          {/* Ambient corner glow (hidden until hover) */}
          <div ref={glowRef} style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
            opacity: 0,
            background: p.featured
              ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(244,201,106,0.12), transparent 70%)'
              : 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(160,200,255,0.09), transparent 70%)',
          }} />

          {p.featured && (
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(244,201,106,0.75)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#F4C96A', boxShadow: '0 0 7px rgba(244,201,106,0.7)', animation: 'card-dot-pulse 2s ease-in-out infinite' }} />
              Most popular
            </div>
          )}

          <p style={{ fontFamily: 'Archivo, sans-serif', fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 16, position: 'relative', zIndex: 1 }}>{p.name}</p>

          <div ref={priceRef} style={{ fontFamily: 'Archivo, sans-serif', fontSize: '2.8rem', fontWeight: 300, color: '#F0EBE0', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4, transformOrigin: 'left center', position: 'relative', zIndex: 1 }}>{p.amount}</div>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: 24, letterSpacing: '0.03em', fontFamily: 'Space Grotesk, sans-serif', position: 'relative', zIndex: 1 }}>{p.period}</p>

          <div style={{ height: 1, background: `linear-gradient(90deg, ${accentCol}0.18), transparent)`, marginBottom: 20, position: 'relative', zIndex: 1 }} />

          <div style={{ flex: 1, marginBottom: 24, position: 'relative', zIndex: 1 }}>
            {p.items.map((item, j) => (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                  background: p.featured ? '#F4C96A' : `${accentCol}0.6)`,
                  boxShadow: p.featured ? '0 0 6px rgba(244,201,106,0.5)' : `0 0 5px ${accentCol}0.3)`,
                }} />
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'Space Grotesk, sans-serif' }}>{item}</span>
              </div>
            ))}
          </div>

          <button
            style={{
              position: 'relative', zIndex: 1,
              width: '100%', padding: '13px 0', borderRadius: 9999, cursor: 'pointer',
              fontFamily: 'Archivo, sans-serif', fontSize: '0.82rem', fontWeight: p.featured ? 600 : 400,
              letterSpacing: '0.05em',
              border: p.featured ? 'none' : `1px solid ${accentCol}0.18)`,
              background: p.featured ? '#F4C96A' : 'transparent',
              color: p.featured ? '#0A0A0A' : `${accentCol}0.7)`,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform  = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow  = p.featured
                ? '0 8px 24px rgba(244,201,106,0.35)'
                : `0 6px 20px ${accentCol}0.2)`;
              e.currentTarget.style.background = p.featured ? '#f7d47a' : `${accentCol}0.06)`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform  = '';
              e.currentTarget.style.boxShadow  = '';
              e.currentTarget.style.background = p.featured ? '#F4C96A' : 'transparent';
            }}
          >
            {p.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

function Pricing() {
  const headerRef = useFadeUp();
  return (
    <section style={{ padding: '100px 0' }}>
      <div style={C}>
        <div ref={headerRef} className="ev-fade" style={{ marginBottom: 48 }}>
          <Overline>Pricing</Overline>
          <WordReveal
            className="ev-h2"
            style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 300, fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#F0EBE0', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.2 }}
          >{"Simple, honest pricing."}</WordReveal>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'Space Grotesk, sans-serif' }}>No subscriptions to AI services. No hidden fees.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, alignItems: 'stretch' }}>
          {PRICING.map((p, i) => (
            <PricingCard key={i} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCTA() {
  const [email, setEmail]      = useState('');
  const [submitted, setSubmit] = useState(false);

  return (
    <section style={{ padding: '100px 0', textAlign: 'center' }}>
      <div style={{ ...C, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FadeBox style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <Overline center>Early access</Overline>
          <WordReveal
            className="ev-h2"
            style={{ fontFamily: 'Archivo, sans-serif', fontWeight: 300, fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#F0EBE0', letterSpacing: '-0.03em', lineHeight: 1.2, maxWidth: 500, marginBottom: 16 }}
          >{"Your inbox, your rules."}</WordReveal>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.8, maxWidth: 380, marginBottom: 28, fontFamily: 'Space Grotesk, sans-serif' }}>
            Join the waitlist. Be first to try Aero Mail when it launches.
          </p>
          {submitted ? (
            <p style={{ fontSize: '0.85rem', color: 'rgba(120,220,120,0.8)' }}>✓ You're on the list.</p>
          ) : (
            <div style={{ display: 'flex', gap: 10, maxWidth: 420, width: '100%' }}>
              <input
                type="email" placeholder="your@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={{ flex: 1, padding: '11px 18px', borderRadius: 9999, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#F0EBE0', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.82rem', outline: 'none' }}
              />
              <button onClick={() => email && setSubmit(true)} style={{ padding: '11px 24px', borderRadius: 9999, border: 'none', background: '#F4C96A', color: '#0A0A0A', fontFamily: 'Archivo, sans-serif', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.04em', cursor: 'pointer' }}>
                Join waitlist ↗
              </button>
            </div>
          )}
        </FadeBox>
      </div>
    </section>
  );
}

function EmailFooter() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ ...C, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, paddingBottom: 24 }}>
        <span style={{ fontSize: '0.75rem', color: '#8A8070', fontFamily: 'Space Grotesk, sans-serif' }}>© 2026 Sabharwal Ventures</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Twitter', 'LinkedIn'].map(l => (
            <a key={l} href="#" style={{ fontSize: '0.75rem', color: '#8A8070', textDecoration: 'none', transition: 'color 150ms', fontFamily: 'Space Grotesk, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.color = '#F0EBE0'}
              onMouseLeave={e => e.currentTarget.style.color = '#8A8070'}
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────
   CSS
───────────────────────────────────────────────────────────── */
const EMAIL_CSS = `
.email-progress {
  position: fixed; top: 0; left: 0; height: 2px; z-index: 60;
  background: linear-gradient(90deg, rgba(244,201,106,0.7), rgba(160,200,255,0.5));
  pointer-events: none; width: 0%;
}

/* ── Fade-up on scroll ── */
.ev-fade {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
}
.ev-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* ── Trust marquee scroll ── */
@keyframes trust-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── Anti-gravity float ── */
@keyframes ev-float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-7px); }
}
.ev-float   { animation: ev-float 5.5s ease-in-out infinite; }
.ev-float-b { animation: ev-float 6.8s ease-in-out infinite 1.2s; }
.ev-float-c { animation: ev-float 7.4s ease-in-out infinite 0.6s; }

/* ── Pricing card float — more dramatic lift + subtle scale ── */
@keyframes card-float {
  0%   { transform: translateY(0px)   scale(1);     }
  30%  { transform: translateY(-6px)  scale(1.003); }
  55%  { transform: translateY(-14px) scale(1.006); }
  80%  { transform: translateY(-9px)  scale(1.003); }
  100% { transform: translateY(0px)   scale(1);     }
}

/* ── "Most popular" dot heartbeat ── */
@keyframes card-dot-pulse {
  0%, 100% { box-shadow: 0 0 7px rgba(244,201,106,0.7); }
  50%       { box-shadow: 0 0 14px rgba(244,201,106,1), 0 0 24px rgba(244,201,106,0.4); }
}

/* ── Subtle text hover ── */
.ev-h1 {
  transition: letter-spacing 0.5s ease, color 0.35s ease;
  cursor: default;
}
.ev-h1:hover {
  letter-spacing: -0.018em;
  color: #fff;
}

.ev-h2 {
  transition: letter-spacing 0.5s ease, color 0.35s ease;
  cursor: default;
  display: block;
}
.ev-h2:hover {
  letter-spacing: -0.015em;
  color: rgba(255,255,255,0.97);
}

.ev-p {
  transition: color 0.4s ease, transform 0.4s ease;
  cursor: default;
}
.ev-p:hover {
  color: rgba(255,255,255,0.62) !important;
  transform: translateY(-1px);
}

/* ── Input focus ── */
input[type="email"]:focus {
  border-color: rgba(244,201,106,0.4) !important;
}
`;

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function Email() {
  const progressRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{EMAIL_CSS}</style>
      <div className="email-progress" ref={progressRef} />
      <div style={{ position: 'relative', zIndex: 2, paddingBottom: 80 }}>
        <Hero />
        <TrustStrip />
        <PrivacySection />
        <FeatureGrid />
        <AIFeatures />
        <Pricing />
        <BottomCTA />
        <EmailFooter />
      </div>
    </>
  );
}
