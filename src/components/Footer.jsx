import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import svLogo from '../assets/sv-logo.png';

const NAV = [
  { label: 'Home',        path: '/'            },
  { label: 'About',       path: '/about'       },
  { label: 'Services',    path: '/services'    },
  { label: 'Contact',     path: '/contact'     },
  { label: 'Photography', path: '/photography' },
];

const SOCIAL = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/VabiSabharwal' },
  { label: 'GitHub',   href: 'https://github.com/Vabi7562'           },
  { label: 'Email',    href: 'mailto:vabi7562@sabharwal.cloud'        },
];

function FooterLink({ href, children }) {
  const [hot, setHot] = React.useState(false);
  return (
    <a
      href={href}
      target={href.startsWith('mailto') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{
        fontSize: '0.78rem', textDecoration: 'none', letterSpacing: '0.02em',
        color: hot ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.28)',
        transition: 'color 150ms',
      }}
    >
      {children}
    </a>
  );
}

function FooterNavLink({ path, children }) {
  const navigate = useNavigate();
  const [hot, setHot] = React.useState(false);
  return (
    <span
      onClick={() => { window.scrollTo(0, 0); navigate(path); }}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      style={{
        fontSize: '0.78rem', letterSpacing: '0.02em', cursor: 'pointer',
        color: hot ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.28)',
        transition: 'color 150ms',
      }}
    >
      {children}
    </span>
  );
}

export default function Footer() {
  const isMobile = useIsMobile();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative', zIndex: 3,
        borderTop: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(8,8,14,0.5)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 100, // clears fixed nav pill
      }}
    >
      <div style={{
        maxWidth: '960px', margin: '0 auto',
        padding: isMobile ? '48px 20px 0' : '56px 32px 0',
      }}>

        {/* ── Top row ─────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr',
          gap: isMobile ? 40 : 48,
          marginBottom: 48,
        }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <img
                src={svLogo} alt="SV"
                style={{ width: 22, height: 22, objectFit: 'contain', filter: 'invert(1)', opacity: 0.7 }}
              />
              <span style={{
                fontFamily: 'Archivo, sans-serif', fontSize: '0.85rem', fontWeight: 300,
                color: 'rgba(255,255,255,0.65)', letterSpacing: '0.03em',
              }}>
                Sabharwal Ventures
              </span>
            </div>
            <p style={{
              fontSize: '0.8rem', color: 'rgba(255,255,255,0.22)',
              lineHeight: 1.75, maxWidth: 260,
            }}>
              AI strategy, consulting, and web development — helping businesses turn technology into measurable outcomes.
            </p>
            {/* Availability */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 20 }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: 'rgba(120,220,120,0.85)',
                boxShadow: '0 0 6px rgba(120,220,120,0.55)',
                display: 'inline-block',
              }} />
              <span style={{
                fontSize: '0.65rem', letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'rgba(160,200,255,0.45)',
              }}>
                Available · Melbourne, VIC
              </span>
            </div>
          </div>

          {/* Nav links */}
          <div>
            <p style={{
              fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)', marginBottom: 16,
            }}>Pages</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {NAV.map(({ label, path }) => (
                <FooterNavLink key={path} path={path}>{label}</FooterNavLink>
              ))}
            </div>
          </div>

          {/* Social links */}
          <div>
            <p style={{
              fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.2)', marginBottom: 16,
            }}>Connect</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {SOCIAL.map(({ label, href }) => (
                <FooterLink key={label} href={href}>{label} ↗</FooterLink>
              ))}
            </div>
          </div>

        </div>

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: 24,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}>
          <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.02em' }}>
            © {new Date().getFullYear()} Sabharwal Ventures · Melbourne, Australia
          </p>
          <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.12)', letterSpacing: '0.02em' }}>
            Built by Vabi Sabharwal
          </p>
        </div>

      </div>
    </motion.footer>
  );
}
