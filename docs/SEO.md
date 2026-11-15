# SEO foundation and launch checklist

## Configuration

Set these variables in the deployment environment, then rebuild:

- `SITE_URL`: the confirmed HTTPS production origin (no path, query, fragment, or temporary Vercel host).
- `SITE_INDEXING_ENABLED`: keep `false` until launch approval; set `true` on the production deployment when ready.

The final production domain has not yet been confirmed in this task. `.env.example` deliberately leaves it blank. Without it, local social URLs use localhost, canonical tags and organization/breadcrumb JSON-LD are omitted, and the sitemap is empty. Do not launch with this fallback.

`src/lib/seo-config.mjs` enforces this policy. Vercel Preview/Development and `next dev` stay noindex even if they inherit the launch switch. On other hosting platforms, use the production flag only for the live site. Settings are evaluated at build time: rebuild/redeploy when changing them; do not promote a preview build unchanged into production.

Previews emit both HTML `noindex` and an `X-Robots-Tag: noindex` header. Robots permits fetching pages so crawlers can see those instructions; a blanket Disallow would prevent that. `robots.txt` excludes `/api/`, and only the indexable production build advertises the sitemap. Search exclusions are not authentication; retain deployment protection for private previews.

## Metadata and business information

- `src/lib/site.ts`: confirmed business name, email, Instagram, and Dallas studio address. Atlanta is the existing regional positioning; Dallas remains the physical address.
- `src/lib/seo.ts`: complete per-page title, description, canonical, Open Graph, Twitter/X card, and robots metadata; escaped JSON-LD helpers.
- Homepage: experiential fabrication and creative-production title and description.
- Gallery: unique portfolio metadata; its visually hidden `Our Work` H1 remains.
- Project pages: editable project metadata and unique photo-derived fallback descriptions, with noindex until approved.
- `/social-image`: statically rendered 1200×630 PNG using the existing logo and brand palette. Gallery/project shares use supplied full-color photography; no stock or invented imagery.

The homepage emits an Organization with the confirmed address, email, logo, website, and Instagram. We did not claim LocalBusiness opening hours, walk-in access, telephone, reviews, ratings, or awards. Gallery and project pages emit BreadcrumbList data. JSON-LD is tested for parseability, expected types/properties, URLs, and sequence; this is not a Google rich-result certification or guarantee.

## Publishing project pages

All twelve current entries remain photo records with unapproved titles/descriptions. Their existing `/work/project-XX` routes are retained, carry noindex, and are excluded from the sitemap. The photo wall continues working exactly as a photo viewer. The launch sitemap currently contains only `/` and `/work`.

In `src/lib/gallery.ts`, each project supports:

- `slug`: an approved descriptive lowercase URL; do not infer it from a client logo alone.
- `title` and `description`: approved project name and summary.
- `services`: approved relevant services.
- `seo.title`, `seo.description`, optional `seo.image`, and `seo.imageAlt`.
- `cover`, `alt`, `photos`, and crop `position`.
- `client`, `location`, and `year` when confirmed.
- `updatedAt`: real content update date, optionally used as sitemap lastmod.
- `published: true`: explicit approval to publish.

`isPublishedProject` checks the publish switch, descriptive slug, title, summary, services, and SEO copy before permitting indexing/sitemap inclusion. Do not change generic slugs without adding redirects for shared URLs. Approved projects automatically get real href links in the gallery: ordinary clicks still expand the photograph, and opening the link in a new tab accesses the case study. Existing next-project/all-work links also remain crawlable. Review case-study copy and any still-empty fields before publishing. There is no hidden SEO-only keyword copy.

## Migration redirects

`config/legacy-redirects.mjs` is the empty, documented mapping list consumed by `next.config.mjs`. Add only confirmed legacy Squarespace paths and their final internal destinations. Next emits permanent 308 redirects. Export the old site's URLs first, including high-traffic pages, image/share URLs where relevant, and any confirmed project URLs. Avoid wildcard catch-alls, loops, and redirect chains. Unknown routes must retain a real 404. No Squarespace URLs were guessed.

## Semantics and performance audit

Already present and preserved:

- One H1 per page; accessible text for the homepage graphic headline; semantic section headings, real navigation links, landmarks, skip link, and image alt text.
- Self-hosted fonts with swap; intrinsic/reserved image dimensions; Next image optimization, responsive sources, lazy loading below the fold, and above-fold priorities.
- Reduced-motion support, batched scroll/parallax updates, observer-driven once-only reveals, offscreen tiger-animation suspension, and mobile displacement-filter avoidance.
- Native modal focus containment, Escape/Back handling, and no animation dependency or analytics script.

