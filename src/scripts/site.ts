export {};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scrollBehavior: ScrollBehavior = reducedMotion ? 'auto' : 'smooth';
const serviceNames: Record<string, string> = { solar: 'Solar panels', windows: 'Windows', pressure: 'Pressure washing', junk: 'Junk removal', birds: 'Bird proofing' };
const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
const quote = document.getElementById('quote');
const formStatus = form?.querySelector<HTMLElement>('[data-form-status]');
const panels = [...(form?.querySelectorAll<HTMLElement>('[data-step]') ?? [])];
let stage = 0;
let highestStage = 0;
let photos: File[] = [];
let previewUrls: string[] = [];

const setStatus = (message: string, error = false) => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.classList.toggle('is-error', error);
};
const defaultStatus = formStatus?.textContent?.trim() ?? '';
const initial = [...document.querySelectorAll<HTMLInputElement>('input[data-service]:checked')].map(input => input.dataset.service!);
try {
  initial.push(...JSON.parse(sessionStorage.getItem('clear-flow-services') ?? '[]').filter((id: string) => Object.hasOwn(serviceNames, id)));
} catch { /* Storage may be unavailable in a private browsing context. */ }
new URLSearchParams(window.location.search).getAll('service').forEach(id => { if (Object.hasOwn(serviceNames, id)) initial.push(id); });
const selected = new Set<string>(initial);

function renderSummary() {
  const summary = form?.querySelector<HTMLElement>('[data-quote-summary]');
  if (summary) summary.textContent = [...selected].map(id => serviceNames[id]).join(' · ') || 'Choose at least one service.';
  const property = form?.querySelector<HTMLElement>('[data-property-summary]');
  if (property && form) {
    const data = new FormData(form);
    property.textContent = [data.get('city'), data.get('propertySize'), data.get('stories'), photos.length ? `${photos.length} photo${photos.length === 1 ? '' : 's'}` : null].filter(Boolean).join(' · ');
  }
}
function renderSelection() {
  document.querySelectorAll<HTMLInputElement>('input[data-service]').forEach(input => { input.checked = selected.has(input.dataset.service!); });
  document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach(button => {
    const on = selected.has(button.dataset.add!);
    button.setAttribute('aria-pressed', String(on));
    const off = button.querySelector<HTMLElement>('[data-label-off]');
    const added = button.querySelector<HTMLElement>('[data-label-on]');
    if (off) off.hidden = on;
    if (added) added.hidden = !on;
  });
  document.querySelectorAll<HTMLElement>('[data-bundle-note]').forEach(note => {
    note.textContent = selected.size > 1 ? `${selected.size} services, one visit. We’ll check bundle savings with your quote.` : 'One service or several. The same careful approach.';
  });
  form?.querySelectorAll<HTMLElement>('[data-scope]').forEach(scope => {
    const on = selected.has(scope.dataset.scope!);
    scope.hidden = !on;
    scope.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select').forEach(input => { input.disabled = !on; });
  });
  try { sessionStorage.setItem('clear-flow-services', JSON.stringify([...selected])); } catch { /* Selection still works without storage. */ }
  renderSummary();
}
function setService(id: string, on: boolean) {
  if (!Object.hasOwn(serviceNames, id)) return;
  if (on) selected.add(id); else selected.delete(id);
  renderSelection();
  if (stage === 0) setStatus(defaultStatus);
}
function showStage(nextStage: number, focus = true) {
  if (!form) return;
  stage = Math.max(0, Math.min(nextStage, panels.length - 1));
  highestStage = Math.max(highestStage, stage);
  panels.forEach((panel, i) => {
    panel.hidden = i !== stage;
    if (i === stage && !reducedMotion) panel.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 240, easing: 'cubic-bezier(.22,1,.36,1)' });
  });
  form.querySelectorAll<HTMLButtonElement>('.quote-progress [data-step-go]').forEach(button => {
    const index = Number(button.dataset.stepGo);
    button.disabled = index > highestStage;
    button.classList.toggle('is-complete', index < stage);
    if (index === stage) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
  });
  form.querySelector<HTMLElement>('[data-step-back]')!.hidden = stage === 0;
  form.querySelector<HTMLElement>('[data-step-next]')!.hidden = stage === 3;
  form.querySelector<HTMLElement>('[type="submit"]')!.hidden = stage !== 3;
  const next = form.querySelector<HTMLButtonElement>('[data-step-next]');
  if (next) next.childNodes[0].textContent = stage === 2 && !photos.length ? 'Skip photos ' : stage === 2 ? 'Review my quote ' : 'Continue ';
  setStatus(defaultStatus);
  renderSummary();
  if (focus) {
    panels[stage].querySelector<HTMLElement>('h3')?.focus({ preventScroll: true });
    form.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
  }
}
function fieldError(name: string, message: string) {
  if (!form) return;
  const input = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null;
  input?.setAttribute('aria-invalid', 'true');
  const error = form.querySelector<HTMLElement>(`[data-error="${name}"]`);
  if (error) error.textContent = message;
  setStatus(message, true);
  input?.focus();
}
function validateStep(index: number): boolean {
  if (!form) return false;
  if (index === 0 && selected.size === 0) {
    showStage(0);
    setStatus('Choose at least one service to start your quote.', true);
    form.querySelector<HTMLInputElement>('input[data-service]')?.focus();
    return false;
  }
  if (index === 1) {
    const city = form.elements.namedItem('city') as HTMLSelectElement;
    if (!city.value) { showStage(1); fieldError('city', 'Choose your city so we can plan the visit.'); return false; }
    const invalid = panels[1].querySelector<HTMLInputElement>('input:not(:disabled):invalid');
    if (invalid) { showStage(1); setStatus('Add a whole number between 1 and 10,000, or leave the count blank.', true); invalid.focus(); return false; }
  }
  if (index === 3) {
    const name = form.elements.namedItem('name') as HTMLInputElement;
    const phone = form.elements.namedItem('phone') as HTMLInputElement;
    if (!name.value.trim()) { showStage(3); fieldError('name', 'Please add your name.'); return false; }
    const digits = phone.value.replace(/\D/g, '');
    if (!/^\d{10}$/.test(digits) && !/^1\d{10}$/.test(digits)) { showStage(3); fieldError('phone', 'Add a 10-digit US phone number.'); return false; }
  }
  return true;
}
function openQuote() { showStage(0); }

