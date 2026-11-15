# Google Analytics

## Configuration

Set `NEXT_PUBLIC_GA_ID=G-ZZEW8FQTH5` in Vercel for the environments you want to measure, then redeploy. This public measurement ID is compiled into the browser bundle; it is not a secret. Leave it unset in development/preview to avoid test traffic. For local testing, set it in ignored `.env.local` and restart Next.js.

No previous Google Analytics, Google Tag Manager, or consent manager was found in the application. The root layout mounts one GoogleAnalytics component using `next/script` with `afterInteractive`; no extra package or GTM container is installed.

## Consent

The compact banner offers Accept analytics and Decline with equal button styling. No Google script or analytics request is initiated before consent. The choice is stored as `getup-analytics-consent` in localStorage; Privacy settings reopens the choice. Storage-disabled browsers use a session-only choice. Changes synchronize across tabs.

After consent, analytics storage is granted. Advertising storage, advertising user data, and personalization remain denied; Google signals and advertising personalization are disabled. Withdrawal sets Google's measurement disable flag and updates consent to denied. This stops collection; it does not retroactively delete data already collected or cookies previously written by Google. This implementation is not a substitute for an accurate published privacy policy.

A future consent manager can use the same integration without adding another Google tag:

```js
window.dispatchEvent(new CustomEvent('getup:analytics-consent', { detail: 'granted' }));
// To withdraw / reject:
window.dispatchEvent(new CustomEvent('getup:analytics-consent', { detail: 'denied' }));
```

## Page views and duplication

Google's built-in page-view measurement owns both the initial page view and browser history changes, including Next.js navigation. There is no separate React route-change page_view listener. Initialization is guarded against repeated consent events and React effect replay. Restoring consent after withdrawal sends one current-page event, without reinitializing the tag.

In GA Admin → Data streams → the web stream → Enhanced measurement → Page views → advanced settings, keep **Page changes based on browser history events** enabled. This property setting is required for client-side page views and cannot be verified from this repository. Do not also install GA through GTM, Vercel injection, another script, or a router page-view listener. Review any automatically measured gallery hash changes in Tag Assistant; they are Google history measurement, not separate manual route events.

Contact form fields, API requests, Resend, redirects, and conversion logic are unchanged. No contact-field contents are passed to GA by this integration. No new custom conversion event is added. Review Enhanced measurement settings in GA (including form interactions) to match your reporting preferences.

## Verify on a deployed site

1. Save the environment variable and redeploy the current code. Use a fresh browser profile without ad blockers for the test.
2. Open https://tagassistant.google.com/, add the deployed site URL, and connect.
3. Before choosing or after Decline, verify that no `gtag/js` or Google Analytics collection requests load. With basic consent mode, Tag Assistant may show no tag until consent is granted.
4. Accept analytics. Confirm exactly one tag for G-ZZEW8FQTH5; check consent shows analytics granted and all advertising types denied.
5. Navigate Home → Our Work → Home using the site's links, then browser Back/Forward. Expect one page_view per page change, not two. Confirm history-based page views are enabled if navigation views are missing.
6. Open GA → Reports → Realtime. Confirm your test session and page_view events appear; allow a short processing delay. Tag Assistant / DebugView provides more detail than aggregate Realtime counts.
7. Open Privacy settings and Decline, then navigate again. Verify no further analytics collection requests. Reload and verify the declined choice persists. Test acceptance again in a fresh profile.
8. If missing, check the deployed build's public env variable, blocker extensions, consent choice, web stream ID, and internal/developer traffic filters. Do not add a second tag as a workaround.

Local automated tests verify consent gating, single initialization, advertising denial, withdrawal, and absent configuration. Build checks do not prove that the deployed tag has reached GA or that stream settings are correct; that requires the live checks above.

Sources:
- https://nextjs.org/docs/app/guides/scripts
- https://nextjs.org/docs/app/guides/third-party-libraries
- https://developers.google.com/analytics/devguides/collection/ga4/views
- https://developers.google.com/tag-platform/security/guides/consent
