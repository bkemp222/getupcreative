'use client';

import Script from 'next/script';
import { useEffect, useSyncExternalStore } from 'react';
import { analyticsFailed, analyticsLoaded, getAnalyticsState, getServerAnalyticsState, startAnalytics, subscribeAnalytics } from '@/lib/analytics-client';

export function GoogleAnalytics() {
  const state = useSyncExternalStore(subscribeAnalytics, getAnalyticsState, getServerAnalyticsState);
  const id = process.env.NEXT_PUBLIC_GA_ID;
  useEffect(startAnalytics, []);
  return state.allowed && id ? <Script id="getup-google-analytics" src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" onReady={analyticsLoaded} onError={analyticsFailed} /> : null;
}
