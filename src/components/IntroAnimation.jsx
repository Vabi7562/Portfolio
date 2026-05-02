import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

const EASE_CSS = [0.76, 0, 0.24, 1];

// ── Name rows ────────────────────────────────────────────────────
const NAME_1 = 'VABI';
const NAME_2 = 'SABHARWAL';
const N1 = NAME_1.length;
const N2 = NAME_2.length;

// ── Timing (seconds from animation start) ────────────────────────
const T_NAME_START   = 0.3;
const T_CHAR_GAP     = 0.11;
const T_ROW_GAP      = 0.5;
const T_PAUSE        = 0.7;
const T_GLOW         = 0.35;

const lastChar1Time  = T_NAME_START + (N1 - 1) * T_CHAR_GAP;
const firstChar2Time = lastChar1Time + T_ROW_GAP;
const lastChar2Time  = firstChar2Time + (N2 - 1) * T_CHAR_GAP;
const T_FULL_NAME    = lastChar2Time + 0.25;
const T_GLOW_START   = T_FULL_NAME + T_PAUSE;
const T_MORPH_START  = T_GLOW_START + T_GLOW;
const T_LOGO_START   = T_MORPH_START + 0.4;

// ── Logo draw sequence (seconds relative to T_LOGO_START) ────────
const LOGO_SEQ = [
  { start: 0.0,  dur: 1.55 },
  { start: 1.0,  dur: 1.05 },
  { start: 1.65, dur: 0.75 },
];
const LOGO_DRAW_END = 2.5;

// Lift curtain this many ms after animation tick starts
const LIFT_DELAY_MS = 8200;

