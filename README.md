# Get Up Creative

Local first-pass website built in the existing WORKING directory with Next.js App Router, TypeScript, React, and Tailwind CSS. No hosting or domain changes have been made.

## Preview

```sh
npm install
npm run dev
```

Open http://localhost:3000. Portfolio: http://localhost:3000/work.

```sh
npm run typecheck
npm run build
npm start
```

The production build uses Next.js's supported Webpack option because Turbopack's CSS worker encountered a local port permission error in this environment. The development server uses Turbopack.

## Structure

- `src/app/page.tsx`: homepage composition.
- `src/components/`: header/menu, hero, services, contact, client strip and footer.
- `src/app/globals.css`: palette, type, mobile layout and desktop adaptation.
- `src/lib/media.ts`: separate mobile/desktop video paths and poster configuration. The supplied getup_bgvideo.mp4 currently serves both layouts with muted, looping, inline autoplay. Reduced-motion users receive the poster or neutral background without downloading video.
- `src/app/work/page.tsx`: placeholder portfolio gallery. No invented projects or clients.
- `src/app/api/contact/route.ts`: validates input and explicitly returns 503 until an email provider is integrated. Messages are neither stored nor delivered.
- `assets/`: untouched original graphics; copies are served from `public/brand/`.

The headline file includes a baked-in supporting sentence and cream background. A CSS window displays the main artwork while the supporting sentence is real HTML. The original image has not been edited.

## Assets and decisions pending

- Approved Cinematografica webfont. The local preview uses a trial Heavy file found in the user's installed fonts. Replace the trial font before publication; it is not a production font asset. Inter is self-hosted via Fontsource.
- Script artwork/font for “Got an idea?”; currently an italic Inter text placeholder.
- Gold background pattern; currently flat gold. A dedicated video poster and optional separate mobile/desktop edits; the supplied background video is connected for both layouts.
- Full-color project photography, titles, descriptions and gallery direction. The supplied logo_scroll.svg is connected as a continuous, edge-faded marquee sized for approximately two to three visible logos, with pause on hover/focus and a manually scrollable reduced-motion layout.
- Company email and social links. Address transcribed from the supplied reference.
- Desktop composition review.
- Email delivery provider, server-side rate limiting, robust spam protection and production delivery testing. Honeypot and validation are present, but do not constitute complete spam prevention.
- Production domain, canonical URL, Open Graph image and indexing approval. Preview is deliberately noindex; update metadata before launch.

Do not deploy until the missing production assets and integrations are approved.
# getupcreative
