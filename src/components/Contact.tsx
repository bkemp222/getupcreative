'use client';
import { useState, type FormEvent } from 'react';
import Image from 'next/image';
export function Contact() {
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setStatus('');
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(data)) });
      const result = await response.json();
      setStatus(result.message || 'Your message could not be sent. Please try again later.');
      if (response.ok) form.reset();
    } catch { setStatus('Unable to connect. Your message has not been sent. Please try again later.'); }
    finally { setPending(false); }
  }
  return <section id="contact" className="contact" aria-labelledby="contact-heading"><div className="contact-inner"><div className="contact-title"><p className="contact-idea"><Image src="/brand/idea.png" alt="Got an idea?" width={404} height={78} sizes="(min-width: 768px) 240px, 38vw" /></p><h2 id="contact-heading" className="display">Hit Up <span>Get Up</span></h2></div>
    <form className="contact-form" onSubmit={submit} aria-describedby="form-note">
      <p className="form-intro">Let’s make something happen.</p><p id="form-note" className="form-note">Form preview — email delivery is not yet connected.</p>
      <div className="form-fields"><label>Name<input name="name" autoComplete="name" required maxLength={120} /></label><label>Email<input name="email" type="email" autoComplete="email" required maxLength={254} /></label><label className="message-field">Project message<textarea name="message" rows={4} required minLength={10} maxLength={5000} /></label></div>
      <div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button className="submit-button" type="submit" disabled={pending}>{pending ? 'Sending…' : 'Send message'}<span aria-hidden="true">↗</span></button><p className="form-status" role="status" aria-live="polite">{status}</p>
    </form></div></section>;
}
