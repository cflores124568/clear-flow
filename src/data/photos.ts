import type { ImageMetadata } from 'astro';
import type { ServiceId } from './site';
import solar from '../assets/photos/svc-solar.jpg';
import birds from '../assets/photos/svc-birds.jpg';
import windows from '../assets/photos/svc-windows.jpg';
import pressure from '../assets/photos/svc-pressure.jpg';
import junk from '../assets/photos/svc-junk.jpg';
import windowsBefore from '../assets/photos/hero-dusty.jpg';
import windowsAfter from '../assets/photos/hero-clean.jpg';

// Existing generated service imagery illustrates the scope; it is not customer-job evidence.
export const servicePhotos: Record<ServiceId, ImageMetadata> = { solar, birds, windows, pressure, junk };
export const servicePhotoAlts: Record<ServiceId, string> = {
  solar: 'Service illustration: a worker cleaning rooftop solar panels with a soft water-fed brush',
  birds: 'Service illustration: a worker fitting mesh around the edge of rooftop solar panels',
  windows: 'Service illustration: a gloved hand using a squeegee on wet glass with desert views',
  pressure: 'Service illustration: a pressure-washing wand rinsing a desert home’s driveway',
  junk: 'Service illustration: two workers carrying a sofa from a garage to a haul-away trailer',
};

// Before/after pairs for the drag comparison on a service page. Both images must
// share one framing. Swap in real job photos as the owner supplies them.
export const serviceComparisons: Partial<Record<ServiceId, { before: ImageMetadata; after: ImageMetadata; alt: string }>> = {
  windows: { before: windowsBefore, after: windowsAfter, alt: 'Service illustration: the same desert patio and pool seen through dusty, spotted glass and then through clean glass' },
};
