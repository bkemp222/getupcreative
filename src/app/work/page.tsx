import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
export const metadata: Metadata = { title: 'Our Work' };
export default function Work() { return <><Header /><main id="main" className="portfolio"><p className="eyebrow">IMAGINATION, ACTIVATED.</p><h1 className="display">Our <span>Work</span></h1><p data-reveal className="portfolio-intro">Custom builds. Branded environments. Experiential activations.</p><p className="portfolio-note">Gallery preview — project photography and details to come.</p><div className="project-grid">{[1, 2, 3].map(n => <article data-reveal data-stagger={n - 1} className="project-placeholder" key={n}><div className="project-media"><span>0{n}</span><p>PROJECT PHOTOGRAPHY<br />PLACEHOLDER</p></div><h2>Project content pending</h2></article>)}</div><Link data-reveal className="work-button" href="/#contact">Got a project in mind? Get in touch ↗</Link></main><Footer /></>; }
