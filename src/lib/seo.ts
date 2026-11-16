import type { Metadata } from 'next';
import { seoConfig } from './seo-config.mjs';
import { site } from './site';

export const socialPreview = {
  title: 'Get Up Creative',
  description: 'Creative Production. Custom Fabrication. Experiential Activations.',
  image: { url: 'https://getupcreative.com/social_1200x630.png', width: 2501, height: 1313, type: 'image/png', alt: 'Get Up Creative' },
};
export function canonicalUrl(path: string) {
  return seoConfig.siteUrl ? new URL(path, seoConfig.siteUrl).href : undefined;
}

export function pageMetadata({ title, description, path, indexable = true }: {
  title: string; description: string; path: string; indexable?: boolean;
}): Metadata {
  const fullTitle = `${title} | ${site.name}`;
  const canonical = canonicalUrl(path);
  const shareTitle = path === '/' ? socialPreview.title : fullTitle;
  const shareDescription = path === '/' ? socialPreview.description : description;
  const shareUrl = new URL(path, 'https://getupcreative.com').href;
  return {
    title: { absolute: fullTitle }, description,
    alternates: canonical ? { canonical } : undefined,
    robots: { index: seoConfig.indexable && indexable, follow: true },
    openGraph: { title: shareTitle, description: shareDescription, url: shareUrl, siteName: site.name, locale: 'en_US', type: 'website', images: [socialPreview.image] },
    twitter: { card: 'summary_large_image', title: shareTitle, description: shareDescription, images: [socialPreview.image] },
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
