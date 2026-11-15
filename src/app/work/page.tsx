import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectGallery } from '@/components/portfolio/ProjectGallery';
import { projects } from '@/lib/gallery';
import './portfolio.css';

export const metadata: Metadata = { title: 'Our Work' };
export default function Work() {
  return <><Header /><main id="main" className="editorial-portfolio">
    <h1 className="sr-only">Our Work</h1>
    <ProjectGallery projects={projects} />
    <div className="gallery-home"><Link href="/" className="gallery-home-button display"><span aria-hidden="true">←</span><span>Back to Home</span></Link></div>

  </main><Footer /></>;
}
