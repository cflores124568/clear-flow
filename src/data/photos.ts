import type { ImageMetadata } from 'astro';
import type { ServiceId } from './site';
import solar from '../assets/photos/svc-solar.jpg';
import windows from '../assets/photos/svc-windows.jpg';
import pressure from '../assets/photos/svc-pressure.jpg';
import junk from '../assets/photos/svc-junk.jpg';

export const servicePhotos: Record<ServiceId, ImageMetadata> = { solar, windows, pressure, junk };
