import type { MetadataRoute } from 'next';
import { projects, isPublishedProject } from '@/lib/gallery';
import { seoConfig } from '@/lib/seo-config.mjs';
import { canonicalUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!seoConfig.indexable) return [];
  return [
    { url: canonicalUrl('/')! },
    { url: canonicalUrl('/work')! },
    { url: canonicalUrl('/privacy-policy')! },
    ...projects.filter(isPublishedProject).map(project => ({
      url: canonicalUrl(`/work/${project.slug}`)!,
      ...(project.updatedAt ? { lastModified: project.updatedAt } : {}),
      images: [canonicalUrl(project.cover.src)!],
    })),
  ];
}
