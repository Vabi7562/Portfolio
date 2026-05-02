import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const IDLE_MS   = 400;   // spring to zero after this many ms of no movement
const SPRING    = 0.06;  // how fast it follows the cursor
const RETURN    = 0.08;  // how fast it springs back to zero when idle
const MAX_RX    = 3.5;   // max vertical tilt (degrees)
const MAX_RY    = 5;     // max horizontal tilt (degrees)

export default function CursorTilt({ children }) {
  const wrapRef    = useRef(null);
  const mouse      = useRef({ x: 0, y: 0 });
  const curr       = useRef({ x: 0, y: 0 });
  const lastMove   = useRef(0);
  const location   = useLocation();

  useEffect(() => {
    const isEmail = location.pathname === '/email';

    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5);
      mouse.current.y = (e.clientY / window.innerHeight - 0.5);
      lastMove.current = performance.now();
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    let raf;
    const tick = () => {
      const idle   = performance.now() - lastMove.current > IDLE_MS;
      // When idle or on email page, spring back to centre
      const target = (isEmail || idle) ? { x: 0, y: 0 } : mouse.current;
      const k      = (isEmail || idle) ? RETURN : SPRING;

      curr.current.x += (target.x - curr.current.x) * k;
      curr.current.y += (target.y - curr.current.y) * k;

      const scrollFade = Math.max(0, 1 - window.scrollY / 300);
      const rx = -curr.current.y * MAX_RX * scrollFade;
      const ry =  curr.current.x * MAX_RY * scrollFade;

      if (wrapRef.current) {
        // Remove transform on email + about so layout isn't distorted
        if (isEmail || location.pathname === '/about') {
          wrapRef.current.style.transform = 'none';
        } else {
          wrapRef.current.style.transform =
            `perspective(900px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  return (
    <div
      ref={wrapRef}
      style={{
        width: '100%',
        minHeight: '100%',
        transformOrigin: '50% 50%',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
