import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { onRequestPost } from '../functions/api/quote.ts';
const env = { RESEND_API_KEY: 'test-only', QUOTE_TO: 'test@example.test', QUOTE_FROM: 'test@example.test' };
function payload(overrides = {}) {
  const form = new FormData();
  const values = { name: 'Test Homeowner', phone: '7604223069', city: 'Palm Desert', propertySize: '1,500–2,500 sq ft', stories: 'One story', contactPreference: 'Text', panelCount: '24', windowCount: '18', notes: 'Gate access arranged', maintenance: 'Interested in recurring care', ...overrides };
  for (const [key, value] of Object.entries(values)) if (value !== null) form.set(key, value);
  form.append('services', 'solar'); form.append('services', 'windows');
  return form;
}
const request = (form, json = true) => new Request('https://example.test/api/quote/', { method: 'POST', body: form, headers: json ? { Accept: 'application/json' } : {} });

test('emails property details, bundle/maintenance interest, escaped notes and photo bytes', async t => {
  let delivery;
  t.mock.method(globalThis, 'fetch', async (url, options) => { assert.equal(url, 'https://api.resend.com/emails'); delivery = JSON.parse(options.body); return new Response('{}', { status: 200 }); });
  const form = payload({ notes: '<script>alert(1)</script>\nGate access arranged' });
  const photo = await readFile(new URL('../src/assets/photos/desert-house.jpg', import.meta.url));
  form.append('photos', new File([photo], 'property view.jpg', { type: 'image/jpeg' }));
  form.append('services', 'solar'); form.append('services', 'toString');
  const response = await onRequestPost({ request: request(form), env });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.match(delivery.text, /City: Palm Desert/); assert.match(delivery.text, /Solar panels: 24/); assert.match(delivery.text, /Windows: 18/); assert.match(delivery.text, /Bundle review: Multiple services/); assert.match(delivery.text, /Recurring care: Interested/);
  assert.match(delivery.html, /&lt;script&gt;/); assert.doesNotMatch(delivery.html, /<script>/);
  assert.equal(delivery.attachments[0].filename, 'property_view.jpg');
  assert.deepEqual(Buffer.from(delivery.attachments[0].content, 'base64'), photo);
  assert.equal(delivery.subject.match(/Solar panel cleaning/g).length, 1);
});

test('rejects missing contact, city, services and invalid numeric scope before delivery', async t => {
  t.mock.method(globalThis, 'fetch', () => { throw new Error('Should not deliver'); });
  for (const overrides of [{ name: '' }, { phone: '123' }, { phone: '123456789012' }, { city: '' }, { panelCount: '-1' }, { windowCount: '2.5' }]) {
    const response = await onRequestPost({ request: request(payload(overrides)), env }); assert.equal(response.status, 400);
  }
  const form = payload(); form.delete('services'); form.append('services', 'toString');
  assert.equal((await onRequestPost({ request: request(form), env })).status, 400);
});

test('rejects excessive, oversize and falsely labeled photos', async () => {
  const fake = payload(); fake.append('photos', new File(['not an image'], 'fake.jpg', { type: 'image/jpeg' }));
  assert.equal((await onRequestPost({ request: request(fake), env })).status, 400);
  const tooMany = payload(); for (let i=0; i<4; i++) tooMany.append('photos', new File(['x'], `${i}.jpg`, { type: 'image/jpeg' }));
  assert.equal((await onRequestPost({ request: request(tooMany), env })).status, 413);
  const tooBig = payload(); tooBig.append('photos', new File([new Uint8Array(4*1024*1024+1)], 'large.jpg', { type: 'image/jpeg' }));
  assert.equal((await onRequestPost({ request: request(tooBig), env })).status, 413);
  const streamRequest = new Request('https://example.test/api/quote/', { method: 'POST', body: new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(16*1024*1024+1)); controller.close(); } }), duplex: 'half', headers: { Accept: 'application/json', 'Content-Type': 'multipart/form-data; boundary=test' } });
  assert.equal((await onRequestPost({ request: streamRequest, env })).status, 413);
});

test('honeypot does not send and delivery failures remain recoverable', async t => {
  const form = payload(); form.set('botcheck','bot');
  assert.equal((await onRequestPost({ request: request(form), env: {} })).status, 200);
  assert.equal((await onRequestPost({ request: request(payload()), env: {} })).status, 503);
  t.mock.method(globalThis, 'fetch', async () => new Response('unavailable', { status: 500 }));
  assert.equal((await onRequestPost({ request: request(payload()), env })).status, 502);
  t.mock.restoreAll();
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Offline'); });
  assert.equal((await onRequestPost({ request: request(payload()), env })).status, 502);
});

test('no-JavaScript posts redirect to success or a meaningful failure URL', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response('{}'));
  const success = await onRequestPost({ request: request(payload(), false), env });
  assert.equal(success.status,303); assert.equal(success.headers.get('Location'), 'https://example.test/thanks/');
  const fail = await onRequestPost({ request: request(payload({ phone: '' }), false), env });
  assert.equal(fail.status,303); assert.equal(fail.headers.get('Location'), 'https://example.test/contact/?delivery=failed#quote');
});
