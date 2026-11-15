import type { Metadata } from 'next';
import { seoConfig } from './seo-config.mjs';
import { site } from './site';

type SocialImage = { url: string; width: number; height: number; alt: string };
export function canonicalUrl(path: string) {
  return seoConfig.siteUrl ? new URL(path, seoConfig.siteUrl).href : undefined;
}

export function pageMetadata({ title, description, path, indexable = true, image }: {
  title: string; description: string; path: string; indexable?: boolean; image?: SocialImage;
}): Metadata {
  const fullTitle = `${title} | ${site.name}`;
  const canonical = canonicalUrl(path);
  const preview = image ?? { url: '/social-image', width: 1200, height: 630, alt: 'Get Up Creative Co. logo on charcoal and Get Up Gold' };
  return {
    title: { absolute: fullTitle }, description,
    alternates: canonical ? { canonical } : undefined,
    robots: { index: seoConfig.indexable && indexable, follow: true },
    openGraph: { title: fullTitle, description, url: canonical, siteName: site.name, locale: 'en_US', type: 'website', images: [preview] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [preview] },
  };
}

export function organizationSchema() {
  const url = canonicalUrl('/');
  if (!url) return null;
  return {
    '@context': 'https://schema.org', '@type': 'Organization', '@id': `${url}#organization`,
    name: site.name, url, description: site.description, email: site.email,
    logo: { '@type': 'ImageObject', url: canonicalUrl(site.logo), width: 861, height: 503 },
    address: { '@type': 'PostalAddress', ...site.address },
    sameAs: [site.instagram],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  if (!seoConfig.siteUrl) return null;
  return {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: canonicalUrl(item.path) })),
  };
}
