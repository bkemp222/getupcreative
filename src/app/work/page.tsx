import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectGallery } from '@/components/portfolio/ProjectGallery';
import { projects } from '@/lib/gallery';
import './portfolio.css';

export const metadata: Metadata = { title: 'Our Work' };
export default function Work() {
  return <><Header /><main id="main" className="editorial-portfolio">
    <header className="wall-heading"><h1 className="display">Our Work<span className="work-period">.</span></h1></header>
    <ProjectGallery projects={projects} />

  </main><Footer /></>;
}
