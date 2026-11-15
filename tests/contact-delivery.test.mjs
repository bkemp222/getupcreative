import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../src/app/api/contact/route.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const inquiry = { name: 'Website Test', email: 'visitor@example.com', message: 'A custom event installation.', website: '' };
function harness({ configured = true, accepted = true, result = { id: 'provider-email-id' }, offline = false } = {}) {
  const calls = [];
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require(name) {
      if (name === 'next/server') return { NextResponse: Response };
      if (name === '@/lib/site') return { site: { email: 'brad@getupcreative.com' } };
      throw new Error(`Unexpected import ${name}`);
    },
    process: { env: configured ? { RESEND_API_KEY: 'test-only-key', CONTACT_FROM_EMAIL: 'website@resend.getupcreative.com' } : {} },
    AbortSignal,
    async fetch(url, options) {
      calls.push({ url, ...options });
      if (offline) throw new Error('Network unavailable');
      return { ok: accepted, json: async () => result };
    },
  });
  return { calls, submit: (data = inquiry) => exports.POST(new Request('https://example.com/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })) };
}
test('accepted mail goes only to Brad and replies to the visitor', async () => {
  const { calls, submit } = harness();
  const response = await submit({ ...inquiry, to: 'attacker@example.com', name: 'Website\nTest', message: '<b>A custom installation</b>' });
  assert.equal(response.status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://api.resend.com/emails');
  const payload = JSON.parse(calls[0].body);
  assert.deepEqual(payload.to, ['brad@getupcreative.com']);
  assert.equal(payload.reply_to, inquiry.email);
  assert.equal(payload.from, 'website@resend.getupcreative.com');
  assert.ok(!payload.subject.includes('\n'));
  assert.ok(payload.text.includes("What's the big idea?"));
  assert.equal(payload.html, undefined);
});
test('missing configuration does not send or report success', async () => {
  const { calls, submit } = harness({ configured: false });
  assert.equal((await submit()).status, 503);
  assert.equal(calls.length, 0);
});
test('invalid or honeypot submissions never reach the email provider', async () => {
  const { calls, submit } = harness();
  for (const data of [{ ...inquiry, website: 'spam' }, { ...inquiry, email: 'invalid' }, { ...inquiry, message: 'short' }, { ...inquiry, name: '' }]) {
    assert.equal((await submit(data)).status, 400);
  }
  assert.equal(calls.length, 0);
});
for (const options of [{ accepted: false }, { result: {} }, { offline: true }]) test(`delivery failure stays non-success: ${JSON.stringify(options)}`, async () => {
  const { submit } = harness(options);
  const response = await submit();
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes('test-only-key'));
});

test('requested date is optional and included in the email when selected', async () => {
  for (const neededBy of ['', '2028-02-29', '2027-06-15']) {
    const { calls, submit } = harness();
    assert.equal((await submit({ ...inquiry, neededBy })).status, 200);
    assert.ok(JSON.parse(calls[0].body).text.includes(`When's the big idea?: ${neededBy || 'Not specified'}`));
  }
});
test('invalid dates are rejected before email delivery', async () => {
  const { calls, submit } = harness();
  for (const neededBy of ['2027-02-29', '2027-04-31', 'tomorrow', '2027-13-01', null, 123]) {
    assert.equal((await submit({ ...inquiry, neededBy })).status, 400);
  }
  assert.equal(calls.length, 0);
});
