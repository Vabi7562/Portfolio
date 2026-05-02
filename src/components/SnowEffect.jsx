import { useEffect, useRef } from 'react';

const clamp  = (v, a, b) => Math.min(Math.max(v, a), b);
const smooth = (t) => t * t * (3 - 2 * t);

const rand = (min, max) => Math.random() * (max - min) + min;

function makeFlake(w, h) {
  return {
    x:     rand(0, w),
    y:     rand(-h, h),
    r:     rand(0.6, 2.2),
    speed: rand(0.4, 1.1),
    drift: rand(-0.18, 0.18),
    alpha: rand(0.4, 0.95),
  };
}

export default function SnowEffect() {
  const canvasRef    = useRef(null);
  const scrollRef    = useRef(0);
  const flakesRef    = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      flakesRef.current = Array.from({ length: 160 }, () => makeFlake(canvas.width, canvas.height));
    };
    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    let raf;
    const draw = () => {
      const p = scrollRef.current;

      // Opacity: appears only after navy is established (~0.75), fades at sea
      const tIn  = smooth(clamp((p - 0.75) / 0.10, 0, 1));
      const tOut = smooth(clamp((p - 0.93) / 0.07, 0, 1));
      const masterOpacity = tIn * (1 - tOut);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (masterOpacity > 0.01) {
        const flakes = flakesRef.current;
        for (const f of flakes) {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220,235,255,${f.alpha * masterOpacity})`;
          ctx.fill();

          f.y += f.speed;
          f.x += f.drift;

          if (f.y > canvas.height + 4) {
            f.y = -4;
            f.x = rand(0, canvas.width);
          }
          if (f.x < 0) f.x = canvas.width;
          if (f.x > canvas.width) f.x = 0;
        }
      }

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        zIndex: 2, pointerEvents: 'none',
        width: '100%', height: '100%',
      }}
    />
  );
}
