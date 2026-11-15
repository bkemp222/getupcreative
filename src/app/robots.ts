import type { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo-config.mjs';
import { canonicalUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  // Crawlers must be able to read noindex on previews and unfinished project pages.
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: seoConfig.indexable ? canonicalUrl('/sitemap.xml') : undefined,
  };
}
