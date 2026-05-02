import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Brief radial flash on every route change — warp-jump feel
export default function WarpFlash() {
  const location = useLocation();
  const ref  = useRef(null);
  const prev = useRef(location.pathname);

  useEffect(() => {
    if (prev.current === location.pathname) return;
    prev.current = location.pathname;
    const el = ref.current;
    if (!el) return;

    el.style.transition = 'none';
    el.style.opacity = '1';
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.55s cubic-bezier(0.4,0,1,0.6)';
      el.style.opacity = '0';
    });
  }, [location.pathname]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background:
          'radial-gradient(ellipse at 50% 50%, rgba(140,200,255,0.55) 0%, rgba(30,80,180,0.25) 40%, transparent 70%)',
        opacity: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
