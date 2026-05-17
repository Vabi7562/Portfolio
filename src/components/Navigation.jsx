import { Link, NavLink, useLocation } from 'react-router-dom';
import { contact } from '../data/site';
import svLogo from '../assets/sv-logo.png';

const navItems = [
  { label: 'Work', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Contact', path: '/contact' },
];

export default function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        borderBottom: '1px solid rgba(18,18,15,0.12)',
        background: 'rgba(244,240,231,0.82)',
        backdropFilter: 'blur(18px) saturate(135%)',
        WebkitBackdropFilter: 'blur(18px) saturate(135%)',
      }}
    >
      <nav
        className="container"
        aria-label="Main navigation"
        style={{
          height: 74,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
        }}
      >
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', minWidth: 0 }}
        >
          <img src={svLogo} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} />
          <span style={{ display: 'grid', lineHeight: 1.05 }}>
            <strong style={{ fontSize: 13, letterSpacing: '0.02em' }}>{contact.name}</strong>
            <span style={{ color: 'var(--muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AI strategy / analytics
            </span>
          </span>
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            border: '1px solid rgba(18,18,15,0.12)',
            borderRadius: 999,
            padding: 4,
            background: 'rgba(255,252,244,0.58)',
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.scrollTo(0, 0)}
              style={({ isActive }) => ({
                minHeight: 34,
                display: 'inline-flex',
                alignItems: 'center',
                borderRadius: 999,
                padding: '0 13px',
                color: isActive || (isHome && item.path === '/') ? 'var(--paper)' : 'var(--muted)',
                background: isActive || (isHome && item.path === '/') ? 'var(--ink)' : 'transparent',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.04em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'background 180ms ease, color 180ms ease',
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <a className="button secondary" href={`mailto:${contact.email}`} style={{ minHeight: 38, padding: '0 14px' }}>
          Start a brief
        </a>
      </nav>
    </header>
  );
}
