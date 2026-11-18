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
    cover: fortnite, alt: "Full-scale Fortnite GG billboard fabricated for Epic Games, with distressed graffiti finishes, timber supports, and overhead lights.",
    position: '50% 46%', photos: [],
  },
  {
    slug: 'project-02', number: '02', title: null, category: 'BRANDED PHOTO OP · SCENIC FABRICATION', client: 'ATLANTA HAWKS × CROWN ROYAL', location: null, year: null,
    description: 'For the Atlanta Hawks vs. Los Angeles Lakers game at State Farm Arena, Get Up Creative fabricated a co-branded photo opportunity for the Hawks and Crown Royal. Oversized freestanding ATL letters featured gold sequin shimmer faces, purple trim, and gold returns, set against a lush faux floral wall with custom branding. The finished installation brought both brands together in a bold, basketball-inspired backdrop built for fan photos.',
    cover: crownAtl, alt: "Atlanta Hawks and Crown Royal photo backdrop with freestanding ATL letters, gold sequin faces, purple trim, and a faux floral wall.",
    photos: [],
  },
  {
    slug: 'project-03', number: '03', title: null, category: "CUSTOM SCENIC FABRICATION · BRANDED PHOTO OP", client: "MICKEY MOUSE PHOTO OP", location: null, year: null,
    description: "For an influencer VIP event at the University of Alabama during the Alabama vs. Georgia football weekend, Get Up Creative was brought in to fabricate several interactive stations and photo opportunities. This installation featured a custom Mickey Mouse silhouette created from faux hedge material, set against a warm, colorful backdrop designed to give guests a recognizable photo moment.",
    cover: mickey, alt: "Custom faux-hedge Mickey Mouse silhouette on a colorful backdrop for an Alabama vs. Georgia weekend VIP photo opportunity.",
    position: '53% 50%', photos: [],
  },
  {
    slug: 'project-04', number: '04', title: null, category: "EXPERIENTIAL FABRICATION · FESTIVAL ACTIVATION", client: "CROWN ROYAL BOOMBOX", location: null, year: null,
    description: "For One Music Fest in Atlanta, Get Up Creative built a 30' × 30' Crown Royal activation centered around a massive 20-foot custom boombox. The oversized throwback featured a functioning digital equalizer display, a scaled-up cassette, and integrated accent lighting throughout. Designed as the centerpiece of the branded environment, the boombox brought a larger-than-life dose of nostalgia to the festival grounds.",
    cover: crownBoombox, alt: "Oversized Crown Royal boombox fabricated for One Music Fest, with a giant cassette, illuminated speakers, and purple and gold controls.",
    position: '65% 50%', photos: [],
  },
  {
    slug: 'project-05', number: '05', title: null, category: "EXPERIENTIAL FABRICATION · INTERACTIVE ENGAGEMENT", client: "DON JULIO × SHAKY KNEES", location: null, year: null,
    description: "For Shaky Knees Music Festival in Atlanta, Get Up Creative fabricated a 30' × 30' Don Julio activation featuring a triple-arch illuminated Man in the Hat entrance, custom bar and back bar, and a fully interactive Cyclone light-chase game. The game was designed, built, wired, and programmed in-house, challenging guests to stop a moving light on the winning position. From scenic structures to custom electronics and coding, the activation brought together multiple fabrication disciplines in one cohesive branded environment.",
    cover: donJulio, alt: "Don Julio activation at Shaky Knees with a custom triple-arch illuminated Man in the Hat entrance photographed at night.",
    position: '50% 30%', photos: [],
  },
  {
    slug: 'project-06', number: '06', title: null, category: "BRANDED EVENT FABRICATION · CUSTOM SCENIC BUILD", client: "BULLEIT × TRAEGER", location: null, year: null,
    description: "Get Up Creative fabricated a 10' × 20' branded environment for Bulleit Bourbon and Traeger Grills at a BBQ festival. The setup featured a custom slat wall, stained oak finishes, and a black corrugated metal awning, giving the space a rustic, industrial feel. A dimensional Bulleit logo illuminated with marquee bulbs served as the centerpiece, tying the two brands together in a custom-built festival activation.",
    cover: bulleit, alt: "Bulleit Bourbon and Traeger BBQ festival build with a custom slat wall, corrugated awning, and marquee-lit Bulleit lettering.",
    position: '50% 25%', photos: [],
  },
  {
    slug: 'project-07', number: '07', title: null, category: "STADIUM ACTIVATION · SCENIC FABRICATION", client: "ATLANTA FALCONS × CÎROC", location: null, year: null,
    description: "For Atlanta Falcons home games at Mercedes-Benz Stadium, Get Up Creative fabricated a 20-foot-wide custom serving backdrop for Cîroc. The installation featured a blue brick-finish wall with dimensional PVC lettering, creating a branded environment designed for repeated use throughout the football season. The finished build brought a permanent-looking architectural element to a temporary stadium activation.",
    cover: ciroc, alt: "Custom Cîroc serving backdrop for Atlanta Falcons games at Mercedes-Benz Stadium, with blue brick finishes and dimensional Rise Up lettering.",
    position: '50% 50%', photos: [],
  },
  {
    slug: 'project-08', number: '08', title: null, category: "EVENT BACKDROP · CUSTOM PROP FABRICATION", client: "BLACK GIRLS WHO WRITE 2025", location: null, year: null,
    description: "For the 2025 Black Girls Who Write Literary Awards, Get Up Creative fabricated a custom 8' × 8' event backdrop inspired by classic gold records. The installation featured oversized dimensional record props, precision-cut white vinyl lettering, and an integrated shelf for a record player. The finished piece combined graphic elements and custom fabrication into a music-inspired backdrop for the literary celebration.",
    cover: bgww2025, alt: "Black Girls Who Write 2025 Literary Awards backdrop with oversized gold record props, white vinyl lettering, and a record-player shelf.",
    position: '50% 35%', photos: [],
  },
  {
    slug: 'project-09', number: '09', title: null, category: "THEMED EVENT ENVIRONMENT · SCENIC FABRICATION", client: "SWEET 16 FOOD TRUCKS", location: null, year: null,
    description: "For a high-end Sweet 16 celebration, Get Up Creative transformed the concession area into a custom food truck experience. Two full-scale food truck facades featured functional serving windows, original graphic designs, and complete printed vinyl wraps. The surrounding environment included a picnic area, overhead cloud elements, and integrated lighting, creating a playful, fully themed food service experience for party guests.",
    cover: foodTrucks, alt: "Full-scale pink and purple food truck facades with serving windows and vinyl graphics for a Sweet 16 celebration.",
    position: '50% 35%', photos: [],
  },
  {
    slug: 'project-10', number: '10', title: null, category: "CUSTOM GALLERY INSTALLATION · EVENT FABRICATION", client: "BLACK GIRLS WHO WRITE 2026", location: null, year: null,
    description: "For the 2026 Black Girls Who Write Literary Awards, Get Up Creative fabricated a custom black-and-gold gallery wall celebrating authors and their work. The installation featured framed book covers, literary quotes, and curated Instagram Threads posts, arranged as an immersive exhibition-style display. Sponsored by Spotify for Authors and Instagram Threads, the gallery brought together literary storytelling, social media, and scenic fabrication in one cohesive event environment.",
    cover: bgww2026, alt: "Black Girls Who Write 2026 Literary Awards gallery installation with black-and-gold panels and framed book covers.",
    position: '55% 50%', photos: [],
  },
  {
    slug: 'project-11', number: '11', title: null, category: "CUSTOM TRADE SHOW FABRICATION · BRANDED ENVIRONMENTS", client: "WINDSOR MORTGAGE", location: null, year: null,
    description: "For Windsor Mortgage in Austin, Texas, Get Up Creative fabricated a custom trade show environment inspired by the city's music and street art culture. The build featured a 1:10-scale electric guitar with custom client branding, a fully designed and vinyl-wrapped interpretation of Austin's iconic \"Greetings from Austin\" mural, and a second slatted display wall with a dimensional HDU logo for merchandise. The finished booth combined oversized props, custom graphics, and functional display elements into a distinctive branded space.",
    cover: windsor, alt: "Oversized custom-branded electric guitar fabricated for the Windsor Mortgage trade show environment in Austin, Texas.",
    position: '50% 50%', photos: [],
  },
  {
    slug: 'project-12', number: '12', title: null, category: "CUSTOM SCENIC FABRICATION · SPORTS ACTIVATION", client: "CHARLOTTE HORNETS", location: null, year: null,
    description: "For the Charlotte Hornets, Get Up Creative fabricated seven oversized action figure-style display boxes designed to bring collectible toy packaging into the real world. Each approximately 6' × 8' structure featured custom graphics, dimensional framing, and mounted player or character elements arranged to mimic a packaged action figure. Built as modular, open-back scenic structures, the displays were designed for efficient transportation, installation, and a bold, larger-than-life presentation.",
    cover: hornets, alt: "Charlotte Hornets action figure-style scenic display box with custom graphics, dimensional framing, and a mounted player cutout.",
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
