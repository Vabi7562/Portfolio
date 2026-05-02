import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { SlideTabs } from './ui/slide-tabs';
import svLogo from '../assets/sv-logo.png';
import { useIsMobile } from '../hooks/useIsMobile';

function useScrollIdle(delay = 900) {
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    let t;
    const onScroll = () => {
      setScrolling(true);
      clearTimeout(t);
      t = setTimeout(() => setScrolling(false), delay);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, [delay]);
  return scrolling;
}

// ── Hero logo (top-center, home page only) ────────────────────
function HeroLogo() {
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const onScroll = () => scrollY.set(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollY]);

  // 0–220px of scroll drives the transition
  const rawProgress = useTransform(scrollY, [0, 220], [0, 1]);
  const progress    = useSpring(rawProgress, { stiffness: 120, damping: 22 });

  const scale   = useTransform(progress, [0, 1], [1, 0.35]);
  const opacity = useTransform(progress, [0, 0.6, 1], [1, 0.4, 0]);
  // moves downward and shrinks toward the nav pill (bottom of screen)
  const y       = useTransform(progress, [0, 1], [0, 60]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 32,
        left: '50%',
        x: '-50%',
        zIndex: 18,
        pointerEvents: 'none',
        scale,
        opacity,
        y,
        transformOrigin: 'top center',
      }}
    >
      <motion.img
        layoutId="sv-logo"
        src={svLogo}
        alt="SV"
        style={{
          width: 54,
          height: 54,
          objectFit: 'contain',
          filter: 'invert(1)',
          opacity: 0.85,
          display: 'block',
        }}
      />
    </motion.div>
  );
}

export default function Navigation() {
  const location  = useLocation();
  const isHome    = location.pathname === '/';
  const scrolling = useScrollIdle();
  const isMobile  = useIsMobile();

  // Track if we've scrolled past the hero logo threshold
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 180);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Large hero logo — only on home, fades into nav */}
      {isHome && <HeroLogo />}

      <AnimatePresence initial={false}>
        {(
          <motion.nav
            key="bottom-nav"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              bottom: 28,
              left: '50%',
              x: '-50%',
              zIndex: 20,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 9999,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(8,8,14,0.6)',
              backdropFilter: 'blur(28px) saturate(160%)',
              WebkitBackdropFilter: 'blur(28px) saturate(160%)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {/* Logo in nav — fades in after hero logo has descended */}
            <Link
              to="/"
              onClick={() => window.scrollTo(0, 0)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', paddingLeft: 14, flexShrink: 0 }}
            >
              <motion.div
                animate={{
                  width:   isHome && !pastHero ? 0 : 24,
                  opacity: isHome && !pastHero ? 0 : 1,
                }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center' }}
              >
                <img
                  src={svLogo} alt="SV"
                  style={{ width: 24, height: 24, objectFit: 'contain', filter: 'invert(1)', opacity: 0.75, flexShrink: 0 }}
                />
              </motion.div>

              {/* Name — always visible when hero logo is at top, collapses on scroll after */}
              <motion.div
                animate={{
                  width:   (isMobile || ((!isHome || pastHero) && scrolling)) ? 0 : 'auto',
                  opacity: (isMobile || ((!isHome || pastHero) && scrolling)) ? 0 : 1,
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span style={{
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  fontSize: '0.8rem',
                  color: 'rgba(160,200,255,0.55)',
                  userSelect: 'none',
                }}>❯</span>
                <span style={{
                  fontFamily: 'Archivo, sans-serif',
                  fontSize: '12px', fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                }}>
                  Vabi Sabharwal
                </span>
              </motion.div>
            </Link>

            {/* Divider */}
            <div style={{
              width: 1, height: 16, marginLeft: 10, marginRight: 2,
              background: 'rgba(255,255,255,0.1)',
              flexShrink: 0,
            }} />

            {/* Tabs */}
            <motion.div
              animate={{ paddingRight: scrolling ? 6 : 6, paddingLeft: scrolling ? 6 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <SlideTabs />
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
