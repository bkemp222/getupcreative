import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const source = await readFile(new URL('../src/components/GoogleAnalytics.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
function setup(saved = null, id = 'G-ZZEW8FQTH5') {
  const handlers = new Map();
  const values = new Map(saved ? [['getup-analytics-consent', saved]] : []);
  const window = { addEventListener: (key, fn) => handlers.set(key, fn), removeEventListener: key => handlers.delete(key) };
  const exports = {};
  let enabled = false;
  let effect;
  vm.runInNewContext(compiled, {
    exports, window, process: { env: { NEXT_PUBLIC_GA_ID: id } },
    localStorage: { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) },
    require(name) {
      if (name === 'react') return { useEffect: fn => { effect = fn; }, useRef: current => ({ current }), useState: () => [false, value => { enabled = value; }] };
      if (name === 'next/script') return { default: 'script' };
      return require(name);
    },
  });
  exports.GoogleAnalytics();
  effect();
  return { window, values, enabled: () => enabled, effect, consent: detail => handlers.get('getup:analytics-consent')?.({ detail }), commands: () => (window.dataLayer || []).map(args => Array.from(args)) };
}
test('no tag or queued measurement before explicit consent', () => {
  for (const choice of [null, 'denied', 'unknown']) {
    const h = setup(choice);
    assert.equal(h.enabled(), false);
    assert.equal(h.window.gtag, undefined);
    assert.equal(h.window['ga-disable-G-ZZEW8FQTH5'], true);
  }
});
test('grant initializes only once, including effect replay and repeated consent events', () => {
  const h = setup();
  h.consent('granted'); h.consent('granted'); h.effect();
  assert.equal(h.enabled(), true);
  const configs = h.commands().filter(command => command[0] === 'config');
  assert.equal(configs.length, 1);
  assert.equal(configs[0][1], 'G-ZZEW8FQTH5');
  assert.equal(configs[0][2].allow_google_signals, false);
  assert.equal(h.commands().filter(command => command[0] === 'event').length, 0);
  for (const command of h.commands().filter(command => command[0] === 'consent')) {
    assert.equal(command[2].ad_storage, 'denied');
    assert.equal(command[2].ad_user_data, 'denied');
    assert.equal(command[2].ad_personalization, 'denied');
  }
});
test('revocation disables collection and repeated grant cannot duplicate initialization', () => {
  const h = setup('granted');
  h.consent('denied');
  assert.equal(h.window['ga-disable-G-ZZEW8FQTH5'], true);
  assert.equal(h.values.get('getup-analytics-consent'), 'denied');
  h.consent('granted'); h.consent('granted');
  assert.equal(h.window['ga-disable-G-ZZEW8FQTH5'], false);
  assert.equal(h.commands().filter(command => command[0] === 'config').length, 1);
  assert.equal(h.commands().filter(command => command[0] === 'event').length, 1);
});
test('absent measurement ID leaves analytics disabled', () => {
  const h = setup('granted', '');
  assert.equal(h.enabled(), false);
  assert.deepEqual(h.commands(), []);
});
