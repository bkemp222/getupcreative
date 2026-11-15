import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const compile = async path => ts.transpileModule(await readFile(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const policyExports = {};
vm.runInNewContext(await compile('../src/lib/analytics-policy.ts'), { exports: policyExports });
const approvedEnv = { VERCEL: '1', ANALYTICS_GEO_VERIFIED: 'true', ANALYTICS_US_DEFAULT_ON_STATES: 'GA,TX' };
const regional = (country, state, env = approvedEnv, gpc = false) => policyExports.regionalAnalyticsPolicy(new Headers({ ...(country ? { 'x-vercel-ip-country': country } : {}), ...(state ? { 'x-vercel-ip-country-region': state } : {}), ...(gpc ? { 'sec-gpc': '1' } : {}) }), env);
const clientCode = await compile('../src/lib/analytics-client.ts');
const componentCode = await compile('../src/components/GoogleAnalytics.tsx');
const routeCode = await compile('../src/app/api/analytics-policy/route.ts');
const settle = () => new Promise(resolve => setImmediate(resolve));
function harness({ policy = regional('US', 'GA'), saved = null, id = 'G-ZZEW8FQTH5', gpc = false, failure = false, deferred = false } = {}) {
  const handlers = new Map();
  const values = new Map(saved ? [['getup-analytics-consent', saved]] : []);
  const window = { addEventListener: (name, listener) => handlers.set(name, listener) };
  const exports = {}; let requests = 0; let release;
  vm.runInNewContext(clientCode, {
    exports, window, navigator: { globalPrivacyControl: gpc }, process: { env: { NEXT_PUBLIC_GA_ID: id } }, AbortSignal,
    localStorage: { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) },
    fetch: async () => {
      requests++;
      if (deferred) await new Promise(resolve => { release = resolve; });
      if (failure) throw new Error('No regional response');
      return { ok: true, json: async () => policy };
    },
  });
  const component = {};
  vm.runInNewContext(componentCode, {
    exports: component, process: { env: { NEXT_PUBLIC_GA_ID: id } },
    require(name) {
      if (name === '@/lib/analytics-client') return exports;
      if (name === 'react') return { useEffect() {}, useSyncExternalStore: (_, snapshot) => snapshot() };
      if (name === 'next/script') return { default: 'script' };
      return require(name);
    },
  });
  exports.startAnalytics();
  return { ...exports, window, values, render: component.GoogleAnalytics, release: () => release(), requests: () => requests,
    commands: () => (window.dataLayer || []).map(args => Array.from(args)),
    storage: value => { if (value === null) values.delete('getup-analytics-consent'); else values.set('getup-analytics-consent', value); handlers.get('storage')({ key: 'getup-analytics-consent' }); } };
}
for (const [name, options, expected] of [
  ['approved US visitor, no saved preference', {}, true],
  ['US visitor with saved opt-out', { saved: 'denied' }, false],
  ['opt-in region, no preference', { policy: regional('DE') }, false],
  ['opt-in region with saved consent', { policy: regional('GB'), saved: 'granted' }, true],
  ['unknown region, no preference', { policy: regional(null) }, false],
  ['unknown region with saved consent', { policy: regional(null), saved: 'granted' }, true],
  ['US state not approved for default-on', { policy: regional('US', 'CA') }, false],
  ['missing US state', { policy: regional('US') }, false],
  ['unverified Vercel routing', { policy: regional('US', 'GA', { ...approvedEnv, ANALYTICS_GEO_VERIFIED: 'false' }) }, false],
  ['forged geo outside Vercel', { policy: regional('US', 'GA', { ...approvedEnv, VERCEL: undefined }) }, false],
  ['failed region lookup', { failure: true }, false],
  ['GPC overrides saved permission', { saved: 'granted', gpc: true }, false],
  ['server GPC overrides US default', { policy: regional('US', 'GA', approvedEnv, true) }, false],
  ['missing GA configuration', { id: '' }, false],
]) test(name, async () => {
  const h = harness(options);
  assert.equal(h.render(), null, 'No script before region policy resolves');
  await settle();
  assert.equal(h.getAnalyticsState().allowed, expected);
  assert.equal(Boolean(h.render()), expected, 'Actual GoogleAnalytics render gates the external script');
  assert.equal(h.commands().filter(command => command[0] === 'config').length, expected ? 1 : 0);
});
test('no duplicate initialization or automatic manual route events; advertising remains denied', async () => {
  const h = harness(); await settle();
  h.startAnalytics(); h.setAnalyticsPreference('granted'); h.setAnalyticsPreference('granted');
  assert.equal(h.requests(), 1);
  assert.equal(h.commands().filter(command => command[0] === 'config').length, 1);
  assert.equal(h.commands().filter(command => command[0] === 'event').length, 0);
  const config = h.commands().find(command => command[0] === 'config')[2];
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  for (const command of h.commands().filter(command => command[0] === 'consent')) {
    for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization']) assert.equal(command[2][key], 'denied');
  }
});
test('opt-out immediately disables measurement, unmounts script, persists and survives subsequent callbacks', async () => {
  const h = harness(); await settle(); h.analyticsLoaded();
  assert.equal(h.getAnalyticsState().status, 'on');
  h.setAnalyticsPreference('denied');
  assert.equal(h.window['ga-disable-G-ZZEW8FQTH5'], true);
  assert.equal(h.values.get('getup-analytics-consent'), 'denied');
  assert.equal(h.render(), null);
  const commands = h.commands().length;
  h.analyticsLoaded(); h.startAnalytics(); h.setAnalyticsPreference('denied');
  assert.equal(h.commands().length, commands, 'No subsequent measurement commands while opted out');
  assert.equal(h.getAnalyticsState().status, 'off');
});
test('late regional response cannot override an opt-out made while loading', async () => {
  const h = harness({ deferred: true });
  h.setAnalyticsPreference('denied'); h.release(); await settle();
  assert.equal(h.getAnalyticsState().allowed, false);
  assert.equal(h.commands().length, 0);
});
test('saved preference changes in another tab are honored', async () => {
  const h = harness(); await settle();
  h.storage('denied');
  assert.equal(h.window['ga-disable-G-ZZEW8FQTH5'], true);
  h.storage('granted'); h.storage('granted');
  assert.equal(h.getAnalyticsState().allowed, true);
  assert.equal(h.commands().filter(command => command[0] === 'config').length, 1);
  assert.equal(h.commands().filter(command => command[0] === 'event').length, 1);
});
test('script failure is not reported as active analytics', async () => {
  const h = harness(); await settle(); h.analyticsFailed();
  assert.equal(h.getAnalyticsState().status, 'unavailable');
});
test('invalid or blank state allowlists never enable automatic analytics', () => {
  for (const list of ['', '*', 'GA,INVALID', 'GA,']) assert.equal(regional('US', 'GA', { ...approvedEnv, ANALYTICS_US_DEFAULT_ON_STATES: list }).defaultAllowed, false);
});
test('regional endpoint exposes no IP/geography and cannot be cached across visitors', () => {
  const exports = {};
  vm.runInNewContext(routeCode, { exports, Response, process: { env: approvedEnv }, require: () => policyExports });
  const response = exports.GET(new Request('https://example.com/api/analytics-policy', { headers: { 'x-vercel-ip-country': 'US', 'x-vercel-ip-country-region': 'GA' } }));
  assert.equal(exports.dynamic, 'force-dynamic');
  for (const name of ['Cache-Control', 'CDN-Cache-Control', 'Vercel-CDN-Cache-Control']) assert.match(response.headers.get(name), /no-store/);
  return response.json().then(body => assert.deepEqual(Object.keys(body).sort(), ['defaultAllowed', 'globalPrivacyControl', 'reason']));
});
