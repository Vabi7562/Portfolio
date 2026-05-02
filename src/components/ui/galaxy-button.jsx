import React, { useMemo } from 'react';
import './galaxy-button.css';

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

function useStarStyles(count, isStatic) {
  return useMemo(() => {
    return Array.from({ length: count }, () => ({
      '--angle':    rand(0, 360),
      '--duration': rand(6, 20),
      '--delay':    rand(1, 10),
      '--alpha':    rand(40, 90) / 100,
      '--size':     isStatic ? rand(2, 4) : rand(2, 6),
      '--distance': isStatic ? rand(20, 80) : rand(40, 200),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export function GalaxyButton({ children, hue = 245, className = '', ...props }) {
  const orbitStars  = useStarStyles(20, false);
  const staticStars = useStarStyles(4,  true);

  return (
    <div className={`galaxy-button ${className}`} style={{ '--hue': hue }}>
      <button {...props}>
        <span className="spark" />
        <span className="backdrop" />

        <span className="galaxy__container">
          {staticStars.map((s, i) => (
            <span key={i} className="star star--static" style={s} />
          ))}
        </span>

        <span className="galaxy">
          <span className="galaxy__ring">
            {orbitStars.map((s, i) => (
              <span key={i} className="star" style={s} />
            ))}
          </span>
        </span>

        <span className="gb-text">{children}</span>
      </button>
    </div>
  );
}
