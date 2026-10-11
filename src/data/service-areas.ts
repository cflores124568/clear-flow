import type { ImageMetadata } from 'astro';
import { cities, services, type Service, type ServiceId } from './site';
import { servicePhotos, servicePhotoAlts } from './photos';
import cathedralCity from '../assets/photos/areas/cathedral-city.jpg';
import cathedralCitySolar from '../assets/photos/areas/cathedral-city-solar.jpg';
import cathedralCityBirds from '../assets/photos/areas/cathedral-city-birds.jpg';
import cathedralCityWindows from '../assets/photos/areas/cathedral-city-windows.jpg';
import cathedralCityPressure from '../assets/photos/areas/cathedral-city-pressure.jpg';
import cathedralCityJunk from '../assets/photos/areas/cathedral-city-junk.jpg';
import palmSprings from '../assets/photos/areas/palm-springs.jpg';
import palmSpringsSolar from '../assets/photos/areas/palm-springs-solar.jpg';
import palmSpringsBirds from '../assets/photos/areas/palm-springs-birds.jpg';
import palmSpringsWindows from '../assets/photos/areas/palm-springs-windows.jpg';
import palmSpringsPressure from '../assets/photos/areas/palm-springs-pressure.jpg';
import palmSpringsJunk from '../assets/photos/areas/palm-springs-junk.jpg';
import ranchoMirage from '../assets/photos/areas/rancho-mirage.jpg';
import ranchoMirageSolar from '../assets/photos/areas/rancho-mirage-solar.jpg';
import ranchoMirageBirds from '../assets/photos/areas/rancho-mirage-birds.jpg';
import ranchoMirageWindows from '../assets/photos/areas/rancho-mirage-windows.jpg';
import ranchoMiragePressure from '../assets/photos/areas/rancho-mirage-pressure.jpg';
import ranchoMirageJunk from '../assets/photos/areas/rancho-mirage-junk.jpg';
import palmDesert from '../assets/photos/areas/palm-desert.jpg';
import palmDesertSolar from '../assets/photos/areas/palm-desert-solar.jpg';
import palmDesertBirds from '../assets/photos/areas/palm-desert-birds.jpg';
import palmDesertWindows from '../assets/photos/areas/palm-desert-windows.jpg';
import palmDesertPressure from '../assets/photos/areas/palm-desert-pressure.jpg';
import palmDesertJunk from '../assets/photos/areas/palm-desert-junk.jpg';
import laQuinta from '../assets/photos/areas/la-quinta.jpg';
import laQuintaSolar from '../assets/photos/areas/la-quinta-solar.jpg';
import laQuintaBirds from '../assets/photos/areas/la-quinta-birds.jpg';
import laQuintaWindows from '../assets/photos/areas/la-quinta-windows.jpg';
import laQuintaPressure from '../assets/photos/areas/la-quinta-pressure.jpg';
import laQuintaJunk from '../assets/photos/areas/la-quinta-junk.jpg';
import indio from '../assets/photos/areas/indio.jpg';
import indioSolar from '../assets/photos/areas/indio-solar.jpg';
import indioBirds from '../assets/photos/areas/indio-birds.jpg';
import indioWindows from '../assets/photos/areas/indio-windows.jpg';
import indioPressure from '../assets/photos/areas/indio-pressure.jpg';
import indioJunk from '../assets/photos/areas/indio-junk.jpg';
import indianWells from '../assets/photos/areas/indian-wells.jpg';
import indianWellsSolar from '../assets/photos/areas/indian-wells-solar.jpg';
import indianWellsBirds from '../assets/photos/areas/indian-wells-birds.jpg';
import indianWellsWindows from '../assets/photos/areas/indian-wells-windows.jpg';
import indianWellsPressure from '../assets/photos/areas/indian-wells-pressure.jpg';
import indianWellsJunk from '../assets/photos/areas/indian-wells-junk.jpg';
import desertHotSprings from '../assets/photos/areas/desert-hot-springs.jpg';
import desertHotSpringsSolar from '../assets/photos/areas/desert-hot-springs-solar.jpg';
import desertHotSpringsBirds from '../assets/photos/areas/desert-hot-springs-birds.jpg';
import desertHotSpringsWindows from '../assets/photos/areas/desert-hot-springs-windows.jpg';
import desertHotSpringsPressure from '../assets/photos/areas/desert-hot-springs-pressure.jpg';
import desertHotSpringsJunk from '../assets/photos/areas/desert-hot-springs-junk.jpg';

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
  'cathedral-city': {
    solar: { photo: cathedralCitySolar, photoAlt: 'Service illustration: a worker brushing rooftop solar panels on a Cathedral City ranch home' },
    birds: { photo: cathedralCityBirds, photoAlt: 'Service illustration: a worker unrolling critter mesh along a solar array on a Cathedral City roof' },
    windows: { photo: cathedralCityWindows, photoAlt: 'Service illustration: a worker cleaning a sliding glass door at a Cathedral City home' },
    pressure: { photo: cathedralCityPressure, photoAlt: 'Service illustration: a surface cleaner lifting stains from a Cathedral City driveway' },
    junk: { photo: cathedralCityJunk, photoAlt: 'Service illustration: workers clearing garage clutter into a trailer at a Cathedral City home' },
  },
  'palm-springs': {
    solar: { photo: palmSpringsSolar, photoAlt: 'Service illustration: a worker cleaning a racked solar array on a flat mid-century roof in Palm Springs' },
    birds: { photo: palmSpringsBirds, photoAlt: 'Service illustration: hands fitting critter mesh beneath racked solar panels on a Palm Springs flat roof' },
    windows: { photo: palmSpringsWindows, photoAlt: 'Service illustration: a squeegee clearing a floor-to-ceiling glass wall on a Palm Springs mid-century home' },
    pressure: { photo: palmSpringsPressure, photoAlt: 'Service illustration: a surface cleaner washing a pool deck at a Palm Springs mid-century home' },
    junk: { photo: palmSpringsJunk, photoAlt: 'Service illustration: two workers hauling old patio furniture from a Palm Springs carport to a trailer' },
  },
  'rancho-mirage': {
    solar: { photo: ranchoMirageSolar, photoAlt: 'Service illustration: a worker cleaning a large solar array on a Rancho Mirage estate roof' },
    birds: { photo: ranchoMirageBirds, photoAlt: 'Service illustration: a worker sealing the gap under solar panels on a Rancho Mirage casita roof' },
    windows: { photo: ranchoMirageWindows, photoAlt: 'Service illustration: a water-fed pole cleaning clerestory windows on a Rancho Mirage estate' },
    pressure: { photo: ranchoMiragePressure, photoAlt: 'Service illustration: a soft wash brightening a white estate wall in Rancho Mirage' },
    junk: { photo: ranchoMirageJunk, photoAlt: 'Service illustration: workers loading yard trimmings into a trailer at a Rancho Mirage estate' },
  },
  'palm-desert': {
    solar: { photo: palmDesertSolar, photoAlt: 'Service illustration: a worker cleaning solar panels on a two-story home in Palm Desert' },
    birds: { photo: palmDesertBirds, photoAlt: 'Service illustration: critter mesh being clipped to a solar array on a Palm Desert tile roof' },
    windows: { photo: palmDesertWindows, photoAlt: 'Service illustration: a water-fed pole cleaning an arched upper window on a Palm Desert home' },
    pressure: { photo: palmDesertPressure, photoAlt: 'Service illustration: a surface cleaner washing a patio and pool deck at a Palm Desert home' },
    junk: { photo: palmDesertJunk, photoAlt: 'Service illustration: two workers carrying a mattress from a Palm Desert home to a trailer' },
  },
  'la-quinta': {
    solar: { photo: laQuintaSolar, photoAlt: 'Service illustration: a worker cleaning solar panels on a clay-tile roof in La Quinta' },
    birds: { photo: laQuintaBirds, photoAlt: 'Service illustration: a worker installing critter mesh under solar panels on a La Quinta roof' },
    windows: { photo: laQuintaWindows, photoAlt: 'Service illustration: a worker cleaning a deep-set window with an iron grille at a La Quinta home' },
    pressure: { photo: laQuintaPressure, photoAlt: 'Service illustration: a surface cleaner washing a courtyard with a fountain in La Quinta' },
    junk: { photo: laQuintaJunk, photoAlt: 'Service illustration: workers removing an old iron patio set from a La Quinta courtyard' },
  },
  'indio': {
    solar: { photo: indioSolar, photoAlt: 'Service illustration: a worker cleaning solar panels on a two-story tract home in Indio' },
    birds: { photo: indioBirds, photoAlt: 'Service illustration: a worker fastening critter mesh around solar panels on an Indio home' },
    windows: { photo: indioWindows, photoAlt: 'Service illustration: workers washing window screens and glass at an Indio tract home' },
    pressure: { photo: indioPressure, photoAlt: 'Service illustration: a worker pressure washing a driveway and sidewalk in an Indio neighborhood' },
    junk: { photo: indioJunk, photoAlt: 'Service illustration: workers loading cut palm fronds into a trailer at an Indio home' },
  },
  'indian-wells': {
    solar: { photo: indianWellsSolar, photoAlt: 'Service illustration: a worker cleaning a large rooftop solar array on an Indian Wells estate' },
    birds: { photo: indianWellsBirds, photoAlt: 'Service illustration: a worker fitting critter mesh around solar panels on an Indian Wells roof' },
    windows: { photo: indianWellsWindows, photoAlt: 'Service illustration: a worker cleaning tall glass doors on an Indian Wells pool terrace' },
    pressure: { photo: indianWellsPressure, photoAlt: 'Service illustration: a surface cleaner washing a travertine motor court in Indian Wells' },
    junk: { photo: indianWellsJunk, photoAlt: 'Service illustration: two workers removing old outdoor furniture from an Indian Wells casita' },
  },
  'desert-hot-springs': {
    solar: { photo: desertHotSpringsSolar, photoAlt: 'Service illustration: a worker washing wind-blown sand off solar panels in Desert Hot Springs' },
    birds: { photo: desertHotSpringsBirds, photoAlt: 'Service illustration: a worker installing critter mesh under solar panels on a Desert Hot Springs roof' },
    windows: { photo: desertHotSpringsWindows, photoAlt: 'Service illustration: a worker cleaning dusty windows with a valley view in Desert Hot Springs' },
    pressure: { photo: desertHotSpringsPressure, photoAlt: 'Service illustration: a worker rinsing wind-blown sand from a patio in Desert Hot Springs' },
    junk: { photo: desertHotSpringsJunk, photoAlt: 'Service illustration: workers loading tumbleweeds and old furniture into a trailer in Desert Hot Springs' },
  },
};

