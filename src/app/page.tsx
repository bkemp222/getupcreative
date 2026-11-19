import { Header } from '@/components/Header';
import { HomeCarousel } from '@/components/portfolio/HomeCarousel';
import { projects } from '@/lib/gallery';
import { Hero } from '@/components/Hero';
import { WhatWeDo } from '@/components/WhatWeDo';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { ClientLogos } from '@/components/ClientLogos';
import { JsonLd } from '@/components/JsonLd';
import { pageMetadata, organizationSchema } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageMetadata({ title: 'Experiential Fabrication & Creative Production', description: site.description, path: '/' });
export default function Home() { return <><Header /><main id="main"><Hero /><WhatWeDo /><HomeCarousel slides={projects.map(({ slug, cover, alt, position }) => ({ slug, cover, alt, position }))} /><Contact /><ClientLogos /></main><Footer /><JsonLd data={organizationSchema()} /></>; }
