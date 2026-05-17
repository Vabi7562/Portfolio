import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { contact, services } from '../data/site';

emailjs.init('_pumMWUNxLUsyOJgP');

function Field({ label, value, onChange, type = 'text', multiline = false, placeholder = '' }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label style={{ display: 'grid', gap: 8 }}>
      <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</span>
      <Tag
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={multiline ? 6 : undefined}
        placeholder={placeholder}
        style={{
          width: '100%',
          border: '1px solid var(--line)',
          borderRadius: 8,
          background: 'rgba(255,252,244,0.72)',
          color: 'var(--ink)',
          outline: 'none',
          padding: '14px 15px',
          resize: multiline ? 'vertical' : 'none',
        }}
      />
    </label>
  );
}

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSend = async (event) => {
    event.preventDefault();
    if (!message.trim()) return;

    setStatus('sending');
    try {
      await emailjs.send('service_ofelsbu', 'template_00r88lq', {
        from_name: name.trim() || 'Anonymous',
        reply_to: email.trim(),
        message: message.trim(),
      });
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1 className="title">Bring the messy brief.</h1>
          <p className="lead">
            Tell me what you are trying to improve, measure, automate, or launch. I will reply within 24 hours with a useful
            next step.
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="container grid-2" style={{ alignItems: 'start' }}>
          <aside>
            <div className="card" style={{ padding: 28, marginBottom: 18 }}>
              <p className="eyebrow">Direct</p>
              <a href={`mailto:${contact.email}`} style={{ display: 'block', marginBottom: 12, fontFamily: 'Fraunces, Georgia, serif', fontSize: 30, textDecoration: 'none' }}>
                {contact.email}
              </a>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7 }}>Based in {contact.location}. Available for AI strategy, analytics, and focused web projects.</p>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <p className="eyebrow">Good briefs include</p>
              <ul style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
                {services.map((service) => (
                  <li key={service.id} style={{ color: 'var(--muted)', fontWeight: 700 }}>
                    <span style={{ color: 'var(--brass)', marginRight: 8 }}>{service.id}</span>
                    {service.title}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <form className="card" onSubmit={handleSend} style={{ padding: 28, display: 'grid', gap: 18 }}>
            <Field label="Name" value={name} onChange={setName} placeholder="Your name" />
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
            <Field label="Message" value={message} onChange={setMessage} multiline placeholder="What are you trying to build, fix, or understand?" />
            <button className="button" type="submit" disabled={status === 'sending'} style={{ width: 'fit-content' }}>
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </button>
            {status === 'sent' && <p style={{ margin: 0, color: 'var(--teal)', fontWeight: 800 }}>Message sent. I will get back to you soon.</p>}
            {status === 'error' && <p style={{ margin: 0, color: 'var(--danger)', fontWeight: 800 }}>Something failed. You can email me directly instead.</p>}
          </form>
        </div>
      </section>
    </main>
  );
}
