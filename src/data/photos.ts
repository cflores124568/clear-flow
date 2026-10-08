import type { ImageMetadata } from 'astro';
import type { ServiceId } from './site';
import solar from '../assets/photos/svc-solar.jpg';
import birds from '../assets/photos/svc-birds.jpg';
import windows from '../assets/photos/svc-windows.jpg';
import pressure from '../assets/photos/svc-pressure.jpg';
import junk from '../assets/photos/svc-junk.jpg';

// Existing generated service imagery illustrates the scope; it is not customer-job evidence.
export const servicePhotos: Record<ServiceId, ImageMetadata> = { solar, birds, windows, pressure, junk };
export const servicePhotoAlts: Record<ServiceId, string> = {
  solar: 'Service illustration: a worker cleaning rooftop solar panels with a soft water-fed brush',
  birds: 'Service illustration: a worker fitting mesh around the edge of rooftop solar panels',
  windows: 'Service illustration: a gloved hand using a squeegee on wet glass with desert views',
  pressure: 'Service illustration: a pressure-washing wand rinsing a desert home’s driveway',
  junk: 'Service illustration: two workers carrying a sofa from a garage to a haul-away trailer',
};
