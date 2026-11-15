import Image from 'next/image';
import Link from 'next/link';
import { type Project } from '@/lib/gallery';
import { ReadingProgress } from './ReadingProgress';

export function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  return <main id="main" className="case-study" data-case-study>
    <ReadingProgress />
    <header className="case-heading"><Link className="case-back" href="/work">← All work</Link><p className="case-index">PROJECT / {project.number}</p><h1 className="display">{project.title ?? <>Project <span className="case-number">{project.number}</span></>}<span className="work-period">.</span></h1></header>
    <figure className="case-hero"><Image src={project.cover} alt={project.alt} preload placeholder="blur" sizes="(min-width: 1600px) 1472px, 94vw" /><figcaption><span>01 / PROJECT PHOTOGRAPHY</span><span>GET UP CREATIVE</span></figcaption></figure>
    {(project.description || project.client || project.category || project.location || project.year) && <section className="case-info" aria-labelledby="project-overview" data-reveal>
      <div><h2 id="project-overview" className="eyebrow">THE PROJECT</h2>{project.description && <p className="case-description">{project.description}</p>}</div>
      <dl>{[['Client', project.client], ['Category', project.category], ['Location', project.location], ['Year', project.year]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </section>}
    {project.photos.length > 0 && <section className="case-sequence" aria-label="Project photographs">
      {project.photos.map((photo, index) => <figure data-reveal className={`case-photo case-photo-${photo.layout}`} key={`${photo.image.src}-${index}`}><div className="project-media"><Image src={photo.image} alt={photo.alt} placeholder="blur" sizes={photo.layout === 'full' ? '94vw' : '(min-width: 768px) 54vw, 90vw'} /></div>{photo.caption && <figcaption>{photo.caption}</figcaption>}</figure>)}
    </section>}
    <nav className="case-next" aria-label="More projects"><Link href={`/work/${next.slug}`}><span className="eyebrow">NEXT PROJECT / {next.number}</span><span className="display">{next.title ?? <>Project <span className="case-number">{next.number}</span></>} <span aria-hidden="true">↗</span></span></Link><Link className="case-back" href="/work">View all work</Link></nav>
  </main>;
}
