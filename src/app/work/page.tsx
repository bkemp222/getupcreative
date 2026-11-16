import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProjectGallery } from '@/components/portfolio/ProjectGallery';
import { projects } from '@/lib/gallery';
import { pageMetadata, breadcrumbSchema } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import './portfolio.css';

export const metadata = pageMetadata({
  title: 'Custom Fabrication & Brand Activation Portfolio',
  description: 'Explore Get Up Creative’s fabrication and experiential production portfolio: custom installations, branded environments, and event builds from our Atlanta-area studio.',
  path: '/work',
});
export default function Work() {
  return <><Header /><main id="main" className="editorial-portfolio">
    <h1 className="sr-only">Our Work</h1>
    <ProjectGallery projects={projects} />
    <div className="gallery-home"><Link href="/" className="gallery-home-button display"><span aria-hidden="true">←</span><span>Back to Home</span></Link></div>

  </main><Footer /><JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Our Work', path: '/work' }])} /></>;
}
