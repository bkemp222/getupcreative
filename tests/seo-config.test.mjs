import test from 'node:test';
import assert from 'node:assert/strict';
import { getSeoConfig } from '../src/lib/seo-config.mjs';
import { legacyRedirects } from '../config/legacy-redirects.mjs';

const production = { NODE_ENV: 'production', SITE_URL: 'https://studio.example', SITE_INDEXING_ENABLED: 'true' };
test('indexing requires an explicit launch switch and production build', () => {
  assert.equal(getSeoConfig({}).indexable, false);
  assert.equal(getSeoConfig({ ...production, SITE_INDEXING_ENABLED: 'false' }).indexable, false);
  assert.equal(getSeoConfig({ ...production, NODE_ENV: 'development' }).indexable, false);
  assert.equal(getSeoConfig(production).indexable, true);
  assert.equal(getSeoConfig({ ...production, VERCEL_ENV: 'production' }).indexable, true);
});
test('preview deployments stay noindex even when production variables are inherited', () => {
  for (const VERCEL_ENV of ['preview', 'development']) {
    assert.equal(getSeoConfig({ ...production, VERCEL_ENV }).indexable, false);
  }
});
test('launch cannot silently use a missing, insecure, or deployment canonical', () => {
  assert.throws(() => getSeoConfig({ ...production, SITE_URL: '' }));
  for (const SITE_URL of ['http://studio.example', 'https://localhost', 'https://preview.vercel.app', 'https://studio.example/work', 'https://studio.example?x=1', 'https://user:pass@studio.example', 'invalid']) {
    assert.throws(() => getSeoConfig({ ...production, SITE_URL }));
  }
  assert.equal(getSeoConfig({ ...production, SITE_URL: 'https://studio.example/' }).siteUrl, 'https://studio.example');
});
test('migration mappings are internal, unique, and have no chains or loops', () => {
  const sources = new Set(legacyRedirects.map(item => item.source));
  assert.equal(sources.size, legacyRedirects.length);
  for (const item of legacyRedirects) {
    assert.match(item.source, /^\/(?!\/)/);
    assert.match(item.destination, /^\/(?!\/)/);
    assert.notEqual(item.source, item.destination);
    assert.equal(sources.has(item.destination), false);
    assert.equal(item.permanent, true);
  }
});
