import type { ImageMetadata } from 'astro';
import { cities, services, type Service, type ServiceId } from './site';
import { servicePhotos, servicePhotoAlts } from './photos';

export type ServiceArea = { name: string; slug: string };
export type LocalFaq = { q: string; a: string };
export type CityServiceOverride = {
  lede?: string;
  photo?: ImageMetadata;
  photoAlt?: string;
  faqs?: LocalFaq[];
};

// One source of truth for coverage. A city added to site.ts automatically
// receives an overview and all five service routes.
export const serviceAreas: ServiceArea[] = cities.map(name => ({
  name,
  slug: name.toLowerCase().replaceAll(' ', '-'),
}));

export const areaHref = (area: ServiceArea) => `/service-areas/${area.slug}/`;
export const cityServiceHref = (area: ServiceArea, service: Service) => `${areaHref(area)}${service.slug}/`;

// Individual city/service photo and copy slots. Import new standalone photos
// and set both photo and photoAlt here; never use a complete UI mockup as a
// photo, or label concept imagery as a completed customer job.
export const cityServiceOverrides: Record<string, Partial<Record<ServiceId, CityServiceOverride>>> = {
  'cathedral-city': { solar: {}, birds: {}, windows: {}, pressure: {}, junk: {} },
  'palm-springs': { solar: {}, birds: {}, windows: {}, pressure: {}, junk: {} },
  'rancho-mirage': { solar: {}, birds: {}, windows: {}, pressure: {}, junk: {} },
  'palm-desert': { solar: {}, birds: {}, windows: {}, pressure: {}, junk: {} },
  'la-quinta': { solar: {}, birds: {}, windows: {}, pressure: {}, junk: {} },
  'indio': { solar: {}, birds: {}, windows: {}, pressure: {}, junk: {} },
  'indian-wells': { solar: {}, birds: {}, windows: {}, pressure: {}, junk: {} },
  'desert-hot-springs': { solar: {}, birds: {}, windows: {}, pressure: {}, junk: {} },
};

const serviceFaqs: Record<ServiceId, LocalFaq> = {
  solar: { q: 'How are the panels cleaned?', a: 'We use soft brushes and pure water, never a pressure washer on solar glass.' },
  birds: { q: 'Can I combine bird proofing with a panel wash?', a: 'Yes. Include solar panel cleaning in your quote so we can plan the cleanout, mesh installation and wash together.' },
  windows: { q: 'Are frames, tracks and screens included?', a: 'Yes. The window-cleaning scope includes inside and outside glass, frames, sills, tracks and screens.' },
  pressure: { q: 'Do you use high pressure on every surface?', a: 'No. Driveways and walkways are pressure washed; walls and stucco get a gentler soft wash to protect the finish.' },
  junk: { q: 'What can you haul away?', a: 'Our listed services cover furniture and mattresses, yard debris, and garage or storage clutter. Describe your items or add photos so we can confirm the scope.' },
};

export function cityServiceContent(area: ServiceArea, service: Service) {
  const custom = cityServiceOverrides[area.slug]?.[service.id];
  if (custom?.photo && !custom.photoAlt) throw new Error(`Add photoAlt for ${area.slug}/${service.slug}`);
  return {
    lede: custom?.lede ?? service.line,
    photo: custom?.photo ?? servicePhotos[service.id],
    photoAlt: custom?.photoAlt ?? servicePhotoAlts[service.id],
    faqs: custom?.faqs ?? [
      serviceFaqs[service.id],
      { q: `How do I get a quote for my ${area.name} property?`, a: 'Select your services in the form above, add property details and any optional photos, then leave your contact information. The city is already selected and can be changed.' },
      { q: 'Can I add other services to the same quote?', a: 'Yes. Select any combination of services. We quote the work together and arrange a combined visit where the work allows.' },
      { q: 'Do I need to be home?', a: 'Not for most exterior work, as long as we can reach the areas being cleaned. We will confirm access and scheduling with you.' },
    ],
  };
}

export const cityServicePages = serviceAreas.flatMap(area => services.map(service => ({ area, service })));
