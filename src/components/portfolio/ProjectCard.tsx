import Image from 'next/image';
import Link from 'next/link';
import { projectLabel, type Project } from '@/lib/gallery';

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const wide = project.composition === 'cinematic' || project.composition === 'feature';
  return <article className={`editorial-project composition-${project.composition}`} data-reveal data-stagger={index % 2}>
    <Link className="project-link" href={`/work/${project.slug}`} aria-label={`View ${projectLabel(project)}${project.title ? '' : ' — title pending'}`}>
      <div className="project-media editorial-image">
        <Image src={project.cover} alt={project.alt} placeholder="blur" priority={index === 0} sizes={wide ? '(min-width: 1600px) 1472px, 94vw' : '(min-width: 768px) 55vw, (min-width: 480px) 48vw, 90vw'} style={{ objectPosition: project.position }} />
        <span className="project-image-index" aria-hidden="true">{project.number}</span>
        <span className="project-open" aria-hidden="true">↗</span>
      </div>
      <div className="project-caption">
        <div><h2>{projectLabel(project)}</h2><p>{project.category ?? (project.title ? 'Category pending' : 'Project title & details pending')}</p></div>
        <span className="project-caption-arrow" aria-hidden="true">↗</span>
      </div>
    </Link>
  </article>;
}
