'use client';

import { useSyncExternalStore } from 'react';
import { getAnalyticsState, getServerAnalyticsState, setAnalyticsPreference, subscribeAnalytics } from '@/lib/analytics-client';
import styles from './PrivacySettings.module.css';

export function PrivacySettings() {
  const state = useSyncExternalStore(subscribeAnalytics, getAnalyticsState, getServerAnalyticsState);
  const status = state.status === 'checking' ? 'Analytics is off while we check your regional settings.'
    : state.status === 'loading' ? 'Analytics is allowed and loading.'
    : state.status === 'on' ? 'Analytics is on.'
    : state.status === 'unavailable' ? 'Analytics is not loaded or is unavailable in this browser.'
    : 'Analytics is off.';
  return <section id="privacy-settings" className={styles.settings} aria-labelledby="privacy-settings-heading">
    <h2 id="privacy-settings-heading">Privacy settings</h2>
    <p>Google Analytics helps us understand website visits. It may be on by default in eligible U.S. regions; elsewhere, or when your region is uncertain, it waits for your permission. Advertising tracking stays off.</p>
    <p role="status" aria-live="polite">{status} {state.reason === 'gpc' ? 'Your browser’s Global Privacy Control signal is being respected.' : state.preference === 'denied' ? 'Your opt-out is saved.' : state.preference === 'granted' ? 'Your permission is saved.' : state.reason === 'us-default' ? 'The default for your region allows analytics.' : ''}</p>
    <div className={styles.actions}>
      <button type="button" aria-pressed={state.preference === 'denied'} onClick={() => setAnalyticsPreference('denied')}>Disable analytics</button>
      <button type="button" disabled={state.reason === 'gpc'} aria-pressed={state.preference === 'granted' && state.reason !== 'gpc'} onClick={() => setAnalyticsPreference('granted')}>Allow analytics</button>
    </div>
    <p className={styles.note}>Your choice applies to this browser. Disabling analytics stops future collection through this site; it does not erase previously collected data or existing Google cookies. You can also clear cookies through your browser settings.</p>
  </section>;
}
