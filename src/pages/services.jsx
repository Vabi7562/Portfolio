import { Link } from 'react-router-dom';
import { services } from '../data/site';

const process = [
  ['01', 'Diagnose', 'Map goals, current systems, data maturity, spend, and the decision-makers who need proof.'],
  ['02', 'Design', 'Create the operating model, dashboard, rollout plan, or website structure around a clear outcome.'],
  ['03', 'Implement', 'Build the useful pieces, document the workflow, and make sure the handoff is practical.'],
  ['04', 'Measure', 'Track adoption, ROI, risk, conversion, or reporting speed so the work keeps earning its place.'],
];

export default function Services() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Services</p>
          <h1 className="title">Clear offers for messy AI and analytics problems.</h1>
          <p className="lead">
            Choose a focused engagement, or use these as starting points for a custom brief. Each service is designed to
            produce something usable, measurable, and easy to explain.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container grid-2">
          {services.map((service) => (
            <article key={service.id} className="card" style={{ padding: 30 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 34 }}>
                <span style={{ color: 'var(--brass)', fontWeight: 900 }}>{service.id}</span>
                <span style={{ color: 'var(--teal)', fontSize: 12, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{service.kicker}</span>
              </div>
              <h2 style={{ margin: '0 0 12px', fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 0.96 }}>{service.title}</h2>
              <p style={{ margin: '0 0 22px', color: 'var(--muted)', lineHeight: 1.7 }}>{service.description}</p>
              <ul style={{ display: 'grid', gap: 10, margin: '0 0 26px', padding: 0, listStyle: 'none' }}>
                {service.points.map((point) => (
                  <li key={point} style={{ display: 'flex', gap: 10, color: 'var(--muted)', fontWeight: 700 }}>
                    <span style={{ color: 'var(--teal)' }}>+</span>
                    {point}
                  </li>
                ))}
              </ul>
              <strong>{service.price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--charcoal)', color: 'var(--paper)' }}>
        <div className="container">
          <p className="eyebrow" style={{ color: '#d2a65f' }}>Process</p>
          <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 18 }}>
            {process.map(([id, title, text]) => (
              <article key={id} style={{ borderTop: '1px solid rgba(244,240,231,0.22)', paddingTop: 22 }}>
                <span style={{ color: '#d2a65f', fontWeight: 900 }}>{id}</span>
                <h2 style={{ margin: '18px 0 10px', fontSize: 22 }}>{title}</h2>
                <p style={{ margin: 0, color: 'rgba(244,240,231,0.66)', lineHeight: 1.65 }}>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <h2 className="title" style={{ fontSize: 'clamp(2rem, 4vw, 3.6rem)' }}>Have a strange problem?</h2>
          <div>
            <p className="lead">
              Good. The most useful engagements usually start with a specific frustration: AI spend is invisible, reporting is
              slow, adoption is vague, or the website no longer matches the business.
            </p>
            <Link className="button" to="/contact" style={{ marginTop: 24 }}>Start a brief</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
