// These codes validate geography; they are not a legal determination of eligibility.
const usStates = new Set('AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC'.split(' '));
export type AnalyticsPolicy = { defaultAllowed: boolean; reason: 'us-default' | 'opt-in' | 'unknown'; globalPrivacyControl: boolean };

export function regionalAnalyticsPolicy(headers: Headers, env: Record<string, string | undefined>): AnalyticsPolicy {
  const globalPrivacyControl = headers.get('sec-gpc') === '1';
  const fallback: AnalyticsPolicy = { defaultAllowed: false, reason: 'unknown', globalPrivacyControl };
  // Only trust Vercel-added headers after the deployment's direct/proxy routing is verified.
  if (env.VERCEL !== '1' || env.ANALYTICS_GEO_VERIFIED !== 'true') return fallback;
  const country = headers.get('x-vercel-ip-country');
  if (!country || !/^[A-Z]{2}$/.test(country) || country === 'XX') return fallback;
  if (country !== 'US') return { ...fallback, reason: 'opt-in' };
  const state = headers.get('x-vercel-ip-country-region');
  if (!state || !usStates.has(state)) return fallback;
  const approved = (env.ANALYTICS_US_DEFAULT_ON_STATES ?? '').split(',').map(value => value.trim());
  // A malformed configuration fails closed, including '*' or an unrecognized state.
  if (!approved.length || approved.some(value => !usStates.has(value))) return { ...fallback, reason: 'opt-in' };
  const defaultAllowed = approved.includes(state) && !globalPrivacyControl;
  return { defaultAllowed, reason: defaultAllowed ? 'us-default' : 'opt-in', globalPrivacyControl };
}
