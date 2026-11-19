/**
 * Add only verified Squarespace paths after exporting/crawling the existing site.
 * Each entry: { source: '/confirmed-old-path', destination: '/confirmed-new-path', permanent: true }
 * Keep destinations internal and final (no chains). Never redirect all unknown URLs to Home.
 * When publishing descriptive project slugs, add redirects from any previously shared project-XX paths.
 */
/** @type {Array<{source: string, destination: string, permanent: boolean}>} */
export const legacyRedirects = [
  // Legacy homepage confirmed in Search Console's canonical report.
  { source: '/home', destination: '/', permanent: true },
];
