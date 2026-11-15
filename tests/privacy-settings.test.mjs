import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require = createRequire(import.meta.url);
const code = ts.transpileModule(await readFile(new URL('../src/components/PrivacySettings.tsx', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
function render(state) {
  const exports = {}; const choices = [];
  vm.runInNewContext(code, { exports, require(name) {
    if (name === 'react') return { useSyncExternalStore: (_, snapshot) => snapshot() };
    if (name === '@/lib/analytics-client') return { getAnalyticsState: () => state, subscribeAnalytics() {}, getServerAnalyticsState() {}, setAnalyticsPreference: choice => choices.push(choice) };
    if (name.endsWith('.css')) return { default: {} };
    return require(name);
  } });
  const flatten = node => !node || typeof node !== 'object' ? [] : [node, ...[node.props?.children].flat(Infinity).flatMap(flatten)];
  return { nodes: flatten(exports.PrivacySettings()), choices };
}
test('default-on tracking is displayed and the disable control invokes the same consent store', () => {
  const h = render({ allowed: true, status: 'on', reason: 'us-default', preference: null });
  const status = h.nodes.find(node => node.props.role === 'status');
  assert.match(status.props.children.join(''), /Analytics is on/);
  h.nodes.find(node => node.type === 'button' && node.props.children === 'Disable analytics').props.onClick();
  assert.deepEqual(h.choices, ['denied']);
});
test('unavailable tag is not presented as active and GPC disables the allow action', () => {
  const h = render({ allowed: false, status: 'off', reason: 'gpc', preference: 'granted' });
  assert.equal(h.nodes.find(node => node.type === 'button' && node.props.children === 'Allow analytics').props.disabled, true);
  assert.match(h.nodes.find(node => node.props.role === 'status').props.children.join(''), /Analytics is off/);
  assert.equal(h.choices.length, 0);
});
