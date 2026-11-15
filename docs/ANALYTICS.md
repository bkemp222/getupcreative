# Regional Google Analytics

## Deployment configuration

- `NEXT_PUBLIC_GA_ID=G-ZZEW8FQTH5` — public measurement ID, compiled at build time. Rebuild after changing it.
- `ANALYTICS_GEO_VERIFIED=true` — server-only. Set only after verifying that the deployment receives Vercel's real visitor country/state headers and is not using an upstream proxy's location.
- `ANALYTICS_US_DEFAULT_ON_STATES` — server-only comma-separated two-letter U.S. state codes approved for default-on analytics for the actual business/property configuration. An example **syntax, not a legal approval**, is `GA,TX`. Blank or malformed configuration keeps automatic analytics off. Wildcards are not supported.
- Vercel supplies `VERCEL=1`; never set this locally to make caller-supplied headers look trusted in production.

No live Vercel or Google account configuration has been changed. The example environment intentionally leaves geo verification false and the state list blank. The software supports default-on analytics, but activation is pending deployment verification and approval of the applicable jurisdictions and GA settings. The code does not decide whether a particular state's laws apply to the business.

## Geolocation availability and limits

Vercel documents `x-vercel-ip-country` and `x-vercel-ip-country-region` as server-side IP geolocation headers. This workspace has no linked `.vercel` project or Vercel account connector. Live request headers, proxy routing, Google property settings, and legal eligibility could not be independently verified. The public deployment URL alone cannot prove the end-user geolocation received inside a function.

Verify the deployment in Vercel's request diagnostics or a controlled preview before setting the verification flag. An upstream CDN/proxy may cause Vercel to locate the proxy instead of the visitor; VPN/IP geolocation is approximate and is not proof of legal residence. No browser language, timezone, user-supplied country parameter, or fallback third-party geolocation service is used.

`GET /api/analytics-policy` uses only the trusted request headers on verified Vercel deployments. It returns a decision, not an IP, city, country, or state. It is force-dynamic with browser/CDN/Vercel caching disabled so one visitor's result cannot become another's default. Missing state, missing country, unverified environment, an invalid state list, request failure, or a five-second timeout keeps automatic tracking off. Non-U.S. visitors are always opt-in.

## Decision order and controls

1. No valid measurement ID: no Google tag.
2. While policy resolves: no tag, even for a saved grant.
3. Global Privacy Control (`Sec-GPC: 1` or browser signal): analytics off, including when a grant was saved.
4. Saved `denied`: analytics off in every region.
5. Saved `granted`: analytics allowed unless GPC applies.
6. No preference: automatic analytics only for verified U.S. state codes in the approved list. Otherwise require permission.

The existing `getup-analytics-consent` localStorage key is retained for compatibility. Explicit choices persist; if storage is unavailable they apply to this page session. Cross-tab storage changes and the existing `getup:analytics-consent` event are supported. Clearing the choice restores the regional default; it does not always mean off for an eligible U.S. visitor.

The footer Privacy Settings link opens `/privacy-policy#privacy-settings`. The controls share the tag loader's store and distinguish checking, off, loading, loaded/on, and unavailable/error states. An ad blocker or network policy can still prevent remote delivery; loaded/on does not guarantee Google received a hit. Missing GA configuration is displayed as unavailable, not active.

Disable analytics immediately sets Google's `ga-disable-<ID>` flag before rendering, updates consent to denied, and prevents the integration from mounting the external script. If the script already executed, it remains in browser memory but the disable flag prevents it sending subsequent data through this measurement ID. Existing cookies and historical data are not deleted. The integration does not emit additional measurement events while opted out. This cannot undo a request already sent before withdrawal.

Advertising storage, user data, and personalization remain denied in every branch. Google signals and advertising personalization are disabled. No Ads/remarketing tag or new contact conversion event is installed.

## Page views

One root-level `next/script` loads after hydration when allowed. There is no second router page-view listener. Google owns initial and History API navigation views. In GA Admin → Data streams → Enhanced measurement → Page views → advanced settings, keep **Page changes based on browser history events** enabled. Restoring permission sends one current-page view without reinitializing the tag. No duplicate GTM or Vercel-injected Google tag should be added.

The contact form, Resend delivery, and thank-you redirect are unchanged. No form-field contents are intentionally passed to GA. Review enhanced measurement, user-provided data, data sharing, and linked Ads settings in the actual Google account before approving default-on processing.

## Verification

Automated tests evaluate the actual regional policy, client consent controller, script component, and privacy controls. They cover approved U.S. default-on, saved opt-out, opt-in regions, saved consent, unknown geography, failed lookup, missing configuration/state, untrusted headers, invalid allowlists, GPC, duplicate initialization, cross-tab updates, and withdrawal during an outstanding request. No real visitor regions or live Google events are fabricated by these tests.

For deployed verification (no automatic deployment):

1. Verify direct Vercel location headers and the legal/provider configuration; set only the reviewed states.
2. Use real controlled locations and fresh profiles to test eligible U.S., excluded/non-U.S., and unknown/failure cases. Do not use language/timezone overrides as evidence.
3. Before a permitted decision, or after saved opt-out, verify no `gtag/js`/Google collection requests. After permission or an eligible default, expect one tag.
4. In https://tagassistant.google.com/ connect the deployment, inspect consent, and navigate Home → Our Work → Home. Expect one page_view per navigation. Confirm activity in GA Realtime/DebugView.
5. Disable analytics, navigate and reload. Verify no subsequent collection; test another tab and GPC. Check loaded-script rejection and policy failure status as well.
6. Confirm advertising consent stays denied and no Ads/remarketing destination is linked or separately injected.

References:
- https://vercel.com/docs/headers/request-headers
- https://vercel.com/kb/guide/can-i-use-a-proxy-on-top-of-my-vercel-deployment
- https://developers.google.com/tag-platform/security/guides/privacy
- https://developers.google.com/analytics/devguides/collection/ga4/views
- https://support.google.com/analytics/answer/6004245?hl=en
