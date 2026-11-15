'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

const consentKey = 'getup-analytics-consent';
const consentEvent = 'getup:analytics-consent';
const advertisingDenied = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Invisible basic-consent integration. The consent manager dispatches consentEvent. */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const [loadTag, setLoadTag] = useState(false);
  const initialized = useRef(false);
  const granted = useRef(false);

  useEffect(() => {
    if (!id || !/^G-[A-Z0-9]+$/.test(id)) return;
    const disable = (value: boolean) => {
      (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = value;
    };
    const applyConsent = (allow: boolean) => {
      if (allow === granted.current) return;
      granted.current = allow;
      disable(!allow);
      if (!allow) {
        window.gtag?.('consent', 'update', { ...advertisingDenied, analytics_storage: 'denied' });
        return;
      }
      if (!initialized.current) {
        window.dataLayer = window.dataLayer || [];
        // Google’s command queue expects an Arguments object, not a plain array.
        // eslint-disable-next-line prefer-rest-params
        window.gtag = window.gtag || function () { window.dataLayer!.push(arguments); };
        window.gtag('consent', 'default', { ...advertisingDenied, analytics_storage: 'denied' });
        window.gtag('consent', 'update', { ...advertisingDenied, analytics_storage: 'granted' });
        window.gtag('js', new Date());
        // Google owns initial and History API page views. No duplicate router listener.
        window.gtag('config', id, { allow_google_signals: false, allow_ad_personalization_signals: false });
        initialized.current = true;
        setLoadTag(true);
      } else {
        window.gtag?.('consent', 'update', { ...advertisingDenied, analytics_storage: 'granted' });
        // Consent was restored without navigation; record the current page once.
        window.gtag?.('event', 'page_view', { send_to: id });
      }
    };
    const readConsent = () => {
      try { applyConsent(localStorage.getItem(consentKey) === 'granted'); }
      catch { applyConsent(false); }
    };
    const onConsent = (event: Event) => {
      const choice = (event as CustomEvent).detail;
      if (choice !== 'granted' && choice !== 'denied') return;
      try { localStorage.setItem(consentKey, choice); } catch { /* Session-only choice when storage is unavailable. */ }
      applyConsent(choice === 'granted');
    };
    const onStorage = (event: StorageEvent) => { if (event.key === consentKey || event.key === null) readConsent(); };
    if (!initialized.current) disable(true);
    readConsent();
    window.addEventListener(consentEvent, onConsent);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(consentEvent, onConsent);
      window.removeEventListener('storage', onStorage);
    };
  }, [id]);

  return loadTag && id ? <Script id="getup-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" /> : null;
}
