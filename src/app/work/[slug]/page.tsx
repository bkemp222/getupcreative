import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectDetail } from '@/components/portfolio/ProjectDetail';
import { getProject, projectLabel, projects } from '@/lib/gallery';
import '../portfolio.css';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return { title: 'Project not found' };
  return { title: projectLabel(project), ...(project.description ? { description: project.description } : {}) };
}
export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <><Header /><ProjectDetail project={project} next={next} /><Footer /></>;
}
