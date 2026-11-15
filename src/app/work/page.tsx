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
    <header className="work-intro">
      <div className="work-kicker"><span className="gold-rule" /><span>GET UP CREATIVE / SELECTED WORK</span><span className="work-count">01—{String(projects.length).padStart(2, '0')}</span></div>
      <div className="work-intro-line"><h1 className="display">Our Work<span className="work-period">.</span></h1><p>Custom builds.<br />Branded environments.<br />Experiential activations.</p></div>
    </header>
    <ProjectGallery projects={projects} />
    <div className="work-outro" data-reveal><p className="eyebrow">YOUR NEXT IDEA STARTS HERE.</p><Link href="/#contact">Let’s make it happen.<span aria-hidden="true">↗</span></Link><Link className="work-back" href="#main">Back to top ↑</Link></div>
  </main><Footer /></>;
}
