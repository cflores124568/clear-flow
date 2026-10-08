import type { ImageMetadata } from 'astro';
import type { ServiceId } from './site';
import solar from '../assets/photos/svc-solar.jpg';
import windows from '../assets/photos/svc-windows.jpg';
import pressure from '../assets/photos/svc-pressure.jpg';
import junk from '../assets/photos/svc-junk.jpg';

// Bird proofing has no photo of its own yet, so it shares the solar one (see ASSETS.md).
export const servicePhotos: Record<ServiceId, ImageMetadata> = { solar, birds: solar, windows, pressure, junk };
