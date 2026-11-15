import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { site } from '@/lib/site';
export async function POST(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 16000) return NextResponse.json({ message: 'Message is too large.' }, { status: 413 });
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return NextResponse.json({ message: 'Please provide a valid message.' }, { status: 400 }); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return NextResponse.json({ message: 'Please provide a valid message.' }, { status: 400 });
  const { name, email, message, website, neededBy } = data;
  if (website) return NextResponse.json({ message: 'Unable to send this message.' }, { status: 400 });
  if (typeof name !== 'string' || !name.trim() || name.length > 120 || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof message !== 'string' || message.trim().length < 10 || message.length > 5000) {
    return NextResponse.json({ message: 'Please enter your name, a valid email, and a project message of at least 10 characters.' }, { status: 400 });
  }
  if (neededBy !== undefined && neededBy !== '') {
    const date = typeof neededBy === 'string' && /^[1-9]\d{3}-\d{2}-\d{2}$/.test(neededBy) ? new Date(`${neededBy}T00:00:00.000Z`) : null;
    if (!date || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== neededBy) {
      return NextResponse.json({ message: 'Please choose a valid date for when you need it.' }, { status: 400 });
    }
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !from) {
    return NextResponse.json({ message: `The contact form is temporarily unavailable. Please email ${site.email} directly.` }, { status: 503 });
  }
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [site.email],
        reply_to: email.trim(),
        subject: `New Get Up Creative inquiry from ${name.trim().replace(/[\r\n]+/g, ' ')}`,
        text: `New website inquiry\n\nName: ${name.trim()}\nEmail: ${email.trim()}\nWhen's the big idea?: ${neededBy || 'Not specified'}\n\nWhat's the big idea?\n${message.trim()}`,
      }),
      signal: AbortSignal.timeout(10000),
      cache: 'no-store',
    });
    const result = await response.json();
    if (!response.ok || typeof result.id !== 'string' || !result.id) {
      return NextResponse.json({ message: `Your message could not be sent. Please try again or email ${site.email} directly.` }, { status: 502 });
    }
    // Provider acceptance is the confirmation required for the thank-you redirect.
    return NextResponse.json({ message: 'Message received. Thank you for reaching out.', receipt: randomUUID() });
  } catch {
    return NextResponse.json({ message: `We couldn't confirm your submission. Please email ${site.email} directly if this continues.` }, { status: 502 });
  }
}
