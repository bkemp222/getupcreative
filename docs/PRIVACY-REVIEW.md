# Privacy implementation: unresolved items

The public notice at `/privacy-policy` is now concise business-facing copy. The public draft disclaimer is removed. Google Workspace is included based on the user's supplied business information. No retention period, absolute security guarantee, sale/sharing representation, or statutory response deadline has been invented.

## Before enabling default-on analytics in production

- **Deployment location source:** Vercel supports IP-based country/state headers, but the current deployment's headers and routing could not be verified from this workspace. No linked Vercel project/account connector is present. Confirm the origin receives real visitor geography and not a reverse proxy's geography. Set `ANALYTICS_GEO_VERIFIED=true` only after verification. VPN/location errors remain a limitation.
- **Eligible U.S. jurisdictions:** The server state list is deliberately explicit and initially blank. Confirm which states permit this business's actual non-advertising analytics use without opt-in. The code validates state codes; it is not a legal determination. Put only reviewed states in `ANALYTICS_US_DEFAULT_ON_STATES`. Excluded states, non-U.S. regions, and unknown geography require permission.
- **GA account configuration and terms:** Confirm applicable processing terms/service-provider settings, data sharing with Google products, granular location/device controls, enhanced measurement, automatic user-provided data, and any Ads-linked destinations or conversion imports. Code-level advertising denial does not substitute for inspecting account-level settings. We have not accessed or changed those settings.
- **Law and audience:** U.S. state-law applicability depends on thresholds, practices, data types, and audiences; ordinary analytics is not universally exempt. Assess sale/sharing definitions, state interception/privacy claims, sensitive/children's data, and regional cookie requirements for the actual deployment. This implementation is not a legal compliance certification. Google policies must also be satisfied.

## Other business facts to confirm

- Legal business name and privacy request contact/process (the existing brand, email, and studio address are used).
- Inquiry handling, Google Workspace mailbox retention/deletion, backups, access controls, and any separate CRM or marketing uses not shown in the repository.
- Resend/Vercel logs, GA retention settings, processing locations, and provider contracts. No arbitrary retention duration is stated publicly.
- Operational security and handling of access/deletion requests. The public policy does not promise unverified procedures.

## Implemented protections

No automatic banner or overlay. Footer links provide access to the notice and the existing inline choices. Saved opt-out is honored everywhere. Browser/server GPC overrides grants and regional defaults. Until trusted geography and approved states are configured, default-on is inactive. Unknown/failed geography remains off unless explicit permission exists. Opt-out stops future collection through this GA ID without promising deletion of previously collected information. Advertising consent stays denied. Contact form code and delivery are unchanged.

Non-U.S. regions use opt-in rather than attempting to infer many countries' legal exceptions. A future CMP may be warranted if advertising, additional vendors, or consent-record requirements are introduced; it should use the same restrictive defaults, purpose-specific choices, and opt-out signals. Do not add an independent Google tag.

Official sources reviewed:
- Vercel headers: https://vercel.com/docs/headers/request-headers
- Google Analytics safeguards and U.S. state terms: https://support.google.com/analytics/answer/6004245?hl=en
- Google programmatic measurement opt-out: https://developers.google.com/tag-platform/security/guides/privacy
- California Attorney General CCPA rights and applicability: https://oag.ca.gov/privacy/ccpa
- ICO cookies guidance: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/

Nothing has been deployed. See ANALYTICS.md for environment settings, decision precedence, and a controlled live verification procedure.
