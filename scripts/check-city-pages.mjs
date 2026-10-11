import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

// Check the emitted HTML, not just the route generator: missing routes,
// inaccessible links and wrong native defaults are caught before deployment.
const cities = ['Cathedral City', 'Palm Springs', 'Rancho Mirage', 'Palm Desert', 'La Quinta', 'Indio', 'Indian Wells', 'Desert Hot Springs'];
const services = [
  ['solar-panel-cleaning', 'solar', 'Solar panel cleaning'],
  ['bird-proofing', 'birds', 'Bird proofing'],
  ['window-cleaning', 'windows', 'Window cleaning'],
  ['pressure-washing', 'pressure', 'Pressure washing'],
  ['junk-removal', 'junk', 'Junk removal'],
];
const root = resolve('dist');
assert.ok(existsSync(resolve(root, 'service-areas/index.html')), 'Run npm run build first.');
assert.equal(readdirSync(resolve(root, 'service-areas'), { withFileTypes: true }).filter(entry => entry.isDirectory()).length, cities.length);
const slug = city => city.toLowerCase().replaceAll(' ', '-');
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)].map(match => [match[1], match[2] ?? true]));
const text = html => html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

function checkPage(path, city, service) {
  const html = readFileSync(resolve(root, path, 'index.html'), 'utf8');
  assert.match(html, /data-page-theme="navy"/, path);
  const title = text(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? '');
  const headings = [...html.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gs)];
  assert.equal(headings.length, 1, `${path}: one h1`);
  if (city) {
    assert.ok(title.includes(city), `${path}: city title`);
    assert.ok(text(headings[0][1]).includes(city), `${path}: city heading`);
    assert.match(html, /data-quote-variant="navy"/, path);
    const citySelect = html.match(/<select\b[^>]*name="city"[^>]*>(.*?)<\/select>/s)?.[1];
    assert.ok(citySelect, `${path}: city selector`);
    const selected = [...citySelect.matchAll(/<option\b([^>]*)>(.*?)<\/option>/gs)].filter(option => attributes(option[1]).selected);
    assert.deepEqual(selected.map(option => text(option[2])), [city], `${path}: native city default`);
    assert.match(html, /action="\/api\/quote\/" method="post" enctype="multipart\/form-data"/, path);
    assert.equal([...html.matchAll(/data-step="\d"/g)].length, 4, `${path}: complete quote flow`);
  }
  if (service) {
    const [serviceSlug, id, name] = service;
    assert.ok(title.includes(name), `${path}: service title`);
    assert.equal(text(headings[0][1]), `${name} in ${city}.`, `${path}: complete readable heading`);
    const serviceInputs = [...html.matchAll(/<input\b[^>]*>/g)].map(input => attributes(input[0])).filter(input => input.name === 'services');
    assert.equal(serviceInputs.length, services.length, `${path}: all service controls`);
    assert.deepEqual(serviceInputs.filter(input => input.checked).map(input => input.value), [id], `${path}: native service default`);
    const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(script => JSON.parse(script[1]));
    assert.ok(schemas.some(schema => schema['@type'] === 'Service' && schema.areaServed?.name === city && schema.serviceType === name), `${path}: local service schema`);
    for (const other of services.filter(item => item[0] !== serviceSlug)) assert.ok(html.includes(`href="/service-areas/${slug(city)}/${other[0]}/"`), `${path}: related service link`);
    for (const other of cities.filter(item => item !== city)) assert.ok(html.includes(`href="/service-areas/${slug(other)}/${serviceSlug}/"`), `${path}: related city link`);
  }
  const canonical = attributes(html.match(/<link\b[^>]*rel="canonical"[^>]*>/)?.[0] ?? '').href;
  assert.ok(typeof canonical === 'string' && canonical.endsWith(`/${path}/`), `${path}: canonical`);
  for (const tag of html.matchAll(/<a\b[^>]*>/g)) {
    const href = attributes(tag[0]).href;
    if (typeof href !== 'string' || !href.startsWith('/')) continue;
    const pathname = new URL(href, 'https://clear-flow.pages.dev').pathname;
    assert.ok(existsSync(resolve(root, `.${pathname}`, 'index.html')), `${path}: broken link ${href}`);
  }
  for (const tag of html.matchAll(/<img\b[^>]*>/g)) {
    const image = attributes(tag[0]);
    assert.ok(typeof image.alt === 'string' && image.alt.length > 0, `${path}: descriptive image alt`);
    assert.ok(typeof image.src === 'string' && existsSync(resolve(root, `.${image.src}`)), `${path}: image asset exists`);
    assert.ok(image.width && image.height, `${path}: image dimensions reserve space`);
  }
}

checkPage('service-areas');
let count = 0;
for (const city of cities) {
  checkPage(`service-areas/${slug(city)}`, city);
  for (const service of services) {
    checkPage(`service-areas/${slug(city)}/${service[0]}`, city, service);
    count++;
  }
}
console.log(`Verified ${count} city/service pages, ${cities.length} city overviews and the directory: metadata, links, images, city/service defaults and complete quote forms.`);
