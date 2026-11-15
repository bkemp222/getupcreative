import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  if (Number(request.headers.get('content-length') || 0) > 16000) return NextResponse.json({ message: 'Message is too large.' }, { status: 413 });
  let data: Record<string, unknown>;
  try { data = await request.json(); } catch { return NextResponse.json({ message: 'Please provide a valid message.' }, { status: 400 }); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return NextResponse.json({ message: 'Please provide a valid message.' }, { status: 400 });
  const { name, email, message, website } = data;
  if (website) return NextResponse.json({ message: 'Unable to send this message.' }, { status: 400 });
  if (typeof name !== 'string' || !name.trim() || name.length > 120 || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof message !== 'string' || message.trim().length < 10 || message.length > 5000) {
    return NextResponse.json({ message: 'Please enter your name, a valid email, and a project message of at least 10 characters.' }, { status: 400 });
  }
  // Integration point: add a server-only email provider, rate limiting and spam verification.
  // Never return a success status until the provider confirms delivery acceptance.
  return NextResponse.json({ message: 'Email delivery is not connected yet. Your message has not been sent.' }, { status: 503 });
}
