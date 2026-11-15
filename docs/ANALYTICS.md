# Google Analytics launch configuration

Launch decision: retain opt-in analytics and GPC protection. Regional defaults remain inactive. Advertising storage, advertising data use, and personalization remain denied. The successful-inquiry event is kept for permitted GA4 measurement; Ads attribution remains restricted. No additional consent controls, tags, or tracking infrastructure are planned. Account setup notes below are reference only, not authorization to change settings.

## Deployment configuration

- `NEXT_PUBLIC_GA_ID=G-ZZEW8FQTH5` — public measurement ID, compiled at build time. Rebuild after changing it.
- `ANALYTICS_GEO_VERIFIED=true` — server-only. Set only after verifying that the deployment receives Vercel's real visitor country/state headers and is not using an upstream proxy's location.
- `ANALYTICS_US_DEFAULT_ON_STATES` — server-only comma-separated two-letter U.S. state codes approved for default-on analytics for the actual business/property configuration. An example **syntax, not a legal approval**, is `GA,TX`. Blank or malformed configuration keeps automatic analytics off. Wildcards are not supported.
- Vercel supplies `VERCEL=1`; never set this locally to make caller-supplied headers look trusted in production.

No live Vercel or Google account configuration has been changed. The example environment intentionally leaves geo verification false and the state list blank. The software supports default-on analytics, but activation is pending deployment verification and approval of the applicable jurisdictions and GA settings. The code does not decide whether a particular state's laws apply to the business.

## Geolocation availability and limits

Vercel documents `x-vercel-ip-country` and `x-vercel-ip-country-region` as server-side IP geolocation headers. The workspace is linked through the Vercel CLI. A temporary authenticated production diagnostic confirmed US/GA headers for a controlled Georgia connection on November 15, 2026. The diagnostic deployment, variables, code, and token were removed. This does not verify other visitors or Google account settings, and regional defaults remain inactive.

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

Advertising storage, user data, and personalization remain denied in every branch. Google signals and advertising personalization are disabled. No Ads/remarketing tag is installed. The consent-gated GA4 generate_lead event is described below.

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

## Successful inquiry measurement (prepared locally; requires deployment)

The contact API returns an opaque random receipt only after Resend accepts the message. The form calls `trackConfirmedLead(receipt)` in its successful-response branch before the existing client-side thank-you redirect. The receipt is only a browser duplicate-prevention key; it is never sent to Google. Provider acceptance does not prove final inbox delivery.

The event is `generate_lead` with only `send_to: G-ZZEW8FQTH5`. No name, email, description, requested date, receipt, invented monetary value, or enhanced-conversion user data is attached. Google's normal permitted analytics context still applies.

The existing submission lock prevents repeat clicks. The analytics module also deduplicates receipts in memory and (when available) sessionStorage, keeping up to 100 permitted receipts. No event is emitted by thank-you page rendering or refresh. A new genuinely submitted inquiry is a separate lead. This is at-most-once application emission, not guaranteed delivery to Google.

Permission must already be resolved and allowed at success time. Unknown/denied consent or GPC drops the event; later permission does not replay it. If permitted but the script is loading, the event waits in memory, survives the Next.js client-side redirect, and is flushed once on readiness. Withdrawal or script failure discards pending leads. There is no persistent event replay, server-side consent bypass, or navigation delay. Ad blockers, abrupt browser exits, and network failures can cause undercounting.

### Account configuration after approved deployment

1. In GA4, select the property whose web stream measurement ID is G-ZZEW8FQTH5. In Admin → Product links → Google Ads links, link the intended Ads account if not already linked. Keep personalized advertising disabled; do not enable Google Signals, user-provided data collection, enhanced conversions, or remarketing for this task.
2. In Google Ads, verify auto-tagging is enabled (Admin → Account settings → Auto-tagging). Do not strip click identifiers in redirects. This does not override the site's consent restrictions.
3. Using Tag Assistant and an analytics-permitted browser with GPC off, submit one clearly identified test inquiry after deployment. This sends real mail. Verify one generate_lead in GA4 Realtime/DebugView and the network request, then reload /thank-you and verify no additional lead. No live email test was sent during implementation.
4. GA4 → Admin → Data display → Events: locate generate_lead and mark it as a key event. New events can take time to appear. Use the exact event name; do not create a page-view or form_submit rule that generates another lead. Use once-per-event counting for GA4 so separate successful inquiries remain distinguishable.
5. Google Ads → Goals → Conversions → Summary → Create conversion action: select the linked Google Analytics property, select generate_lead, then Select events → Save and continue. Some accounts show Import → Google Analytics 4 → Web instead. Import the existing event once; do not add a second Google tag or thank-you URL conversion.
6. Review the conversion as a submitted lead form, with Count = One for lead acquisition. Select Primary only when this is the campaign's intended bidding goal and testing is complete. Confirm the campaign includes that goal. If a previous click/form-submit/thank-you conversion exists for the same inquiry, remove it from primary bidding goals to avoid counting the same lead twice. Do not assign an invented value; choose no value unless the business supplies one. Where the new interface manages counting/window settings in Analytics, review them there.
7. Check the conversion action's diagnostics/status and allow reporting processing time. A direct test verifies GA4 receipt but is not necessarily an Ads-attributed conversion. Only eligible attributed activity appears as an Ads conversion; GA4 and Ads totals need not match.

Advertising storage, ad_user_data, and ad_personalization remain denied. In particular, denied ad_user_data can restrict advertising measurement/export and attribution. Creating an imported conversion does not guarantee Ads bidding/attribution will receive usable data. Review applicable consent and Google account requirements separately; this implementation does not grant advertising consent or silently weaken existing safeguards.

Before activating Ads import, review the public notice to accurately disclose conversion measurement and any account-level sharing being enabled. No Google account linking, conversion action creation, production environment change, or deployment is performed by this code change.

Official setup references:
- https://developers.google.com/analytics/devguides/collection/ga4/reference/events#generate_lead
- https://support.google.com/analytics/answer/14710559?hl=en
- https://support.google.com/google-ads/answer/2375435?hl=en
