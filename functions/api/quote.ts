// Cloudflare Pages quote delivery. Credentials stay in the Pages environment.
interface Env { RESEND_API_KEY?: string; QUOTE_TO?: string; QUOTE_FROM?: string; }
const SERVICES: Record<string, string> = { solar: 'Solar panel cleaning', birds: 'Bird proofing', windows: 'Window cleaning', pressure: 'Pressure washing', junk: 'Junk removal' };
const MAX_REQUEST = 16 * 1024 * 1024;
const MAX_PHOTO = 4 * 1024 * 1024;
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const base64 = (bytes: Uint8Array) => {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 32768) binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  return btoa(binary);
};
const photoType = (bytes: Uint8Array) => {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if ([137,80,78,71,13,10,26,10].every((byte, i) => bytes[i] === byte)) return 'image/png';
  if (String.fromCharCode(...bytes.subarray(0,4)) === 'RIFF' && String.fromCharCode(...bytes.subarray(8,12)) === 'WEBP') return 'image/webp';
  return null;
};
export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
  const reply = (success: boolean, status: number, message?: string) => {
    if (wantsJson) return new Response(JSON.stringify({ success, ...(message ? { message } : {}) }), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
    const target = new URL(success ? '/thanks/' : '/contact/?delivery=failed#quote', request.url);
    return Response.redirect(target.href, 303);
  };
  const tooLarge = 'Your photos are too large. Choose up to 3 photos, no more than 4 MB each.';
  if (Number(request.headers.get('Content-Length')) > MAX_REQUEST) return reply(false, 413, tooLarge);
  let form: FormData;
  try {
    if (!request.body) return reply(false, 400, 'Your request was empty. Please try again.');
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_REQUEST) { await reader.cancel(); return reply(false, 413, tooLarge); }
      chunks.push(value);
    }
    const body = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    form = await new Response(body, { headers: { 'Content-Type': request.headers.get('Content-Type') ?? '' } }).formData();
  } catch { return reply(false, 400, 'We couldn’t read your request. Please try again.'); }
  if (form.get('botcheck')) return reply(true, 200);
  const read = (name: string, max = 200) => { const value = form.get(name); return typeof value === 'string' ? value.trim().slice(0, max) : ''; };
  const name = read('name', 120);
  const phone = read('phone', 40);
  if (!name) return reply(false, 400, 'Please add your name.');
  const digits = phone.replace(/\D/g, '');
  if (!/^\d{10}$/.test(digits) && !/^1\d{10}$/.test(digits)) return reply(false, 400, 'Please add a 10-digit US phone number.');
  const serviceIds = [...new Set(form.getAll('services').filter(value => typeof value === 'string').map(String))].filter(id => Object.hasOwn(SERVICES, id));
  if (!serviceIds.length) return reply(false, 400, 'Choose at least one service.');
  const city = read('city');
  if (!city) return reply(false, 400, 'Please choose your city.');
  for (const field of ['panelCount', 'windowCount']) {
    const value = read(field);
    if (value && (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 10000)) return reply(false, 400, 'Panel and window counts must be whole numbers between 1 and 10,000.');
  }
  const uploads = form.getAll('photos').filter((value): value is File => typeof value !== 'string' && value.size > 0);
  if (uploads.length > 3 || uploads.some(file => file.size > MAX_PHOTO)) return reply(false, 413, tooLarge);
  const attachments: { filename: string; content: string; content_type: string }[] = [];
  for (let index = 0; index < uploads.length; index++) {
    const file = uploads[index];
    const bytes = new Uint8Array(await file.arrayBuffer());
    const detectedType = photoType(bytes);
    if (!detectedType || detectedType !== file.type) return reply(false, 400, 'Photos must be valid JPG, PNG or WebP files.');
    const extension = detectedType === 'image/jpeg' ? 'jpg' : detectedType === 'image/png' ? 'png' : 'webp';
    const filename = file.name.replace(/\.[^.]*$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 70) || `property-${index + 1}`;
    attachments.push({ filename: `${filename}.${extension}`, content: base64(bytes), content_type: detectedType });
  }
  if (!env.RESEND_API_KEY || !env.QUOTE_TO || !env.QUOTE_FROM) {
    console.error('Quote delivery environment is incomplete');
    return reply(false, 503, 'Online delivery is temporarily unavailable. Please call or text 760-422-3069 for your free quote.');
  }
  const serviceLine = serviceIds.map(id => SERVICES[id]).join(', ');
  const rows: [string, string][] = [
    ['Name', name], ['Phone', phone], ['Contact preference', read('contactPreference') || 'Text'],
    ['Services', serviceLine], ['City', city], ['Property size', read('propertySize') || 'Not specified'],
    ['Stories', read('stories') || 'Not specified'],
    ...(serviceIds.includes('solar') ? [['Solar panels', read('panelCount') || 'Not sure'] as [string,string]] : []),
    ...(serviceIds.includes('windows') ? [['Windows', read('windowCount') || 'Not sure'] as [string,string]] : []),
    ...(serviceIds.includes('pressure') ? [['Surfaces', read('surfaces') || 'Not sure'] as [string,string]] : []),
    ...(serviceIds.includes('junk') ? [['Haul-away scope', read('junkAmount') || 'Not sure'] as [string,string]] : []),
    ['Recurring care', read('maintenance') ? 'Interested — include an optional schedule' : 'Not requested'],
    ['Bundle review', serviceIds.length > 1 ? 'Multiple services — check applicable bundle savings' : 'Single service'],
    ['Notes', read('notes', 1200) || 'None'], ['Property photos', String(attachments.length)],
  ];
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.QUOTE_FROM, to: env.QUOTE_TO.split(',').map(value => value.trim()).filter(Boolean), subject: `Quote request: ${name.replace(/[\r\n]/g, ' ')} (${serviceLine})`, text: rows.map(([key,value]) => `${key}: ${value}`).join('\n'), html: rows.map(([key,value]) => `<p><strong>${key}:</strong> ${escapeHtml(value).replace(/\n/g, '<br>')}</p>`).join(''), ...(attachments.length ? { attachments } : {}) }),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) { console.error('Quote delivery provider returned', response.status); return reply(false, 502, 'We couldn’t deliver your request. Please try again, or call 760-422-3069.'); }
    return reply(true, 200);
  } catch { return reply(false, 502, 'We couldn’t connect to send your request. Please try again, or call 760-422-3069.'); }
};
