'use client';
import { useRef, useState, type FormEvent, type FocusEvent } from 'react';
import Image from 'next/image';

type Field = 'name' | 'email' | 'message';
function fieldError(field: HTMLInputElement | HTMLTextAreaElement) {
  if (!field.value.trim()) return 'Please complete this field.';
  if (field.name === 'email' && field.validity.typeMismatch) return 'Please enter a valid email address.';
  if (field.name === 'message' && field.value.trim().length < 10) return 'Please include at least 10 characters.';
  return field.validity.valid ? '' : field.validationMessage;
}

export function Contact() {
  const [status, setStatus] = useState('');
  const [feedback, setFeedback] = useState<'error' | 'success' | ''>('');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [pending, setPending] = useState(false);
  const submitting = useRef(false);
  function blur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const field = event.currentTarget;
    setErrors(previous => ({ ...previous, [field.name]: fieldError(field) }));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required]')];
    const validation = Object.fromEntries(fields.map(field => [field.name, fieldError(field)]));
    setErrors(validation);
    const invalid = fields.find(field => validation[field.name]);
    if (invalid) { invalid.focus(); setStatus('Please check the highlighted fields.'); setFeedback('error'); return; }
    submitting.current = true;
    setPending(true); setStatus(''); setFeedback('');
    const data = new FormData(form);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(data)) });
      const result = await response.json();
      setFeedback(response.ok ? 'success' : 'error');
      setStatus(result.message || 'Your message could not be sent. Please try again later.');
      if (response.ok) form.reset();
    } catch { setFeedback('error'); setStatus('Unable to connect. Your message has not been sent. Please try again later.'); }
    finally { submitting.current = false; setPending(false); }
  }
  const fieldProps = (name: Field) => ({
    name, onBlur: blur, readOnly: pending,
    'aria-label': { name: 'Name', email: 'Email', message: 'Project message' }[name],
    'aria-invalid': Boolean(errors[name]), 'aria-describedby': `${name}-error`,
    onChange: () => { if (errors[name]) setErrors(previous => ({ ...previous, [name]: '' })); },
  });
  return <section id="contact" className="contact" aria-labelledby="contact-heading"><div className="contact-inner"><div className="contact-title" data-reveal><p className="contact-idea"><Image src="/brand/idea.png" alt="Got an idea?" width={404} height={78} sizes="(min-width: 768px) 240px, 38vw" /></p><h2 id="contact-heading" className="display">Hit Up <span>Get Up</span></h2></div>
    <form className="contact-form" onSubmit={submit} noValidate aria-describedby="form-note" aria-busy={pending}>
      <p className="form-intro" data-reveal>Let’s make something happen.</p><p id="form-note" className="form-note">Form preview — email delivery is not yet connected.</p>
      <div className="form-fields">
        <label>Name<input {...fieldProps('name')} autoComplete="name" required maxLength={120} /><span id="name-error" className="field-error">{errors.name}</span></label>
        <label>Email<input {...fieldProps('email')} type="email" autoComplete="email" required maxLength={254} /><span id="email-error" className="field-error">{errors.email}</span></label>
        <label className="message-field">Project message<textarea {...fieldProps('message')} rows={4} required minLength={10} maxLength={5000} /><span id="message-error" className="field-error">{errors.message}</span></label>
      </div>
      <div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button data-reveal className="submit-button" type="submit" disabled={pending}>{pending ? 'Sending…' : 'Send message'}<span className={pending ? 'sending-indicator' : ''} aria-hidden="true">{pending ? '' : '↗'}</span></button>
      <p className="form-status" data-feedback={feedback} role="status" aria-live="polite" aria-atomic="true">{status}</p>
    </form></div></section>;
}