// City overview heroes, keyed by slug. Concept imagery, not customer jobs.
export const cityPhotos: Record<string, { photo: ImageMetadata; photoAlt: string }> = {
  'cathedral-city': { photo: cathedralCity, photoAlt: 'Property illustration: a tidy stucco ranch home against rocky foothills in the Cathedral City Cove' },
  'palm-springs': { photo: palmSprings, photoAlt: 'Property illustration: a clean mid-century butterfly-roof home beneath Mount San Jacinto in Palm Springs' },
  'rancho-mirage': { photo: ranchoMirage, photoAlt: 'Property illustration: a low white mid-century estate on a golf fairway in Rancho Mirage' },
  'palm-desert': { photo: palmDesert, photoAlt: 'Property illustration: a Mediterranean home with a barrel-tile roof in a Palm Desert neighborhood' },
  'la-quinta': { photo: laQuinta, photoAlt: 'Property illustration: a Spanish Colonial home beneath the rock walls of the La Quinta Cove' },
  'indio': { photo: indio, photoAlt: 'Property illustration: a newer two-story home beside a date palm grove in Indio' },
  'indian-wells': { photo: indianWells, photoAlt: 'Property illustration: a stone-and-stucco golf estate beneath the Santa Rosa Mountains in Indian Wells' },
  'desert-hot-springs': { photo: desertHotSprings, photoAlt: 'Property illustration: a modest desert home looking across the valley to Mount San Jacinto from Desert Hot Springs' },
};

// One line of local character for each city on the service-area directory.
export const cityNotes: Record<string, string> = {
  'cathedral-city': 'Stucco ranch homes and the rocky Cove.',
  'palm-springs': 'Mid-century glass beneath San Jacinto.',
  'rancho-mirage': 'Low, wide estates along the fairways.',
  'palm-desert': 'Tile roofs below the Santa Rosa foothills.',
  'la-quinta': 'Spanish Colonial homes under the Cove’s rock walls.',
  'indio': 'Newer neighborhoods beside the date groves.',
  'indian-wells': 'Stone, travertine and golf-course glass.',
  'desert-hot-springs': 'Windswept mesa homes with valley views.',
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