renderSelection();
if (form) {
  form.noValidate = true;
  showStage(0, false);
  form.querySelectorAll<HTMLButtonElement>('[data-step-go]').forEach(button => button.addEventListener('click', () => {
    const next = Number(button.dataset.stepGo);
    if (next <= highestStage) showStage(next);
  }));
  form.querySelector('[data-step-next]')?.addEventListener('click', () => { if (validateStep(stage)) showStage(stage + 1); });
  form.querySelector('[data-step-back]')?.addEventListener('click', () => showStage(stage - 1));
  form.addEventListener('input', event => {
    const input = event.target as HTMLInputElement;
    input.removeAttribute('aria-invalid');
    const error = form.querySelector<HTMLElement>(`[data-error="${input.name}"]`);
    if (error) error.textContent = '';
    setStatus(defaultStatus);
    renderSummary();
  });
  form.addEventListener('change', renderSummary);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (![0, 1, 3].every(validateStep)) return;
    const submit = form.querySelector<HTMLButtonElement>('[type="submit"]')!;
    if (submit.disabled) return;
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    setStatus('Sending your property details…');
    const payload = new FormData(form);
    payload.delete('photos');
    photos.forEach(photo => payload.append('photos', photo, photo.name));
    try {
      const response = await fetch(form.action, { method: 'POST', body: payload, headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(30000) });
      const result = await response.json().catch(() => ({ success: false }));
      if (!response.ok || !result.success) throw new Error(result.message || 'We couldn’t send your request. Please try again, or call 760-422-3069.');
      form.querySelector<HTMLElement>('[data-form-fields]')!.hidden = true;
      const done = form.querySelector<HTMLElement>('[data-form-done]')!;
      done.hidden = false;
      done.focus();
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      photos = [];
      selected.clear();
      renderSelection();
    } catch (error) {
      setStatus(error instanceof Error && error.name !== 'TimeoutError' ? error.message : 'Sending took too long. Please try again, or call 760-422-3069.', true);
    } finally { submit.disabled = false; submit.removeAttribute('aria-busy'); }
  });

  const upload = form.querySelector<HTMLInputElement>('[name="photos"]')!;
  const previewList = form.querySelector<HTMLUListElement>('[data-photo-previews]')!;
  const photoError = form.querySelector<HTMLElement>('[data-photo-error]')!;
  const renderPhotos = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    previewUrls = [];
    previewList.replaceChildren();
    photos.forEach((file, index) => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      const url = URL.createObjectURL(file);
      previewUrls.push(url);
      img.src = url; img.alt = `Selected property photo ${index + 1}`;
      const label = document.createElement('span'); label.textContent = file.name;
      const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove ${file.name}`);
      remove.addEventListener('click', () => { photos.splice(index, 1); photoError.textContent = ''; upload.removeAttribute('aria-invalid'); renderPhotos(); });
      li.append(img, label, remove); previewList.append(li);
    });
    renderSummary();
    if (stage === 2) showStage(2, false);
  };
  upload.addEventListener('change', () => {
    const incoming = [...(upload.files ?? [])];
    upload.value = '';
    let error = '';
    for (const file of incoming) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { error = 'Choose JPG, PNG or WebP photos. Export HEIC photos as JPG first.'; continue; }
      if (file.size > 4 * 1024 * 1024 || !file.size) { error = 'Each photo must be between 1 byte and 4 MB.'; continue; }
      if (photos.some(p => p.name === file.name && p.size === file.size && p.lastModified === file.lastModified)) continue;
      if (photos.length >= 3) { error = 'You can include up to 3 photos. Remove one to choose another.'; continue; }
      photos.push(file);
    }
    photoError.textContent = error;
    if (error) upload.setAttribute('aria-invalid', 'true'); else upload.removeAttribute('aria-invalid');
    renderPhotos();
  });
}

document.addEventListener('change', event => {
  const input = event.target as HTMLInputElement;
  if (input.matches?.('input[data-service]')) setService(input.dataset.service!, input.checked);
});
document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach(button => button.addEventListener('click', () => setService(button.dataset.add!, !selected.has(button.dataset.add!))));
document.querySelector<HTMLFormElement>('[data-starter]')?.addEventListener('submit', event => { event.preventDefault(); openQuote(); });
document.querySelector('[data-select-solar]')?.addEventListener('click', () => { setService('solar', true); showStage(0, false); });
document.querySelector('[data-recurring-interest]')?.addEventListener('click', () => {
  const interest = form?.querySelector<HTMLInputElement>('[data-maintenance]');
  if (interest) interest.checked = true;
  showStage(0, false);
});
document.querySelectorAll<HTMLAnchorElement>('a[href="#quote"]').forEach(link => link.addEventListener('click', event => {
  if (!form) return;
  event.preventDefault();
  openQuote();
}));

const header = document.querySelector<HTMLElement>('[data-header]');
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (header && !hero) header.classList.add('is-solid');
if (header && hero) {
  const sentinel = document.createElement('span'); sentinel.className = 'header-sentinel'; hero.prepend(sentinel);
  new IntersectionObserver(([entry]) => header.classList.toggle('is-solid', !entry.isIntersecting)).observe(sentinel);
}
const menu = document.getElementById('menu');
document.querySelectorAll('[data-close-menu]').forEach(link => link.addEventListener('click', () => menu?.hidePopover?.()));
const menuToggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
menu?.addEventListener('toggle', () => { const open = menu.matches(':popover-open'); menuToggle?.setAttribute('aria-expanded', String(open)); if (open) menu.querySelector<HTMLElement>('[data-close-menu]')?.focus(); });

const servicesBody = document.querySelector<HTMLElement>('[data-services]');
if (servicesBody) {
  const rows = [...servicesBody.querySelectorAll<HTMLElement>('[data-svc]')];
  const images = [...servicesBody.querySelectorAll<HTMLElement>('[data-svc-img]')];
  const caption = servicesBody.querySelector<HTMLElement>('[data-svc-caption]');
  const activate = (index: number) => {
    rows.forEach((row, i) => row.classList.toggle('is-active', i === index));
    images.forEach((image, i) => image.classList.toggle('is-active', i === index));
    if (caption) caption.textContent = rows[index]?.dataset.caption ?? '';
  };
  rows.forEach((row, i) => { row.addEventListener('pointerenter', () => activate(i)); row.addEventListener('focusin', () => activate(i)); });
}

const revealables = document.querySelectorAll<HTMLElement>('[data-reveal]');
const waterLights = document.querySelectorAll<HTMLElement>('[data-water-light]');
if (!reducedMotion && waterLights.length && 'IntersectionObserver' in window) {
  const visible = new Set<HTMLElement>();
  const update = () => waterLights.forEach(light => light.classList.toggle('is-running', visible.has(light) && !document.hidden));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const light = entry.target as HTMLElement;
      if (entry.isIntersecting) visible.add(light); else visible.delete(light);
    });
    update();
  }, { threshold: 0 });
  waterLights.forEach(light => observer.observe(light));
  document.addEventListener('visibilitychange', update);
}
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { rootMargin: '0px 0px -25px 0px', threshold: .08 });
  revealables.forEach(el => observer.observe(el));
} else { revealables.forEach(el => el.classList.add('is-visible')); }
const mbar = document.querySelector<HTMLElement>('[data-mbar]');
if (mbar && form) {
  const visibleQuoteControls = new Set<Element>();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleQuoteControls.add(entry.target);
      else visibleQuoteControls.delete(entry.target);
    });
    const hide = visibleQuoteControls.size > 0;
    mbar.classList.toggle('is-hidden', hide);
    mbar.inert = hide;
    mbar.setAttribute('aria-hidden', String(hide));
  }, { threshold: 0 });
  observer.observe(form);
  const heroQuoteButton = document.querySelector<HTMLElement>('[data-starter] button[type="submit"]');
  if (heroQuoteButton) observer.observe(heroQuoteButton);
}

const model = document.querySelector<HTMLElement>('[data-soiling]');
if (model) {
  const annual = model.querySelector<HTMLInputElement>('[data-annual-energy]')!;
  const loss = model.querySelector<HTMLInputElement>('[data-soiling-loss]')!;
  const renderModel = () => {
    const energy = Math.min(200000, Math.max(0, Number(annual.value) || 0));
    const percentage = Number(loss.value);
    const lost = Math.round(energy * percentage / 100);
    model.querySelector<HTMLElement>('[data-loss-output]')!.textContent = lost.toLocaleString();
    model.querySelector<HTMLElement>('[data-percent-output]')!.textContent = `${percentage}%`;
    model.querySelector<HTMLElement>('[data-clean-energy]')!.textContent = `${energy.toLocaleString()} kWh`;
    model.querySelector<HTMLElement>('[data-dust-energy]')!.textContent = `${(energy - lost).toLocaleString()} kWh`;
    model.querySelector<HTMLElement>('.energy-bars__dust')!.style.width = `${100 - percentage}%`;
  };
  annual.addEventListener('input', renderModel); loss.addEventListener('input', renderModel); renderModel();
}
// Only opt into enhancement styling once every controller is initialized.
document.documentElement.classList.add('js');

if (new URLSearchParams(window.location.search).get('delivery') === 'failed') setStatus('Your request did not send. Please try again, or call or text 760-422-3069.', true);
