import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectDetail } from '@/components/portfolio/ProjectDetail';
import { getProject, isPublishedProject, projectLabel, projects } from '@/lib/gallery';
import { pageMetadata, breadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import '../portfolio.css';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const image = project.seo?.image ?? project.cover;
  return pageMetadata({
    title: project.seo?.title ?? `${projectLabel(project)} — Fabrication Portfolio`,
    description: project.seo?.description ?? project.description ?? project.alt,
    path: `/work/${project.slug}`, indexable: isPublishedProject(project),
    image: { url: image.src, width: image.width, height: image.height, alt: project.seo?.imageAlt ?? project.alt },
  });
}
export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <><Header /><ProjectDetail project={project} next={next} /><Footer /><JsonLd data={breadcrumbSchema([
    { name: 'Home', path: '/' }, { name: 'Our Work', path: '/work' }, { name: projectLabel(project), path: `/work/${project.slug}` },
  ])} /></>;
}
