'use client';

import { useState, useSyncExternalStore } from 'react';
import styles from './AnalyticsConsent.module.css';

const key = 'getup-analytics-consent';
const eventName = 'getup:analytics-consent';
let sessionChoice: string | null = null;
function snapshot() {
  try { const value = localStorage.getItem(key); return value === 'granted' || value === 'denied' ? value : sessionChoice; }
  catch { return sessionChoice; }
}
function subscribe(listener: () => void) {
  window.addEventListener(eventName, listener);
  window.addEventListener('storage', listener);
  return () => { window.removeEventListener(eventName, listener); window.removeEventListener('storage', listener); };
}
// Server snapshot prevents a consent prompt flashing for returning visitors.
function serverSnapshot() { return 'pending'; }

export function AnalyticsConsent() {
  const choice = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [editing, setEditing] = useState(false);
  if (!process.env.NEXT_PUBLIC_GA_ID || choice === 'pending') return null;
  function choose(value: 'granted' | 'denied') {
    sessionChoice = value;
    try { localStorage.setItem(key, value); } catch { /* Retain the choice for this session. */ }
    window.dispatchEvent(new CustomEvent(eventName, { detail: value }));
    setEditing(false);
  }
  if (choice && !editing) return <button className={styles.preferences} onClick={() => setEditing(true)} type="button">Privacy settings</button>;
  return <section className={styles.banner} aria-labelledby="analytics-consent-heading">
    <div><h2 id="analytics-consent-heading">A little insight helps us improve.</h2><p>May we use Google Analytics cookies to understand visits to our site? Optional analytics stays off until you accept. Advertising tracking stays off. You can change your choice in Privacy settings.</p></div>
    <div className={styles.actions}>
      <button type="button" onClick={() => choose('denied')}>Decline</button>
      <button type="button" onClick={() => choose('granted')}>Accept analytics</button>
    </div>
  </section>;
}
