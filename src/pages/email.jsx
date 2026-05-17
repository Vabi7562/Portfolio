import { Link } from 'react-router-dom';

const features = [
  ['AI triage', 'Prioritise messages by urgency, sender, and required action.'],
  ['Smart summaries', 'Turn long threads into brief, readable next steps.'],
  ['Private workflows', 'Design for local-first assistance and minimal data exposure.'],
  ['Daily digest', 'Start the day with what changed, what matters, and what can wait.'],
];

export default function Email() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Venture / Aero Mail</p>
          <h1 className="title">Email rebuilt around attention, not inbox archaeology.</h1>
          <p className="lead">
            Aero Mail is an in-progress product concept for an AI-assisted email client: summaries, triage, smart replies,
            and calmer daily workflows.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container grid-2" style={{ alignItems: 'center' }}>
          <div className="card" style={{ padding: 18 }}>
            <div style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden', background: '#fffaf0' }}>
              <div style={{ display: 'flex', gap: 7, padding: 14, borderBottom: '1px solid var(--line)' }}>
                {['#a84a35', '#b78535', '#1e7168'].map((color) => <span key={color} style={{ width: 10, height: 10, borderRadius: 99, background: color }} />)}
              </div>
              {[
                ['Investor update', 'Needs a reply by 2pm. Draft asks for revised metrics.'],
                ['Weekly analytics', 'No action needed. Revenue dashboard is attached.'],
                ['Partnership intro', 'High-fit contact. Suggests a short discovery call.'],
              ].map(([from, summary]) => (
                <div key={from} style={{ padding: 18, borderBottom: '1px solid var(--line)' }}>
                  <strong>{from}</strong>
                  <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>{summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Product idea</p>
            <h2 className="title" style={{ fontSize: 'clamp(2rem, 4vw, 3.8rem)' }}>A calmer command center for communication.</h2>
            <p className="lead" style={{ marginTop: 20 }}>
              The interface goal is simple: make the next action obvious without making email feel like another dashboard.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          {features.map(([title, text]) => (
            <article className="card" key={title} style={{ padding: 26 }}>
              <h2 style={{ margin: '0 0 10px', fontFamily: 'Fraunces, Georgia, serif', fontSize: 34 }}>{title}</h2>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7 }}>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <Link className="button secondary" to="/">Back to portfolio</Link>
        </div>
      </section>
    </main>
  );
}
