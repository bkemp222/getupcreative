import type { StaticImageData } from 'next/image';
import fortnite from '../../assets/gallery/01_fortnite.jpg';
import crownAtl from '../../assets/gallery/02_crownatl.jpg';
import mickey from '../../assets/gallery/03_mickey.jpg';

export type Composition = 'cinematic' | 'wide' | 'portrait' | 'portrait-pair' | 'feature';
export type ProjectPhoto = { image: StaticImageData; alt: string; caption?: string; layout: 'full' | 'detail' };
export type Project = {
  slug: string;
  number: string;
  title: string | null;
  category: string | null;
  client: string | null;
  location: string | null;
  year: string | null;
  description: string | null;
  cover: StaticImageData;
  alt: string;
  composition: Composition;
  position?: string;
  photos: ProjectPhoto[];
};

// Only supplied photography is populated. Add approved editorial content here.
// Composition options repeat freely as projects are added; no masonry or auto-generated claims.
export const projects: Project[] = [
  {
    slug: 'project-01', number: '01', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: fortnite, alt: 'Fortnite installation with multicolored illuminated lettering and a weathered GG billboard.',
    composition: 'cinematic', position: '50% 46%', photos: [],
  },
  {
    slug: 'project-02', number: '02', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: crownAtl, alt: 'Oversized ATL letters in front of a Crown Royal greenery wall with Atlanta Hawks logos.',
    composition: 'wide', photos: [],
  },
  {
    slug: 'project-03', number: '03', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: mickey, alt: 'Mickey Mouse silhouette in greenery on an orange paneled wall beside a matching lounge sofa.',
    composition: 'portrait', position: '53% 50%', photos: [],
  },
];

export function projectLabel(project: Project) { return project.title ?? `Project ${project.number}`; }
export function getProject(slug: string) { return projects.find(project => project.slug === slug); }
