import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import emailjs from '@emailjs/browser';

emailjs.init('_pumMWUNxLUsyOJgP');

// ── Animation primitives ───────────────────────────────────────
const titleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const titleWord = {
  hidden: { opacity: 0, y: 22, filter: 'blur(5px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)',
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

function AnimatedTitle({ text, style }) {
  return (
    <motion.h1
      variants={titleContainer}
      initial="hidden"
      animate="show"
      style={{ ...style, margin: 0 }}
    >
      {text.split(' ').map((word, i) => (
        <motion.span
          key={i}
          variants={titleWord}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

const Reveal = ({ children, delay = 0, y = 20 }) => (
  <motion.div
    initial={{ opacity: 0, y, filter: 'blur(5px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);

// ── Contact link row ───────────────────────────────────────────
function ContactLink({ label, display, href, delay }) {
  const [hot, setHot] = useState(false);
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{
        display: 'flex', alignItems: 'center',
        padding: '18px 0',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none',
        gap: 16,
        transition: 'border-color 200ms',
        borderBottomColor: hot ? 'rgba(244,201,106,0.2)' : 'rgba(255,255,255,0.07)',
      }}
    >
      {/* Label */}
      <span style={{
        fontFamily: "'SF Mono', 'Fira Code', monospace",
        fontSize: '0.6rem', letterSpacing: '0.14em',
        textTransform: 'uppercase', flexShrink: 0,
        color: hot ? 'rgba(244,201,106,0.6)' : 'rgba(255,255,255,0.2)',
        transition: 'color 200ms', width: 68,
      }}>{label}</span>

      {/* Line */}
      <div style={{ flex: 1, height: 1, overflow: 'hidden', background: 'rgba(255,255,255,0.06)' }}>
        <motion.div
          animate={{ scaleX: hot ? 1 : 0.08, opacity: hot ? 0.35 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: '100%', background: 'rgba(244,201,106,1)', transformOrigin: 'left' }}
        />
      </div>

      {/* Display text */}
      <span style={{
        fontFamily: 'Archivo, sans-serif', fontSize: '0.9rem',
        color: hot ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
        transition: 'color 200ms', flex: 1,
        letterSpacing: '-0.01em',
      }}>{display}</span>

      {/* Arrow */}
      <motion.span
        animate={{ x: hot ? 3 : 0, y: hot ? -3 : 0, opacity: hot ? 0.7 : 0.2 }}
        transition={{ duration: 0.2 }}
        style={{ fontSize: '0.85rem', color: 'rgba(244,201,106,1)', flexShrink: 0 }}
      >↗</motion.span>
    </motion.a>
  );
}

// ── Styled input ───────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', placeholder, multiline }) {
  const [focused, setFocused] = useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: 'block', marginBottom: 8,
        fontSize: '0.65rem', letterSpacing: '0.14em',
        textTransform: 'uppercase', color: focused ? 'rgba(160,200,255,0.6)' : 'rgba(255,255,255,0.25)',
        transition: 'color 200ms',
      }}>{label}</label>
      <Tag
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={multiline ? 5 : undefined}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: focused ? 'rgba(160,200,255,0.03)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${focused ? 'rgba(160,200,255,0.28)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 10, padding: multiline ? '14px 16px' : '12px 16px',
          fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.88rem',
          color: 'rgba(255,255,255,0.82)',
          outline: 'none', resize: multiline ? 'vertical' : 'none',
          transition: 'border-color 200ms, background 200ms',
          boxShadow: focused ? '0 0 0 3px rgba(160,200,255,0.06)' : 'none',
        }}
      />
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────
export default function Contact() {
  const isMobile  = useIsMobile();
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState('idle'); // idle | sending | sent | error
  const px = isMobile ? 20 : 32;

  const handleSend = async () => {
    if (!message.trim()) return;
    setStatus('sending');
    try {
      await emailjs.send('service_ofelsbu', 'template_00r88lq', {
        from_name: name.trim() || 'Anonymous',
        reply_to:  email.trim() || '',
        message:   message.trim(),
      });
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <main style={{ maxWidth: '960px', margin: '0 auto', padding: `72px ${px}px 120px` }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 64 }}>
        <motion.p
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: '0.72rem', color: '#8A8070',
            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 20,
          }}
        >
          Contact
        </motion.p>

        <AnimatedTitle
          text="Let's talk."
          style={{
            fontFamily: 'Archivo, sans-serif', fontWeight: 300,
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.03em',
            lineHeight: 1.1, marginBottom: 24,
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'rgba(120,220,120,0.85)',
            boxShadow: '0 0 6px rgba(120,220,120,0.6)',
            display: 'inline-block', flexShrink: 0,
          }} />
          <span style={{
            fontSize: '0.65rem', letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(160,200,255,0.55)',
          }}>
            Available · Melbourne, VIC
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.72 }}
          style={{
            fontSize: '0.95rem', color: 'rgba(255,255,255,0.38)',
            lineHeight: 1.85, maxWidth: 480,
          }}
        >
          Whether you're exploring AI strategy, need a website, or have a project in mind — drop me a message and I'll get back to you within 24 hours.
        </motion.p>
      </div>

      {/* ── Two-column layout ─────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 48 : 64,
        alignItems: 'start',
      }}>

        {/* Left — contact links ────────────────────────────── */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
            style={{
              fontSize: '0.63rem', letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'rgba(160,200,255,0.4)',
              marginBottom: 4,
            }}
          >
            Reach me directly
          </motion.p>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginBottom: 0 }}>
            <ContactLink
              label="Email"
              display="vabi7562@sabharwal.cloud"
              href="mailto:vabi7562@sabharwal.cloud"
              delay={1.0}
            />
            <ContactLink
              label="LinkedIn"
              display="VabiSabharwal"
              href="https://linkedin.com/in/VabiSabharwal"
              delay={1.1}
            />
            <ContactLink
              label="GitHub"
              display="Vabi7562"
              href="https://github.com/Vabi7562"
              delay={1.2}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.5 }}
            style={{ marginTop: 32 }}
          >
            <p style={{
              fontSize: '0.72rem', color: 'rgba(255,255,255,0.2)',
              lineHeight: 1.75,
            }}>
              Response time — usually within 24h.<br />
              Open to consulting, projects, and collabs.
            </p>
          </motion.div>
        </div>

        {/* Right — message form ────────────────────────────── */}
        <Reveal delay={0.3}>
          <div style={{
            background: 'rgba(255,255,255,0.015)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16, padding: isMobile ? '24px 20px' : '28px 28px',
          }}>
            <p style={{
              fontFamily: 'Archivo, sans-serif', fontSize: '0.92rem', fontWeight: 400,
              color: 'rgba(255,255,255,0.75)', marginBottom: 24, letterSpacing: '-0.01em',
            }}>
              Send a message
            </p>

            <Field
              label="Your name (optional)"
              value={name}
              onChange={setName}
              placeholder="Jane Smith"
            />
            <Field
              label="Your email — so I can reply (optional)"
              value={email}
              onChange={setEmail}
              placeholder="jane@example.com"
            />
            <Field
              label="Message"
              value={message}
              onChange={setMessage}
              placeholder="Tell me what you're working on..."
              multiline
            />

            <motion.button
              onClick={handleSend}
              disabled={status === 'sending' || !message.trim()}
              whileHover={status === 'idle' && message.trim() ? { scale: 1.02 } : {}}
              whileTap={status === 'idle' && message.trim() ? { scale: 0.97 } : {}}
              style={{
                width: '100%', padding: '12px 20px',
                borderRadius: 9999,
                cursor: status === 'sending' || !message.trim() ? 'not-allowed' : 'pointer',
                opacity: !message.trim() ? 0.45 : 1,
                border: `1px solid ${
                  status === 'sent'  ? 'rgba(120,220,120,0.4)' :
                  status === 'error' ? 'rgba(255,100,100,0.4)' :
                  'rgba(244,201,106,0.35)'
                }`,
                background:
                  status === 'sent'  ? 'rgba(120,220,120,0.06)' :
                  status === 'error' ? 'rgba(255,100,100,0.06)' :
                  'rgba(244,201,106,0.07)',
                fontFamily: 'Archivo, sans-serif', fontSize: '0.82rem',
                color:
                  status === 'sent'  ? 'rgba(120,220,120,0.9)' :
                  status === 'error' ? 'rgba(255,120,120,0.9)' :
                  'rgba(244,201,106,0.9)',
                letterSpacing: '0.04em',
                transition: 'border-color 300ms, background 300ms, color 300ms, opacity 200ms',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {status === 'sending' && <><span>Sending</span><motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1 }}>...</motion.span></>}
              {status === 'sent'    && <><span>Message sent</span><span>✓</span></>}
              {status === 'error'   && <><span>Failed — try again</span><span>✕</span></>}
              {status === 'idle'    && <><span>Send message</span><span>↗</span></>}
            </motion.button>

            <p style={{
              fontSize: '0.65rem', color: 'rgba(255,255,255,0.18)',
              textAlign: 'center', marginTop: 12, lineHeight: 1.6,
            }}>
              Delivered directly to my inbox
            </p>
          </div>
        </Reveal>

      </div>
    </main>
  );
}
