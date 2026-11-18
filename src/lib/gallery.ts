import type { StaticImageData } from 'next/image';
import fortniteReference from '../../assets/fortnite_billboard.jpg';
import fortnite from '../../assets/gallery/01_fortnite.jpg';
import crownAtl from '../../assets/gallery/02_crownatl.jpg';
import mickey from '../../assets/gallery/03_mickey.jpg';
import crownBoombox from '../../assets/gallery/04_crownboombox.jpg';
import donJulio from '../../assets/gallery/05_donjulioshaky.jpg';
import bulleit from '../../assets/gallery/06_bulleitbbq.jpg';
import ciroc from '../../assets/gallery/07_cirocriseup.jpg';
import bgww2025 from '../../assets/gallery/08_bgww2025.jpg';
import foodTrucks from '../../assets/gallery/09_foodtrucks.jpg';
import bgww2026 from '../../assets/gallery/10_bgww2026.jpg';
import windsor from '../../assets/gallery/11_windsoraustin.jpg';
import hornets from '../../assets/gallery/12_hornetsgrant.jpg';

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
  reference?: { image: StaticImageData; alt: string };
  cover: StaticImageData;
  alt: string;
  position?: string;
  photos: ProjectPhoto[];
  /** Publish only after approved copy and a descriptive slug have been supplied. */
  published?: boolean;
  services?: string[];
  seo?: { title: string; description: string; image?: StaticImageData; imageAlt?: string };
  /** Actual editorial update date (YYYY-MM-DD); never an automatic build timestamp. */
  updatedAt?: string;
};

// Only supplied photography is populated. Add approved editorial content here.
export const projects: Project[] = [
  {
    slug: 'project-01', number: '01', title: null, category: 'CUSTOM SCENIC FABRICATION', client: 'EPIC GAMES', location: null, year: null,
    description: "For Epic Games' end-of-year company party, Get Up Creative was brought in to take a piece of Fortnite out of the game and into the real world. Using the in-game billboard as our reference, we recreated the structure as a full-scale scenic prop, complete with distressed finishes, layered graffiti graphics, custom supports, and overhead lighting. The finished build became part of an immersive photo opportunity, bringing a recognizable piece of the Fortnite world to life for party guests.",
    reference: { image: fortniteReference, alt: 'In-game Fortnite reference: a weathered GG billboard with layered graffiti, timber supports, and three overhead lights.' },
    cover: fortnite, alt: 'Fortnite installation with multicolored illuminated lettering and a weathered GG billboard.',
    position: '50% 46%', photos: [],
  },
  {
    slug: 'project-02', number: '02', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: crownAtl, alt: 'Oversized ATL letters in front of a Crown Royal greenery wall with Atlanta Hawks logos.',
    photos: [],
  },
  {
    slug: 'project-03', number: '03', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: mickey, alt: 'Mickey Mouse silhouette in greenery on an orange paneled wall beside a matching lounge sofa.',
    position: '53% 50%', photos: [],
  },
  {
    slug: 'project-04', number: '04', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: crownBoombox, alt: 'Oversized Crown Royal boombox with illuminated speakers, a cassette, and purple and gold controls.',
    position: '65% 50%', photos: [],
  },
  {
    slug: 'project-05', number: '05', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: donJulio, alt: 'Don Julio pavilion at night with illuminated sculptural arches and signage.',
    position: '50% 30%', photos: [],
  },
  {
    slug: 'project-06', number: '06', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: bulleit, alt: 'Orange Bulleit bourbon installation with illuminated lettering, a barbecue station, and a bar.',
    position: '50% 25%', photos: [],
  },
  {
    slug: 'project-07', number: '07', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: ciroc, alt: 'Blue brick-effect Cîroc wall with raised white Rise Up lettering and an Atlanta Falcons logo.',
    position: '50% 50%', photos: [],
  },
  {
    slug: 'project-08', number: '08', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: bgww2025, alt: 'Pink literary awards backdrop with oversized gold records and a white display shelf.',
    position: '50% 35%', photos: [],
  },
  {
    slug: 'project-09', number: '09', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: foodTrucks, alt: 'Pink and purple food-truck facades beside picnic tables under string lights.',
    position: '50% 35%', photos: [],
  },
  {
    slug: 'project-10', number: '10', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: bgww2026, alt: 'Black and gold literary exhibition panels with framed book covers surrounding a dark lounge chair.',
    position: '55% 50%', photos: [],
  },
  {
    slug: 'project-11', number: '11', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: windsor, alt: 'Oversized guitar installation with Windsor Mortgage branding and colorful stage lighting.',
    position: '50% 50%', photos: [],
  },
  {
    slug: 'project-12', number: '12', title: null, category: null, client: null, location: null, year: null, description: null,
    cover: hornets, alt: 'Charlotte Hornets display styled as an oversized collectible box with a basketball player cutout and memorabilia.',
    position: '50% 24%', photos: [],
  },
];

export function projectLabel(project: Project) { return project.title ?? `Project ${project.number}`; }
export function getProject(slug: string) { return projects.find(project => project.slug === slug); }
export function isPublishedProject(project: Project) {
  return Boolean(project.published && project.title?.trim() && project.description?.trim()
    && project.services?.some(service => service.trim()) && project.seo?.title.trim() && project.seo?.description.trim()
    && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug) && !/^project-\d+$/.test(project.slug));
}
