import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const SECTIONS = [
  {
    // mountain / origin icon
    svg: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 3L16 15H2L9 3Z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    // wave / horizon icon
    svg: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 9 Q4.5 6.5 7 9 Q9.5 11.5 12 9 Q14.5 6.5 17 9" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M2 12.5 Q4.5 10 7 12.5 Q9.5 15 12 12.5 Q14.5 10 17 12.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
  },
];

const LINE_HEIGHT = 120; // px between icons

export default function ScrollIndicator() {
  const location = useLocation();
  const lineRef  = useRef(null);
  const topRef   = useRef(null);
  const botRef   = useRef(null);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p   = max > 0 ? Math.min(window.scrollY / max, 1) : 0;

      if (lineRef.current)  lineRef.current.style.height  = `${p * LINE_HEIGHT}px`;

      // icon brightness: top fades as you leave, bottom brightens as you arrive
      if (topRef.current)  topRef.current.style.opacity  = String(0.25 + (1 - p) * 0.65);
      if (botRef.current)  botRef.current.style.opacity  = String(0.25 + p * 0.65);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  if (location.pathname === '/email') return null;

  return (
    <div style={{
      position: 'fixed',
      left: '28px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pointerEvents: 'none',
      userSelect: 'none',
    }}>
      {/* Top icon */}
      <div
        ref={topRef}
        style={{ color: 'rgba(255,255,255,0.9)', opacity: 0.9, lineHeight: 0 }}
      >
        {SECTIONS[0].svg}
      </div>

      {/* Track line */}
      <div style={{
        width: '1px',
        height: `${LINE_HEIGHT}px`,
        background: 'rgba(255,255,255,0.1)',
        position: 'relative',
        marginTop: '8px',
        marginBottom: '8px',
      }}>
        {/* Filled progress portion */}
        <div
          ref={lineRef}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '0px',
            background: 'rgba(255,255,255,0.55)',
          }}
        />
      </div>

      {/* Bottom icon */}
      <div
        ref={botRef}
        style={{ color: 'rgba(255,255,255,0.9)', opacity: 0.25, lineHeight: 0 }}
      >
        {SECTIONS[1].svg}
      </div>
    </div>
  );
}
