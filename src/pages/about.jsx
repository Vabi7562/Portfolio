import { contact, projects, skills } from '../data/site';

export default function About() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">About</p>
          <h1 className="title">Business analytics, AI strategy, and practical implementation.</h1>
          <p className="lead">
            I am a Business Analytics student at Deakin University helping companies understand where AI creates value,
            where it adds risk, and how to turn adoption into measurable outcomes.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container grid-2">
          <article className="card" style={{ padding: 30 }}>
            <p className="eyebrow">Point of view</p>
            <p style={{ margin: 0, fontFamily: 'Fraunces, Georgia, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.05 }}>
              AI should make businesses more profitable, not just more complex.
            </p>
          </article>
          <div>
            <p className="lead">
              My work combines analytical modelling, dashboard design, and operating strategy. I care about the layer after
              the demo: governance, change management, cost visibility, and the reporting cadence that tells leaders if the
              system is working.
            </p>
            <p className="lead" style={{ marginTop: 18 }}>
              I also build modern websites for businesses that need a sharper digital presence, from focused landing pages to
              custom builds with a distinct identity.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Selected work</p>
          <div className="grid-3">
            {projects.map((project) => (
              <article key={project.title} className="card" style={{ padding: 24 }}>
                <strong style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 48 }}>{project.metric}</strong>
                <p style={{ margin: '4px 0 18px', color: 'var(--teal)', fontSize: 12, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{project.label}</p>
                <h2 style={{ margin: '0 0 10px', fontSize: 20 }}>{project.title}</h2>
                <p style={{ margin: '0 0 18px', color: 'var(--muted)', lineHeight: 1.65 }}>{project.description}</p>
                <ul className="tag-list">
                  {project.stack.map((item) => <li className="tag" key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ borderTop: '1px solid var(--line)' }}>
        <div className="container grid-2">
          <div>
            <p className="eyebrow">Experience</p>
            <h2 className="title" style={{ fontSize: 'clamp(2rem, 4vw, 3.6rem)' }}>From reporting to strategy.</h2>
          </div>
          <div className="card" style={{ padding: 28 }}>
            <p style={{ margin: '0 0 6px', color: 'var(--teal)', fontWeight: 900 }}>Junior Business Analyst</p>
            <h3 style={{ margin: '0 0 12px', fontSize: 24 }}>Pinaz International</h3>
            <p style={{ margin: '0 0 18px', color: 'var(--muted)', fontWeight: 800 }}>Mar 2021 - Jan 2023 / Ludhiana, India</p>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7 }}>
              Authored and maintained weekly Power BI performance dashboards, giving management a clearer view of KPIs for
              strategic decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">Toolkit</p>
          <ul className="tag-list">
            {skills.map((skill) => <li className="tag" key={skill}>{skill}</li>)}
          </ul>
          <div style={{ marginTop: 34, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a className="button" href={`mailto:${contact.email}`}>Email me</a>
            <a className="button secondary" href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </section>
    </main>
  );
}
