import { seoConfig } from './src/lib/seo-config.mjs';
import { legacyRedirects } from './config/legacy-redirects.mjs';

/** @type {import('next').NextConfig} */
const config = {
  async redirects() { return legacyRedirects; },
  async headers() {
    return [
      { source: '/api/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] },
      ...(!seoConfig.indexable ? [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }] : []),
    ];
  },
};
export default config;
