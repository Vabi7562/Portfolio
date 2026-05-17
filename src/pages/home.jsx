import { Link } from 'react-router-dom';
import { contact, projects, services, ventures } from '../data/site';

function Metric({ value, label }) {
  return (
    <div>
      <strong style={{ display: 'block', fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 5vw, 4.6rem)', lineHeight: 0.9 }}>
        {value}
      </strong>
      <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <section className="page-hero" style={{ minHeight: '92vh', display: 'grid', alignItems: 'center' }}>
        <div className="container">
          <div>
            <p className="eyebrow">Available in {contact.location}</p>
            <h1 className="display">
              AI strategy with numbers attached.
            </h1>
            <div className="grid-2" style={{ marginTop: 34, alignItems: 'end' }}>
              <p className="lead">
                I help businesses turn AI experiments into measurable systems: cost tracking, adoption roadmaps,
                dashboards, and websites that explain the work clearly.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Link className="button" to="/services">See services</Link>
                <Link className="button secondary" to="/contact">Start a project</Link>
              </div>
            </div>
          </div>

          <div className="grid-3" style={{ marginTop: 72 }}>
            <Metric value="92%" label="prediction accuracy" />
            <Metric value="50K+" label="records modelled" />
            <Metric value="12wk" label="AI rollout frame" />
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <div>
            <p className="eyebrow">Operating thesis</p>
            <h2 className="title">AI should make the business easier to run.</h2>
          </div>
          <p className="lead">
            The gap is rarely “more tools.” It is measurement, adoption, and communication. My work sits between analytics,
            strategy, and implementation so the technology has a business case before it has a budget problem.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'end', marginBottom: 28, flexWrap: 'wrap' }}>
            <div>
              <p className="eyebrow">Services</p>
              <h2 className="title">Ways to work together.</h2>
            </div>
            <Link className="button secondary" to="/services">Full menu</Link>
          </div>

          <div className="grid-2">
            {services.map((service) => (
              <article key={service.id} className="card" style={{ padding: 26 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 42 }}>
                  <span style={{ color: 'var(--brass)', fontWeight: 900 }}>{service.id}</span>
                  <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {service.kicker}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 12px', fontFamily: 'Fraunces, Georgia, serif', fontSize: 34, lineHeight: 1 }}>{service.title}</h3>
                <p style={{ margin: '0 0 24px', color: 'var(--muted)', lineHeight: 1.7 }}>{service.description}</p>
                <strong>{service.price}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: 'var(--charcoal)', color: 'var(--paper)' }}>
        <div className="container">
          <p className="eyebrow" style={{ color: '#d2a65f' }}>Proof points</p>
          <div className="grid-3">
            {projects.map((project) => (
              <article key={project.title} style={{ borderTop: '1px solid rgba(244,240,231,0.22)', paddingTop: 22 }}>
                <strong style={{ display: 'block', fontFamily: 'Fraunces, Georgia, serif', fontSize: 56, lineHeight: 0.95 }}>{project.metric}</strong>
                <p style={{ margin: '8px 0 20px', color: 'rgba(244,240,231,0.58)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 12 }}>{project.label}</p>
                <h3 style={{ margin: '0 0 10px', fontSize: 18 }}>{project.title}</h3>
                <p style={{ margin: 0, color: 'rgba(244,240,231,0.68)', lineHeight: 1.65 }}>{project.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Ventures</p>
          <div className="grid-2">
            {ventures.map((venture) => (
              <Link key={venture.name} to={venture.path} className="card" style={{ padding: 28, color: 'inherit', textDecoration: 'none' }}>
                <span style={{ color: 'var(--teal)', fontWeight: 900, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{venture.status}</span>
                <h2 style={{ margin: '18px 0 10px', fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 4rem)', lineHeight: 0.95 }}>{venture.name}</h2>
                <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7 }}>{venture.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
