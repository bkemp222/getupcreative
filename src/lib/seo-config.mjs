/** Build-time settings shared by Next config and server metadata. Never use a preview host as a canonical. */
export function getSeoConfig(env = process.env) {
  const configured = env.SITE_URL?.trim();
  const siteUrl = configured ? new URL(configured) : null;
  if (siteUrl && (siteUrl.protocol !== 'https:' || siteUrl.username || siteUrl.password || siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash || siteUrl.hostname === 'localhost' || siteUrl.hostname.endsWith('.vercel.app'))) {
    throw new Error('SITE_URL must be the HTTPS origin of the production domain, without a path, credentials, query, or fragment.');
  }
  const enabled = env.SITE_INDEXING_ENABLED === 'true';
  if (enabled && !siteUrl) throw new Error('Set SITE_URL before enabling search indexing.');
  const production = env.NODE_ENV === 'production' && (!env.VERCEL_ENV || env.VERCEL_ENV === 'production');
  return { siteUrl: siteUrl?.origin ?? null, indexable: enabled && production };
}
export const seoConfig = getSeoConfig();