export default function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState('show'); // 'show' | 'lift' | 'done'

  // ── Refs ──────────────────────────────────────────────────────
  const fxCanvasRef  = useRef(null);
  const nameStageRef = useRef(null);
  const logoStageRef = useRef(null);
  const svgRef       = useRef(null);
  const glowRef      = useRef(null);
  const diamondRef   = useRef(null);
  const sRef         = useRef(null);
  const vRef         = useRef(null);
  const wordmarkRef  = useRef(null);
  const row1Refs     = useRef([]);
  const row2Refs     = useRef([]);
  const rafIdRef     = useRef(null);
  const breathIdRef  = useRef(null);

  useEffect(() => {
    const fxCanvas  = fxCanvasRef.current;
    const svgEl     = svgRef.current;
    const glowGroup = glowRef.current;
    const nameStage = nameStageRef.current;
    const logoStage = logoStageRef.current;
    const wordmark  = wordmarkRef.current;
    if (!fxCanvas || !svgEl) return;

    const fxCtx = fxCanvas.getContext('2d');
    const DPR   = Math.min(window.devicePixelRatio || 1, 2);

    function resizeFX() {
      fxCanvas.width        = window.innerWidth  * DPR;
      fxCanvas.height       = window.innerHeight * DPR;
      fxCanvas.style.width  = window.innerWidth  + 'px';
      fxCanvas.style.height = window.innerHeight + 'px';
      fxCtx.scale(DPR, DPR);
    }
    resizeFX();
    window.addEventListener('resize', resizeFX);

    const paths = [diamondRef.current, sRef.current, vRef.current];

    // Initialise SVG paths invisible
    paths.forEach(path => {
      if (!path) return;
      const L = path.getTotalLength();
      path.style.strokeDasharray  = L;
      path.style.strokeDashoffset = L;
    });
    glowGroup.style.opacity = '0';

    const easeOut = t => 1 - Math.pow(1 - t, 3);

    // Convert SVG path point → screen px (for fx canvas)
    function getLogoPoint(pathEl, len) {
      const pt   = pathEl.getPointAtLength(Math.max(0, Math.min(len, pathEl.getTotalLength())));
      const vbPt = svgEl.createSVGPoint();
      vbPt.x = pt.x; vbPt.y = pt.y;
      const vp    = vbPt.matrixTransform(pathEl.getCTM());
      const scale = 340 / 512;
      const rect  = logoStage.getBoundingClientRect();
      return { x: rect.left + vp.x * scale, y: rect.top + vp.y * scale };
    }

    // ── Particles ──────────────────────────────────────────────
    let particles = [];

    function emitFromRect(x, y, w, h, count) {
      for (let i = 0; i < count; i++) {
        const px   = x - w/2 + Math.random()*w;
        const py   = y - h/2 + Math.random()*h;
        const cx   = window.innerWidth/2, cy = window.innerHeight/2;
        const dx   = cx - px, dy = cy - py;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;
        const bias = 0.4 + Math.random()*0.4;
        particles.push({
          x: px, y: py,
          vx: (dx/dist)*bias*4 + (Math.random()-0.5)*3,
          vy: (dy/dist)*bias*4 + (Math.random()-0.5)*3,
          life: 1, decay: 0.012 + Math.random()*0.018,
          sz: 1.5 + Math.random()*2.5, gold: Math.random() > 0.3,
        });
      }
    }

    function emitBurst(x, y, count = 10) {
      for (let i = 0; i < count; i++) {
        const a  = (Math.PI*2/count)*i + (Math.random()-0.5)*0.5;
        const sp = 2 + Math.random()*4;
        particles.push({
          x, y, vx: Math.cos(a)*sp, vy: Math.sin(a)*sp,
          life: 1, decay: 0.025 + Math.random()*0.025,
          sz: 1.5 + Math.random()*2.5, gold: true,
        });
      }
    }

    function tickParticles() {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx; p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) { particles.splice(i, 1); continue; }
        const c = p.gold ? '244,201,106' : '240,235,224';
        const g = fxCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.sz*p.life);
        g.addColorStop(0, `rgba(${c},${p.life*0.95})`);
        g.addColorStop(1, `rgba(${c},0)`);
        fxCtx.fillStyle = g;
        fxCtx.beginPath(); fxCtx.arc(p.x, p.y, p.sz*p.life, 0, Math.PI*2); fxCtx.fill();
      }
    }

    function drawComet(x, y, alpha) {
      let g = fxCtx.createRadialGradient(x, y, 0, x, y, 38);
      g.addColorStop(0, `rgba(244,201,106,${alpha*0.28})`);
      g.addColorStop(1, 'rgba(244,201,106,0)');
      fxCtx.fillStyle = g; fxCtx.beginPath(); fxCtx.arc(x, y, 38, 0, Math.PI*2); fxCtx.fill();
      g = fxCtx.createRadialGradient(x, y, 0, x, y, 13);
      g.addColorStop(0, `rgba(255,252,240,${alpha})`);
      g.addColorStop(0.5, `rgba(244,201,106,${alpha*0.85})`);
      g.addColorStop(1, 'rgba(244,201,106,0)');
      fxCtx.fillStyle = g; fxCtx.beginPath(); fxCtx.arc(x, y, 13, 0, Math.PI*2); fxCtx.fill();
    }

    // ── Animation tick ─────────────────────────────────────────
    let charRevealedIdx       = -1;
    let glowApplied           = false;
    let morphParticlesEmitted = false;
    let logoCompleted         = new Set();
    let idleStarted           = false;
    let t0                    = null;

    function tick(ts) {
      if (!t0) t0 = ts;
      const elapsed = (ts - t0) / 1000;

      fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // ── Phase 1: letter reveals ──
      for (let i = 0; i < N1; i++) {
        if (elapsed >= T_NAME_START + i*T_CHAR_GAP && charRevealedIdx < i) {
          const span = row1Refs.current[i];
          if (span) {
            span.style.animation = 'none';
            void span.offsetWidth;
            span.style.animation = 'intro-char-in 0.5s cubic-bezier(0.22,1,0.36,1) forwards';
          }
          charRevealedIdx = i;
        }
      }
      for (let i = 0; i < N2; i++) {
        const globalIdx = N1 + i;
        if (elapsed >= firstChar2Time + i*T_CHAR_GAP && charRevealedIdx < globalIdx) {
          const span = row2Refs.current[i];
          if (span) {
            span.style.animation = 'none';
            void span.offsetWidth;
            span.style.animation = 'intro-char-in 0.5s cubic-bezier(0.22,1,0.36,1) forwards';
          }
          charRevealedIdx = globalIdx;
        }
      }

      // ── Phase 2: gold glow ──
      if (elapsed >= T_GLOW_START && !glowApplied) {
        glowApplied = true;
        [...row1Refs.current, ...row2Refs.current].forEach(span => {
          if (!span) return;
          span.style.color      = 'rgba(244,201,106,0.9)';
          span.style.textShadow = '0 0 20px rgba(244,201,106,0.6), 0 0 50px rgba(244,201,106,0.3)';
        });
      }

      // ── Phase 3: morph — scatter name → logo ──
      if (elapsed >= T_MORPH_START && !morphParticlesEmitted) {
        morphParticlesEmitted = true;
        [...row1Refs.current, ...row2Refs.current].forEach(span => {
          if (!span) return;
          const r = span.getBoundingClientRect();
          if (r.width > 0) emitFromRect(r.left + r.width/2, r.top + r.height/2, r.width*1.2, r.height*1.2, 8);
        });
        if (nameStage) {
          nameStage.style.transition = 'opacity 0.45s ease, filter 0.45s ease';
          nameStage.style.opacity    = '0';
          nameStage.style.filter     = 'blur(6px)';
        }
      }

      // ── Phase 4: logo fade-in ──
      if (elapsed >= T_LOGO_START && logoStage && !logoStage.dataset.shown) {
        logoStage.dataset.shown = '1';
        logoStage.style.opacity   = '1';
        logoStage.style.transform = 'translate(-50%, -50%) scale(1)';
      }

      // ── Phase 5: logo draw + comet ──
      if (elapsed >= T_LOGO_START) {
        const le = elapsed - T_LOGO_START;
        paths.forEach((path, i) => {
          if (!path) return;
          const { start, dur } = LOGO_SEQ[i];
          const L  = path.getTotalLength();
          const t  = Math.max(0, Math.min(1, (le - start) / dur));
          path.style.strokeDashoffset = L * (1 - easeOut(t));
          if (t > 0 && t < 1) {
            const { x, y } = getLogoPoint(path, L * easeOut(t));
            const alpha = t < 0.07 ? t/0.07 : t > 0.88 ? (1-t)/0.12 : 1;
            drawComet(x, y, alpha * 0.95);
          }
          if (t >= 1 && !logoCompleted.has(i)) {
            logoCompleted.add(i);
            const { x, y } = getLogoPoint(path, L);
            emitBurst(x, y, 10);
          }
        });

        if (le > LOGO_DRAW_END) {
          glowGroup.style.opacity = Math.min(1, (le - LOGO_DRAW_END) * 2).toFixed(3);
        }
        if (le > LOGO_DRAW_END + 0.8 && wordmark) {
          wordmark.style.opacity = '1';
        }
      }

      tickParticles();

      // Hand off to breathing idle
      const allLogosDone = paths.every((path, i) => {
        if (!path) return true;
        const le = elapsed - T_LOGO_START;
        return le > 0 && (le - LOGO_SEQ[i].start) / LOGO_SEQ[i].dur >= 1;
      });
      if (allLogosDone && particles.length === 0 && elapsed > T_LOGO_START + LOGO_DRAW_END + 0.3 && !idleStarted) {
        idleStarted = true;
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
        fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        startIdle();
        return;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    }

    function startIdle() {
      let t = 0;
      function breathe() {
        t += 0.016;
        if (glowGroup) glowGroup.style.opacity = (0.45 + 0.45*Math.sin(t)).toFixed(3);
        breathIdRef.current = requestAnimationFrame(breathe);
      }
      breathIdRef.current = requestAnimationFrame(breathe);
    }

    const startTimer = setTimeout(() => {
      rafIdRef.current = requestAnimationFrame(tick);
    }, 500);

    const liftTimer = setTimeout(() => setPhase('lift'), LIFT_DELAY_MS);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(liftTimer);
      window.removeEventListener('resize', resizeFX);
      if (rafIdRef.current)    cancelAnimationFrame(rafIdRef.current);
      if (breathIdRef.current) cancelAnimationFrame(breathIdRef.current);
    };
  }, []);

  if (phase === 'done') return null;

  const charStyle = {
    fontFamily: 'Archivo, sans-serif',
    fontWeight: 200,
    fontSize: 'clamp(2rem, 6vw, 3.8rem)',
    letterSpacing: '0.18em',
    color: '#F0EBE0',
    opacity: 0,
    transform: 'translateY(14px)',
    display: 'inline-block',
    transition: 'color 0.4s, text-shadow 0.4s',
  };

  return (
    <>
      <style>{`
        @keyframes intro-char-in {
          from { opacity: 0; transform: translateY(14px); filter: blur(5px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0px); }
        }
      `}</style>

      <motion.div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: '#0A0A0A',
        }}
        animate={phase === 'lift' ? { y: '-100%' } : { y: '0%' }}
        transition={phase === 'lift' ? { duration: 1.0, ease: EASE_CSS } : { duration: 0 }}
        onAnimationComplete={() => {
          if (phase === 'lift') { setPhase('done'); onComplete?.(); }
        }}
      >
        {/* Full-screen fx canvas (particles + comets) */}
        <canvas
          ref={fxCanvasRef}
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
        />

        {/* Name stage */}
        <div
          ref={nameStageRef}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            zIndex: 3, willChange: 'opacity, filter',
          }}
        >
          <div style={{ display: 'flex', gap: '0.04em', justifyContent: 'center' }}>
            {NAME_1.split('').map((ch, i) => (
              <span key={i} ref={el => row1Refs.current[i] = el} style={charStyle}>{ch}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.04em', justifyContent: 'center' }}>
            {NAME_2.split('').map((ch, i) => (
              <span key={i} ref={el => row2Refs.current[i] = el} style={charStyle}>{ch}</span>
            ))}
          </div>
        </div>

        {/* Logo stage */}
        <div
          ref={logoStageRef}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) scale(0.88)',
            width: 340, height: 340,
            opacity: 0,
            transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
            zIndex: 3,
          }}
        >
          <svg
            ref={svgRef}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              <filter id="intro-soft-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="b"/>
                <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Gold glow backing */}
            <g ref={glowRef} style={{ opacity: 0 }}>
              <path filter="url(#intro-soft-glow)"
                d="M168,80 L344,80 A88,88 0 0 1 432,168 L432,344 A88,88 0 0 1 344,432 L168,432 A88,88 0 0 1 80,344 L80,168 A88,88 0 0 1 168,80 Z"
                transform="rotate(45 256 256)"
                fill="none" stroke="rgba(244,201,106,0.4)" strokeWidth="26"
                strokeLinecap="round" strokeLinejoin="round"/>
              <path filter="url(#intro-soft-glow)"
                d="M238,192 C238,166 146,166 146,210 C146,255 238,258 238,300 C238,342 146,342 146,320"
                fill="none" stroke="rgba(244,201,106,0.4)" strokeWidth="30" strokeLinecap="round"/>
              <path filter="url(#intro-soft-glow)"
                d="M252,192 L314,334 L376,192"
                fill="none" stroke="rgba(244,201,106,0.4)" strokeWidth="30"
                strokeLinecap="round" strokeLinejoin="round"/>
            </g>

            {/* Main white strokes */}
            <path ref={diamondRef}
              d="M168,80 L344,80 A88,88 0 0 1 432,168 L432,344 A88,88 0 0 1 344,432 L168,432 A88,88 0 0 1 80,344 L80,168 A88,88 0 0 1 168,80 Z"
              transform="rotate(45 256 256)"
              fill="none" stroke="#F0EBE0" strokeWidth="26"
              strokeLinecap="round" strokeLinejoin="round"/>
            <path ref={sRef}
              d="M238,192 C238,166 146,166 146,210 C146,255 238,258 238,300 C238,342 146,342 146,320"
              fill="none" stroke="#F0EBE0" strokeWidth="30" strokeLinecap="round"/>
            <path ref={vRef}
              d="M252,192 L314,334 L376,192"
              fill="none" stroke="#F0EBE0" strokeWidth="30"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        {/* Wordmark */}
        <div
          ref={wordmarkRef}
          style={{
            position: 'absolute',
            top: 'calc(50% + 195px)', left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 300, fontSize: 11,
            letterSpacing: '0.30em', textTransform: 'uppercase',
            color: 'rgba(240,235,224,0.22)',
            whiteSpace: 'nowrap', opacity: 0, zIndex: 4,
            transition: 'opacity 1s ease',
          }}
        >
          Sabharwal Ventures
        </div>

        {/* Bottom edge line */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 1, background: 'rgba(255,255,255,0.06)', zIndex: 5,
        }} />
      </motion.div>
    </>
  );
}
