# Get Up Creative

Website built in the existing WORKING directory with Next.js App Router, TypeScript, React, and Tailwind CSS. No hosting or domain changes have been made.

## Preview

```sh
npm install
npm run dev
```

Open http://localhost:3000. Portfolio: http://localhost:3000/work.

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

The production build uses Next.js's supported Webpack option because Turbopack's CSS worker encountered a local port permission error in this environment. The development server uses Turbopack.

## Structure

- `src/app/page.tsx`: homepage composition.
- `src/components/`: header/menu, hero, services, contact, client strip and footer.
- `src/app/globals.css`: palette, type, mobile layout and desktop adaptation.
- `src/lib/media.ts`: separate mobile/desktop video paths and poster configuration. The supplied getup_bgvideo.mp4 currently serves both layouts with muted, looping, inline autoplay. Reduced-motion users receive the poster or neutral background without downloading video.
- `src/app/work/page.tsx`: minimal photo wall with twelve supplied photos and an expanding full-photo viewer.
- `src/app/api/contact/route.ts`: validates input and sends through Resend once server-only credentials are configured. See docs/CONTACT-DELIVERY.md.
- `assets/`: untouched original graphics; copies are served from `public/brand/`.

The headline uses the supplied transparent 937 × 322 artwork at its original aspect ratio, without cropping or blending. The supporting sentence remains real HTML above it.

## Assets and decisions pending

- Approved Cinematografica webfont. The local preview uses a trial Heavy file found in the user's installed fonts. Replace the trial font before publication; it is not a production font asset. Inter is self-hosted via Fontsource.
- Optional separate mobile/desktop video edits; the supplied video currently serves both layouts, with a still poster extracted from its first frame.
- Approved project titles, descriptions, additional photography and final gallery direction. Twelve supplied photos are connected through `src/lib/gallery.ts`. The supplied logo_scroll.svg is connected as a continuous, edge-faded marquee sized for approximately two to three visible logos, with pause on hover/focus and a manually scrollable reduced-motion layout.
- The menu uses brad@getupcreative.com and instagram.com/getupcreativeco. The footer still has its original contact placeholder.
- Desktop composition review.
- Email delivery provider, server-side rate limiting, robust spam protection and production delivery testing. Honeypot and validation are present, but do not constitute complete spam prevention.
- Production domain, canonical URL, Open Graph image and indexing approval. Preview is deliberately noindex; configure the production origin and launch switch as documented in docs/SEO.md.

Do not deploy until the missing production assets and integrations are approved.

## Motion and interaction layer

The approved composition is retained. Motion uses CSS, IntersectionObserver and a small native Web Animations transition for the modal; no animation dependency is added. `src/components/Motion.tsx` enhances below-fold content once per page visit, keeps initially visible content visible, and removes observers/listeners on navigation. Without JavaScript all content remains visible.

Global tokens in `globals.css` set 180–220ms control responses, 500ms entrances, 400ms exits, and restrained custom easing. Capability and navigation entrances are staggered by 55ms. Scroll updates are passive and requestAnimationFrame-batched, with gnome displacement capped at 24px and hero wash displacement at 4px. Motion avoids animating layout properties; the photo viewer also animates its crop using clip-path.

The hanging menu retains native modal focus containment and Escape handling, returns focus to its trigger, and never delays link navigation. Reduced-motion changes immediately disable scroll reveals, parallax, logo motion and the marquee, finish modal transitions, and use the video poster instead of footage. The reduced-motion logo strip remains manually scrollable.

Inter and the existing Cinematografica preview font are preloaded with next/font/local. Images reserve their intrinsic proportions; video fades in when decoded over the supplied-footage poster. The photo wall uses twelve supplied photos with optimized responsive images and small blur placeholders.

Contact fields provide accessible inline errors, focus the first invalid field, preserve entered values after delivery failures, prevent duplicate submissions and show an immediate loading state. The backend sends through Resend when configured and returns an honest error otherwise; see docs/CONTACT-DELIVERY.md.

## Photo wall

`src/lib/gallery.ts` holds the supplied photography. The `/work` page now displays a tight, repeating mosaic with varied crop sizes and no project captions. Add photos to that data array to extend the wall. Existing case-study templates remain available at their routes for future use, but wall tiles open the full photograph in place.

`ProjectGallery` uses a native modal dialog with keyboard focus containment and a coordinated 720ms opening and 580ms closing crop/transform animation with a synchronized dark scrim and interruption-safe reversal. Clicking outside, the close button, Escape, or browser Back collapses the photograph to its original tile. Forward reopens it. A `#photo=project-slug` hash supports direct links; scroll position stays fixed while viewing. Reduced motion skips the expansion animation. No animation library is used.

The wall uses optimized Next.js images and intrinsic dimensions, tight mobile pairings, and subtle hover scaling. Shared homepage, header, footer, and navigation remain unchanged.

## Tiger background artwork

What We Do, the shared header, and the client-logo section use `AnimatedTigerBackground` at 17% opacity. `assets/tigerstripes.svg` is authoritative and remains untouched. `scripts/sync-tiger-art.mjs` copies its 40 exact path strings and 1920×1920 viewBox into `src/lib/tiger-art.ts` before development/build. Run `node scripts/sync-tiger-art.mjs` after replacing artwork while the dev server is already running. The adapter deliberately fails on an unexpected SVG structure so transforms or additional elements cannot be silently lost.

Configure the component in `src/components/WhatWeDo.tsx`:

```tsx
<AnimatedTigerBackground
  stripeOpacity={0.17}
  stripeColor="#bd710a"
  patternScale={1}
  distortionStrength={8}
  driftSpeed={38}
  morphSpeed={36}
  animated={true}
/>
```

Opacity ranges from 0 to 1. Scale 1 proportionally covers the section; larger values zoom in without stretching. Distortion is in artwork units (clamped 0–16); 0 removes the filter. Speed props are durations in seconds, so higher values move more slowly. Density is no longer configurable because the supplied artwork determines the composition.

Desktop uses an inline SVG displacement filter with one fixed turbulence octave, a slowly offset noise field, and gently varying displacement strength. Touch/narrow screens omit the filter and use compositor-friendly drift only. Reduced motion and `animated={false}` show static, undistorted artwork. Offscreen/hidden-tab motion pauses. The decorative layer clips independently of the gnome and does not change layout or the underlying gold color. The header uses 43-second drift without displacement; the client section uses 41-second drift and gentle 4-unit displacement.

## SEO foundation

See [docs/SEO.md](docs/SEO.md) for the audit, production/preview indexing policy, project publishing fields, redirect mapping, verification commands, and launch checklist. Copy `.env.example` settings into the deployment environment; the production domain is intentionally unset until confirmed.

## Contact delivery

The form sends to brad@getupcreative.com through Resend and redirects to `/thank-you` only after provider acceptance. Set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL` privately in Vercel, using a verified Resend sender. Setup and tests: [docs/CONTACT-DELIVERY.md](docs/CONTACT-DELIVERY.md).
