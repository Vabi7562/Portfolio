import React, { useState, useEffect } from 'react';

const IS_TOUCH = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ScrollIndicator from './components/ScrollIndicator';
import CursorTilt from './components/CursorTilt';
import CustomCursor from './components/CustomCursor';
import IntroAnimation from './components/IntroAnimation';
import Home from './pages/home';
import About from './pages/about';
import Services from './pages/services';
import Contact from './pages/contact';
import Photography from './pages/photography';
import Email from './pages/email';
import { StarsBackground } from './components/ui/stars';
import SpaceFloaters from './components/SpaceFloaters';
import SunReflections from './components/SunReflections';

const STAR_COLOR = 'rgba(255,220,140,0.9)';

// Standard: fast blur-scale warp
const pageVariants = {
  initial: { opacity: 0, scale: 0.97, filter: 'blur(6px)' },
  enter:   { opacity: 1, scale: 1,    filter: 'blur(0px)', transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 1.02, filter: 'blur(4px)', transition: { duration: 0.16, ease: [0.4, 0, 1, 0.6] } },
};

// Email: warp-zoom through space
const spaceZoomVariants = {
  initial: { opacity: 0, scale: 1.18, filter: 'blur(28px)' },
  enter:   { opacity: 1, scale: 1,    filter: 'blur(0px)',  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 1.08, filter: 'blur(18px)', transition: { duration: 0.3,  ease: [0.4, 0, 1, 0.6] } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/"        element={<motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit"><Home /></motion.div>} />
        <Route path="/about"   element={<motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit"><About /></motion.div>} />
        <Route path="/services" element={<motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit"><Services /></motion.div>} />
        <Route path="/contact" element={<motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit"><Contact /></motion.div>} />
        <Route path="/photography" element={<motion.div variants={pageVariants} initial="initial" animate="enter" exit="exit"><Photography /></motion.div>} />
        <Route path="/email"   element={<motion.div variants={spaceZoomVariants} initial="initial" animate="enter" exit="exit"><Email /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [starsKey,  setStarsKey]  = useState(0);

  useEffect(() => {
    if (introDone) {
      const t = setTimeout(() => setStarsKey(1), 50);
      return () => clearTimeout(t);
    }
  }, [introDone]);

  return (
    <Router>
      {/* ── Custom cursor (outside everything, highest z) ──── */}
      {!IS_TOUCH && <CustomCursor />}

      {!introDone && <IntroAnimation onComplete={() => setIntroDone(true)} />}

      <Navigation />
      <ScrollIndicator />

      <CursorTilt>
      {/* ── Layer 0: CSS star field ───────────────────────── */}
      <StarsBackground
        className="min-h-screen"
        starColor={STAR_COLOR}
        speed={60}
        factor={0.04}
        shootingStarCount={6}
        shootingStarKey={starsKey}
        shootingStarOpacity={1}        // controlled externally via wrapper ref below
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      />

      {/* ── Layer 0.5: Space floaters ─────────────────────── */}
      <SpaceFloaters />

      {/* ── Layer 0.6: Sun reflections (lens flare orbs) ──── */}
      <SunReflections />

      {/* ── Layer 3: Page content ─────────────────────────── */}
      <div className="relative flex flex-col min-h-screen" style={{ zIndex: 3 }}>
        <div className="flex-grow">
          <AnimatedRoutes />
        </div>

        <Footer />
      </div>

      </CursorTilt>
    </Router>
  );
}
