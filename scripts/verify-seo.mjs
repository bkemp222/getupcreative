import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Verify a running production build. These arguments are local test expectations, not site settings.
const base = process.argv[2] ?? 'http://localhost:3000';
const origin = process.argv[3];
const indexable = process.argv[4] === 'indexable';
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)]));
const data = await readFile(new URL('../src/lib/gallery.ts', import.meta.url), 'utf8');
const slugs = [...data.matchAll(/slug: '([^']+)'/g)].map(match => match[1]);
const paths = ['/', '/work', '/privacy-policy', ...slugs.map(slug => `/work/${slug}`)];
const titles = new Set();
const descriptions = new Set();
const internalLinks = new Set();
for (const path of paths) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, path);
  if (!indexable) assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/, path);
  const html = await response.text();
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${path}: one H1`);
  const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1] ?? '');
  assert.ok(title && !titles.has(title), `${path}: unique title`); titles.add(title);
  const meta = Object.fromEntries([...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => { const a = attrs(tag); return [a.name ?? a.property, a.content]; }));
  assert.ok(meta.description && !descriptions.has(meta.description), `${path}: unique description`); descriptions.add(meta.description);
  const placeholder = /\/work\//.test(path); // Update expectations when approved case studies are published.
  assert.match(meta.robots ?? '', !indexable || placeholder ? /noindex/ : /^index,/, `${path}: indexing policy`);
  assert.equal(meta['og:title'], title);
  assert.equal(meta['twitter:card'], 'summary_large_image');
  assert.equal(meta['twitter:description'], meta.description);
  assert.ok(meta['og:image'] && meta['twitter:image']);
  const canonical = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attrs(tag)).find(a => a.rel === 'canonical')?.href;
  if (origin) {
    assert.equal(new URL(canonical).href, new URL(path, origin).href);
    assert.equal(new URL(meta['og:url']).href, new URL(canonical).href);
    assert.ok(meta['og:image'].startsWith(origin));
  }
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  if (origin) {
    const schema = schemas.find(item => item['@type'] === (path === '/' ? 'Organization' : 'BreadcrumbList'));
    assert.ok(schema, `${path}: structured data`);
    assert.equal(schema['@context'], 'https://schema.org');
    if (path === '/') {
      assert.equal(schema.url, new URL('/', origin).href);
      assert.equal(schema.address.addressLocality, 'Dallas');
      assert.equal(schema.sameAs[0], 'https://www.instagram.com/getupcreativeco/');
      assert.equal(schema.email, 'brad@getupcreative.com');
      for (const unsupported of ['telephone', 'openingHours', 'aggregateRating', 'review', 'award']) assert.equal(schema[unsupported], undefined);
    } else {
      schema.itemListElement.forEach((item, index) => assert.equal(item.position, index + 1));
      assert.equal(new URL(schema.itemListElement.at(-1).item).href, new URL(canonical).href);
    }
  }
  for (const [tag] of html.matchAll(/<a\b[^>]*>/g)) {
    const href = attrs(tag).href;
    if (href?.startsWith('/') && !href.startsWith('//')) internalLinks.add(new URL(href, base).pathname);
  }
  const imageUrl = new URL(meta['og:image']);
  const imageResponse = await fetch(new URL(imageUrl.pathname, base));
  assert.equal(imageResponse.status, 200, `${path}: social image`);
  assert.match(imageResponse.headers.get('content-type') ?? '', /^image\//);
}
for (const path of internalLinks) assert.equal((await fetch(new URL(path, base))).status, 200, `Internal link ${path}`);
const missing = await fetch(new URL('/work/not-a-real-project', base));
assert.equal(missing.status, 404);
assert.match(await missing.text(), /noindex/);
const robots = await (await fetch(new URL('/robots.txt', base))).text();
assert.match(robots, /Allow: \/\n/);
assert.match(robots, /Disallow: \/api\//);
assert.ok(!/Disallow: \/\s*\n/.test(robots), 'Do not prevent crawlers reading noindex');
const sitemapResponse = await fetch(new URL('/sitemap.xml', base));
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
assert.deepEqual(locations, indexable ? [new URL('/', origin).href, new URL('/work', origin).href, new URL('/privacy-policy', origin).href] : []);
assert.ok(!sitemap.includes('/api/'));
if (indexable) assert.ok(robots.includes(`${origin}/sitemap.xml`));
else assert.ok(!robots.includes('Sitemap:'));
console.log(`SEO verification passed: ${paths.length} pages, ${internalLinks.size} internal destinations, social images, JSON-LD, 404, robots and sitemap (${indexable ? 'launch' : 'preview'} policy).`);
