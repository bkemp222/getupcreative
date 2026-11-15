'use client';
import { useRef, useState, type FormEvent, type FocusEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { trackConfirmedLead } from '@/lib/analytics-client';

type Field = 'name' | 'email' | 'message' | 'neededBy';
function fieldError(field: HTMLInputElement | HTMLTextAreaElement) {
  if (!field.value.trim() && field.name !== 'neededBy') return 'Please complete this field.';
  if (field.name === 'email' && field.validity.typeMismatch) return 'Please enter a valid email address.';
  if (field.name === 'message' && field.value.trim().length < 10) return 'Please include at least 10 characters.';
  return field.validity.valid ? '' : field.validationMessage;
}

export function Contact() {
  const router = useRouter();
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
    const fields = [...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[required], input[name="neededBy"]')];
    const validation = Object.fromEntries(fields.map(field => [field.name, fieldError(field)]));
    setErrors(validation);
    const invalid = fields.find(field => validation[field.name]);
    if (invalid) { invalid.focus(); setStatus('Please check the highlighted fields.'); setFeedback('error'); return; }
    submitting.current = true;
    setPending(true); setStatus(''); setFeedback('');
    const data = new FormData(form);
    let confirmed = false;
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(data)) });
      const result = await response.json();
      if (response.ok) {
        // The API must only return success after the delivery provider accepts the message.
        trackConfirmedLead(result.receipt);
        form.reset();
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        router.push('/thank-you', { scroll: false });
        confirmed = true;
        return;
      }
      setFeedback('error');
      setStatus(result.message || 'Your message could not be sent. Please try again later.');
    } catch { setFeedback('error'); setStatus('Unable to confirm your submission. Please try again later or email brad@getupcreative.com directly.'); }
    finally { if (!confirmed) { submitting.current = false; setPending(false); } }
  }
  const fieldProps = (name: Field) => ({
    name, onBlur: blur, readOnly: pending,
    'aria-label': { name: 'Your name', email: 'Your email', message: "What's the big idea?", neededBy: "When's it happening? (optional)" }[name],
    'aria-invalid': Boolean(errors[name]), 'aria-describedby': `${name}-error`,
    onChange: () => { if (errors[name]) setErrors(previous => ({ ...previous, [name]: '' })); },
  });
  return <section id="contact" className="contact" aria-labelledby="contact-heading"><div className="contact-inner"><div className="contact-title" data-reveal><p className="contact-idea"><Image src="/brand/idea.png" alt="Got an idea?" width={404} height={78} sizes="(min-width: 768px) 240px, 38vw" /></p><h2 id="contact-heading" className="display">Hit Up <span>Get Up</span></h2></div>
    <form className="contact-form" onSubmit={submit} noValidate aria-busy={pending}>
      <div className="form-fields">
        <label><span className="field-title"><span className="field-number" aria-hidden="true">01 /</span> Your name</span><input {...fieldProps('name')} autoComplete="name" required maxLength={120} /><span id="name-error" className="field-error">{errors.name}</span></label>
        <label><span className="field-title"><span className="field-number" aria-hidden="true">02 /</span> Your email</span><input {...fieldProps('email')} type="email" autoComplete="email" required maxLength={254} /><span id="email-error" className="field-error">{errors.email}</span></label>
        <label className="message-field"><span className="field-title"><span className="field-number" aria-hidden="true">03 /</span> What&apos;s the big idea?</span><textarea {...fieldProps('message')} rows={4} required minLength={10} maxLength={5000} /><span id="message-error" className="field-error">{errors.message}</span></label>
        <label className="message-field"><span className="field-title"><span className="field-number" aria-hidden="true">04 /</span> When&apos;s it happening? <span className="date-optional">(optional)</span></span><input {...fieldProps('neededBy')} type="date" max="9999-12-31" /><span id="neededBy-error" className="field-error">{errors.neededBy}</span></label>
      </div>
      <div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button data-reveal className="submit-button" type="submit" disabled={pending}><span className="submit-label">{pending ? 'Sending…' : 'Send message'}</span><span className="submit-icon" aria-hidden="true">{pending ? <span className="sending-indicator" /> : <svg viewBox="0 0 24 24" fill="none"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="2" strokeLinecap="square" /></svg>}</span></button>
      <p className="form-status" data-feedback={feedback} role="status" aria-live="polite" aria-atomic="true">{status}</p>
    </form></div></section>;
}
