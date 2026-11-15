'use client';
import { useState } from 'react';
import { flushSync } from 'react-dom';
import { ProjectCard } from './ProjectCard';
import type { Project } from '@/lib/gallery';

export function ProjectGallery({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState('All');
  const categories = [...new Set(projects.flatMap(project => project.category ? [project.category] : []))];
  const visible = category === 'All' ? projects : projects.filter(project => project.category === category);
  function filter(next: string) {
    if (next === category) return;
    if (document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.startViewTransition(() => { flushSync(() => setCategory(next)); });
    } else setCategory(next);
  }
  return <>
    {categories.length > 1 && <div className="project-filters" role="group" aria-label="Filter projects by category">
      {['All', ...categories].map(item => <button key={item} type="button" aria-pressed={category === item} onClick={() => filter(item)}>{item}</button>)}
    </div>}
    <div className="editorial-grid" id="project-gallery">
      {visible.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}
    </div>
    <p className="sr-only" role="status" aria-live="polite">{visible.length} projects shown{category !== 'All' ? ` in ${category}` : ''}.</p>
  </>;
}
