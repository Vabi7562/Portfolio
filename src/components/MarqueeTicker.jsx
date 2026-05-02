import React from 'react';

const ITEMS = [
  'Sabharwal Ventures',
  '✦',
  'Email App',
  '✦',
  'Photography',
  '✦',
  'Ecosystem',
  '✦',
  'Building things worth using',
  '✦',
  'In orbit',
  '✦',
  'Est. 2024',
  '✦',
];

const TICKER_CSS = `
  .marquee-outer {
    overflow: hidden;
    width: 100%;
    mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
    -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
  }
  .marquee-track {
    display: flex;
    width: max-content;
    animation: marquee-scroll 28s linear infinite;
  }
  .marquee-track:hover { animation-play-state: paused; }
  @keyframes marquee-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .marquee-item {
    font-family: Archivo, sans-serif;
    font-size: 0.65rem;
    font-weight: 300;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(240,235,224,0.25);
    white-space: nowrap;
    padding: 0 2rem;
    transition: color 0.3s ease;
  }
  .marquee-item.marquee-dot {
    color: rgba(244,201,106,0.35);
    padding: 0 0.5rem;
    letter-spacing: 0;
  }
  .marquee-outer:hover .marquee-item { color: rgba(240,235,224,0.4); }
`;

export default function MarqueeTicker({ style }) {
  // Duplicate items to create seamless loop
  const allItems = [...ITEMS, ...ITEMS];

  return (
    <>
      <style>{TICKER_CSS}</style>
      <div className="marquee-outer" style={style}>
        <div className="marquee-track">
          {allItems.map((item, i) => (
            <span
              key={i}
              className={`marquee-item${item === '✦' ? ' marquee-dot' : ''}`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