Implemented performance improvements:

- Gallery image sizes now reflect wide versus narrow desktop tiles and mobile pairs instead of requesting 65vw/96vw for every photograph.
- Headline image sizes match its actual responsive layout.
- The hero video pauses outside the viewport and in background tabs; the existing reduced-motion path still avoids loading its source.
- The decorative gnome has empty alt text. The text/image headline continues to be announced once.

Remaining considerations:

- Hero video is about 6.1 MB, poster about 460 KB, original gallery photos about 1.1–2.0 MB each. Next optimizes displayed photographs, but the video remains the main media-budget opportunity. Consider an approved shorter/mobile video export and compare quality before replacing footage.
- The existing Cinematografica Heavy trial TTF is about 244 KB. Supply the licensed WOFF2 webfont before launch; do not manufacture a license or silently replace the approved typography.
- The original tiger paths are ~11 KB of generated source and retain the existing low-frequency animation. No animation package was added.
- Local builds and response checks do not measure real-user LCP, INP, or CLS. Run mobile Lighthouse/PageSpeed and field monitoring on the public production domain; no CWV score or improvement is claimed here.
- Contact delivery is still unconfigured and the footer still contains its original contact placeholder. These were not redesigned as part of SEO.

## Verification

```sh
npm run lint
npm run build
npm run typecheck
npm run test:seo
```

`npm run verify:seo -- <local-server-url> <expected-canonical-origin> [indexable]` checks fourteen current pages, unique titles/descriptions, canonical/OG consistency, cards/images, JSON-LD, one H1, internal links, real 404/noindex behavior, and sitemap/robots output. It currently expects the twelve project entries to be drafts; update that expectation as projects are published.

Test launch and preview with separate builds (never deploy the test origin):

```sh
SITE_URL=https://studio.example SITE_INDEXING_ENABLED=true VERCEL_ENV=production npm run build
SITE_URL=https://studio.example SITE_INDEXING_ENABLED=true VERCEL_ENV=production npm start -- --port 3001
npm run verify:seo -- http://localhost:3001 https://studio.example indexable
# Stop that server before rebuilding, then repeat with VERCEL_ENV=preview.
# Omit the final 'indexable' argument for the preview check.
```

Configuration tests cover explicit launch opt-in, preview protection, missing/invalid canonical configuration, and redirect loops/chains. HTTP verification checks emitted responses rather than just source objects.

## Required before launch

1. Confirm the canonical domain, set `SITE_URL`, and verify the chosen www/non-www variant and host-level redirects.
2. Obtain legacy Squarespace URL inventory and approve redirects.
3. Supply approved project details/services and descriptive slugs; keep incomplete projects noindex.
4. Replace the trial font with a licensed webfont; finish contact delivery and any outstanding content approvals.
5. Set the launch switch only on the production build. Check deployed headers, HTML, robots, sitemap, and social cards again.
6. Run Google Rich Results Test / Schema Markup Validator and test social previews against the accessible production URLs.
7. Verify ownership in Google Search Console, submit the production sitemap, inspect representative URLs, and monitor crawl/indexing reports and real-user performance.

No DNS, deployment, domain migration, Search Console verification, indexing submission, or ranking claim is included in this implementation.

## References

- Google: https://developers.google.com/search/docs/crawling-indexing/block-indexing
- Google: https://developers.google.com/search/docs/appearance/structured-data/organization
- Installed Next.js 16.4.6 documentation: Metadata API, robots, sitemap, JSON-LD, ImageResponse, and redirect/header configuration.

### Checks completed locally (November 15, 2026)

- Launch-mode build with a reserved example origin: passed production compilation and TypeScript checks.
- Launch-mode HTTP audit: all 14 content pages and 14 internal destinations passed; two sitemap URLs, 12 noindex draft pages, social image responses, JSON-LD, and missing-project 404 verified.
- Preview-mode build with the indexing switch deliberately inherited as `true`: passed; all pages retained noindex headers/metadata and the sitemap was empty.
- Four configuration/migration tests passed. Lint and final default-configuration build/typecheck passed.
- Inspected the generated 1200×630 social card. The browser still exposes the existing 12 photo tiles and hidden gallery H1, with the new portfolio metadata title.
- No external rich-result validator, production crawl, Search Console, or field-performance measurement was completed. The example origin was used only for local verification; it is not saved as the production domain.
