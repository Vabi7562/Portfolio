import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { cn } from '../../lib/utils';

/* ── Ambient star field ───────────────────────────────────── */

function generateStars(count, starColor) {
  const shadows = [];
  for (let i = 0; i < count; i++) {
    const x = Math.floor(Math.random() * 4000) - 2000;
    const y = Math.floor(Math.random() * 4000) - 2000;
    shadows.push(`${x}px ${y}px ${starColor}`);
  }
  return shadows.join(', ');
}

function StarLayer({
  count = 1000,
  size = 1,
  transition = { repeat: Infinity, duration: 50, ease: 'linear' },
  starColor = '#fff',
  twinkleClass = '',
  twinkleDuration = '4s',
  twinkleDelay = '0s',
  className,
  ...props
}) {
  const [boxShadow, setBoxShadow] = React.useState('');

  React.useEffect(() => {
    setBoxShadow(generateStars(count, starColor));
  }, [count, starColor]);

  const twinkleStyle = twinkleClass
    ? { '--tw-dur': twinkleDuration, '--tw-delay': twinkleDelay }
    : {};

  return (
    <motion.div
      data-slot="star-layer"
      animate={{ y: [0, -2000] }}
      transition={transition}
      className={cn('absolute top-0 left-0 w-full h-[2000px]', className)}
      {...props}
    >
      <div
        className={cn('absolute bg-transparent rounded-full', twinkleClass)}
        style={{ width: `${size}px`, height: `${size}px`, boxShadow, ...twinkleStyle }}
      />
      <div
        className={cn('absolute bg-transparent rounded-full top-[2000px]', twinkleClass)}
        style={{ width: `${size}px`, height: `${size}px`, boxShadow, ...twinkleStyle }}
      />
    </motion.div>
  );
}

/* ── Shooting stars (extracted from shader streaks) ──────── */

const rand = (min, max) => Math.random() * (max - min) + min;

function useShootingStarProps(count) {
  return React.useMemo(() =>
    Array.from({ length: count }, () => ({
      top:      `${rand(2, 60)}%`,
      left:     `${rand(10, 95)}%`,
      width:    `${rand(90, 220)}px`,
      duration: `${rand(14, 22).toFixed(1)}s`,
      delay:    `${rand(0, 8).toFixed(1)}s`,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [count]);
}

function ShootingStars({ count = 8, starColor = 'rgba(255, 220, 140, 0.9)' }) {
  const stars = useShootingStarProps(count);

  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          className="shooting-star-wrap"
          style={{
            top:                    s.top,
            left:                   s.left,
            animationDuration:      s.duration,
            animationDelay:         s.delay,
          }}
        >
          <div
            className="shooting-star-line"
            style={{
              width:        s.width,
              '--ss-color': starColor,
            }}
          />
        </div>
      ))}
    </>
  );
}

/* ── Public component ────────────────────────────────────── */

export function StarsBackground({
  children,
  className,
  factor = 0.05,
  speed = 50,
  transition = { stiffness: 50, damping: 20 },
  starColor = '#fff',
  shootingStarCount = 6,
  shootingStarKey = 0,
  shootingStarOpacity = 1,
  ...props
}) {
  const offsetX = useMotionValue(1);
  const offsetY = useMotionValue(1);
  const springX = useSpring(offsetX, transition);
  const springY = useSpring(offsetY, transition);

  const handleMouseMove = React.useCallback(
    (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      offsetX.set(-(e.clientX - centerX) * factor);
      offsetY.set(-(e.clientY - centerY) * factor);
    },
    [offsetX, offsetY, factor],
  );

  return (
    <div
      data-slot="stars-background"
      className={cn('relative size-full', className)}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {/* Ambient star field — clipped to container */}
      <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_bottom,_#262626_0%,_#000_100%)]">
        <motion.div style={{ x: springX, y: springY }}>
          <StarLayer count={1000} size={1}
            transition={{ repeat: Infinity, duration: speed, ease: 'linear' }}
            starColor={starColor}
            twinkleClass="star-twinkle-a"
            twinkleDuration="5s"
            twinkleDelay="0s" />
          <StarLayer count={400} size={2}
            transition={{ repeat: Infinity, duration: speed * 2, ease: 'linear' }}
            starColor={starColor}
            twinkleClass="star-twinkle-b"
            twinkleDuration="7s"
            twinkleDelay="1.5s" />
          <StarLayer count={200} size={3}
            transition={{ repeat: Infinity, duration: speed * 3, ease: 'linear' }}
            starColor={starColor}
            twinkleClass="star-twinkle-c"
            twinkleDuration="9s"
            twinkleDelay="3s" />
        </motion.div>
      </div>

      {/* Shooting stars — outside overflow-hidden so they aren't clipped */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: shootingStarOpacity, transition: 'none' }}>
        <ShootingStars key={shootingStarKey} count={shootingStarCount} starColor={starColor} />
      </div>

      {children}
    </div>
  );
}
