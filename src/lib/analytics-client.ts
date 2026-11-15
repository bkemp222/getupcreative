'use client';

import type { AnalyticsPolicy } from './analytics-policy';

type Preference = 'granted' | 'denied' | null;
type Status = 'checking' | 'off' | 'loading' | 'on' | 'unavailable';
export type AnalyticsState = { allowed: boolean; preference: Preference; status: Status; reason: 'checking' | 'preference' | 'gpc' | 'unconfigured' | AnalyticsPolicy['reason'] };
const id = process.env.NEXT_PUBLIC_GA_ID;
const key = 'getup-analytics-consent';
const eventName = 'getup:analytics-consent';
const advertisingDenied = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
const initial: AnalyticsState = { allowed: false, preference: null, status: 'checking', reason: 'checking' };
let state = initial;
let started = false;
let resolved = false;
let initialized = false;
let loaded = false;
let failed = false;
let preference: Preference = null;
let policy: AnalyticsPolicy = { defaultAllowed: false, reason: 'unknown', globalPrivacyControl: false };
const listeners = new Set<() => void>();
const handledLeads = new Set<string>();
const pendingLeads = new Set<string>();
const leadStorageKey = 'getup-handled-leads';

function flushLeads() {
  if (!state.allowed || !loaded || failed || hasGpc() || !window.gtag) return;
  for (const receipt of pendingLeads) {
    pendingLeads.delete(receipt);
    // Deliberately omit the receipt, form fields, value, and user-provided data.
    window.gtag('event', 'generate_lead', { send_to: id });
  }
}

export function trackConfirmedLead(receipt: unknown) {
  // Measurement must never interrupt a successful inquiry or its redirect.
  try {
    if (typeof receipt !== 'string' || !/^[a-f0-9-]{36}$/i.test(receipt)) return;
    let saved: string[] = [];
    try {
      const value: unknown = JSON.parse(sessionStorage.getItem(leadStorageKey) || '[]');
      if (Array.isArray(value)) saved = value.filter((item): item is string => typeof item === 'string');
    } catch { /* In-memory duplicate protection remains available. */ }
    if (handledLeads.has(receipt) || saved.includes(receipt)) return;
    handledLeads.add(receipt);
    preference = readPreference();
    update();
    // Never replay an inquiry submitted without permission after a later opt-in.
    if (!state.allowed || failed || hasGpc()) return;
    try { sessionStorage.setItem(leadStorageKey, JSON.stringify([...saved, receipt].slice(-100))); } catch { /* Optional storage. */ }
    pendingLeads.add(receipt);
    flushLeads();
  } catch { /* Analytics is best-effort; form success is independent. */ }
}

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; }
}
export function getAnalyticsState() { return state; }
export function getServerAnalyticsState() { return initial; }
export function subscribeAnalytics(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
function readPreference(): Preference {
  try { const saved = localStorage.getItem(key); return saved === 'granted' || saved === 'denied' ? saved : null; }
  catch { return preference; }
}
function hasGpc() { return policy.globalPrivacyControl || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true; }
function update() {
  const configured = Boolean(id && /^G-[A-Z0-9]+$/.test(id));
  const gpc = hasGpc();
  const allowed = configured && resolved && !gpc && preference !== 'denied' && (preference === 'granted' || policy.defaultAllowed);
  if (!allowed) pendingLeads.clear();
  // Set synchronously, before rendering or queuing commands, including on opt-out.
  if (id) (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = !allowed;
  if (allowed && !state.allowed) {
    if (!initialized) {
      window.dataLayer = window.dataLayer || [];
      // Google's command queue uses Arguments objects.
      // eslint-disable-next-line prefer-rest-params
      window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
      window.gtag('consent', 'default', { ...advertisingDenied, analytics_storage: 'denied' });
      window.gtag('consent', 'update', { ...advertisingDenied, analytics_storage: 'granted' });
      window.gtag('js', new Date());
      window.gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });
      initialized = true;
    } else {
      window.gtag?.('consent', 'update', { ...advertisingDenied, analytics_storage: 'granted' });
      // No route listener: Google's enhanced history measurement owns navigation views.
      window.gtag?.('event', 'page_view', { send_to: id });
    }
  } else if (!allowed && state.allowed) {
    window.gtag?.('consent', 'update', { ...advertisingDenied, analytics_storage: 'denied' });
  }
  const next: AnalyticsState = {
    allowed, preference,
    status: !configured ? 'unavailable' : !resolved ? 'checking' : !allowed ? 'off' : failed ? 'unavailable' : loaded ? 'on' : 'loading',
    reason: !configured ? 'unconfigured' : gpc ? 'gpc' : !resolved ? 'checking' : preference ? 'preference' : policy.reason,
  };
  if (JSON.stringify(next) !== JSON.stringify(state)) { state = next; listeners.forEach(listener => listener()); }
}
export function setAnalyticsPreference(value: Exclude<Preference, null>) {
  preference = value;
  try { localStorage.setItem(key, value); } catch { /* Keep a session choice if storage is unavailable. */ }
  update();
}
export function analyticsLoaded() { loaded = true; failed = false; update(); flushLeads(); }
export function analyticsFailed() { failed = true; pendingLeads.clear(); update(); }
export function startAnalytics() {
  if (started) return;
  started = true;
  preference = readPreference();
  update();
  window.addEventListener(eventName, event => {
    const value = (event as CustomEvent).detail;
    if (value === 'granted' || value === 'denied') setAnalyticsPreference(value);
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) { preference = readPreference(); update(); }
  });
  // Re-check browser privacy signals when a background tab becomes active.
  window.addEventListener('focus', update);
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) { resolved = true; update(); return; }
  void fetch('/api/analytics-policy', { cache: 'no-store', credentials: 'same-origin', signal: AbortSignal.timeout(5000) })
    .then(async response => {
      if (!response.ok) throw new Error('Policy unavailable');
      const result = await response.json();
      if (typeof result.globalPrivacyControl !== 'boolean' || typeof result.defaultAllowed !== 'boolean' || !['us-default', 'opt-in', 'unknown'].includes(result.reason)) throw new Error('Invalid policy');
      policy = { defaultAllowed: result.defaultAllowed === true && result.reason === 'us-default', reason: result.reason, globalPrivacyControl: result.globalPrivacyControl };
    })
    .catch(() => { policy = { defaultAllowed: false, reason: 'unknown', globalPrivacyControl: false }; })
    .finally(() => { resolved = true; update(); });
}
