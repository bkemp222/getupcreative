import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const source = await readFile(new URL('../src/components/Contact.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;

// Exercise the actual form submit handler without sending messages or altering the API.
function formHarness({ status = 200, invalid = false, networkError = false } = {}) {
  const calls = { requests: 0, resets: 0, focus: 0, routes: [], scroll: [], states: [] };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === 'react') return {
        useRef: current => ({ current }),
        useState: initial => [initial, next => calls.states.push(next)],
      };
      if (name === 'next/navigation') return { useRouter: () => ({ push: (...args) => calls.routes.push(args) }) };
      if (name === 'next/image') return { default: 'img' };
      return require(name);
    },
    window: { scrollTo: options => calls.scroll.push(options) },
    FormData: class { *[Symbol.iterator]() { yield ['name', 'Test']; yield ['email', 'test@example.com']; yield ['message', 'A local test message.']; } },
    async fetch() {
      calls.requests++;
      if (networkError) throw new Error('Offline');
      return { ok: status >= 200 && status < 300, json: async () => ({ message: status === 200 ? 'Accepted' : 'Not sent' }) };
    },
  });
  const findForm = node => {
    if (!node || typeof node !== 'object') return undefined;
    if (node.type === 'form') return node;
    return [node.props?.children].flat(Infinity).map(findForm).find(Boolean);
  };
  const form = findForm(exports.Contact());
  const event = { preventDefault() {}, currentTarget: {
    querySelectorAll: () => [
      { name: 'name', value: invalid ? '' : 'Test', validity: { valid: !invalid }, focus: () => calls.focus++ },
      { name: 'email', value: 'test@example.com', validity: { valid: true } },
      { name: 'message', value: 'A local test message.', validity: { valid: true } },
    ],
    reset: () => calls.resets++,
  } };
  return { calls, submit: () => form.props.onSubmit(event) };
}

test('confirmed backend success redirects once and keeps submission locked during routing', async () => {
  const { calls, submit } = formHarness();
  await submit();
  await submit();
  assert.equal(calls.requests, 1);
  assert.equal(calls.routes.length, 1);
  assert.equal(calls.routes[0][0], '/thank-you');
  assert.equal(calls.routes[0][1].scroll, false);
  assert.equal(calls.scroll[0].top, 0);
  assert.equal(calls.resets, 1);
});
test('client validation focuses the invalid field without calling the backend or redirecting', async () => {
  const { calls, submit } = formHarness({ invalid: true });
  await submit();
  assert.equal(calls.requests, 0);
  assert.equal(calls.routes.length, 0);
  assert.equal(calls.focus, 1);
});
for (const status of [400, 503]) test(`backend ${status} preserves fields, reports failure and allows retry`, async () => {
  const { calls, submit } = formHarness({ status });
  await submit(); await submit();
  assert.equal(calls.requests, 2);
  assert.equal(calls.routes.length, 0);
  assert.equal(calls.resets, 0);
  assert.ok(calls.states.includes('Not sent'));
});
test('network failure never redirects or clears the form', async () => {
  const { calls, submit } = formHarness({ networkError: true });
  await submit();
  assert.equal(calls.routes.length, 0);
  assert.equal(calls.resets, 0);
  assert.ok(calls.states.some(value => typeof value === 'string' && value.includes('Unable to confirm your submission')));
});
