import React, { useMemo } from 'react';

const rand = (min, max) => Math.random() * (max - min) + min;

function useShootingStarProps(count) {
  return useMemo(() =>
    Array.from({ length: count }, () => ({
      top:      `${rand(-5, 65)}%`,
      left:     `${rand(5, 105)}%`,
      width:    `${rand(90, 220)}px`,
      duration: `${rand(18, 28).toFixed(1)}s`,
      delay:    `${rand(0, 28).toFixed(1)}s`,
    })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [count]);
}

export default function ShootingStars({ count = 6, starColor = 'rgba(255,220,140,0.9)' }) {
  const stars = useShootingStarProps(count);

  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          className="shooting-star-wrap"
          style={{
            top:               s.top,
            left:              s.left,
            animationDuration: s.duration,
            animationDelay:    s.delay,
          }}
        >
          <div
            className="shooting-star-line"
            style={{ width: s.width, '--ss-color': starColor }}
          />
        </div>
      ))}
    </>
  );
}
