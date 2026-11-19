import Image from 'next/image';
import gratefulPeach from '../../assets/gratefulpeach.png';
import styles from './HomeArtwork.module.css';
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
export default function Home() { return <><Header /><main id="main"><Hero /><WhatWeDo /><div className={styles.transition}><HomeCarousel slides={projects.map(({ slug, cover, alt, position }) => ({ slug, cover, alt, position }))} /><div className={styles.artwork} aria-hidden="true"><Image src={gratefulPeach} alt="" className={styles.peach} sizes="(min-width: 1000px) 465px, (min-width: 768px) 46.5vw, 75vw" /></div><Contact /></div><ClientLogos /></main><Footer /><JsonLd data={organizationSchema()} /></>; }
