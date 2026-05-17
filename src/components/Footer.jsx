import { Link } from 'react-router-dom';
import { contact } from '../data/site';

const pages = [
  ['Work', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Contact', '/contact'],
  ['Aero Mail', '/email'],
  ['Photography', '/photography'],
];

export default function Footer() {
  return (
    <footer className="section-tight" style={{ borderTop: '1px solid var(--line)' }}>
      <div className="container">
        <div className="grid-3" style={{ alignItems: 'start' }}>
          <div>
            <p className="eyebrow">Sabharwal Ventures</p>
            <h2 className="title" style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>
              Build the useful layer.
            </h2>
          </div>

          <div>
            <p style={{ margin: '0 0 16px', fontWeight: 800 }}>Pages</p>
            <div style={{ display: 'grid', gap: 10 }}>
              {pages.map(([label, path]) => (
                <Link key={path} to={path} onClick={() => window.scrollTo(0, 0)} style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 700 }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p style={{ margin: '0 0 16px', fontWeight: 800 }}>Connect</p>
            <div style={{ display: 'grid', gap: 10 }}>
              <a href={`mailto:${contact.email}`} style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 700 }}>{contact.email}</a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 700 }}>LinkedIn</a>
              <a href={contact.github} target="_blank" rel="noreferrer" style={{ color: 'var(--muted)', textDecoration: 'none', fontWeight: 700 }}>GitHub</a>
            </div>
          </div>
        </div>

        <div className="rule" style={{ margin: '46px 0 22px' }} />
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13, fontWeight: 700 }}>
          © {new Date().getFullYear()} {contact.name}. Available in {contact.location}.
        </p>
      </div>
    </footer>
  );
}
