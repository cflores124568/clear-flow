import type { ImageMetadata } from 'astro';
import type { ServiceId } from './site';
import home from '../assets/photos/desert-house.jpg';
import modern from '../assets/photos/desert-modern.jpg';

// Real regional architecture, used for context rather than as Clear Flow job proof.
export const servicePhotos: Record<ServiceId, ImageMetadata> = { solar: home, birds: home, windows: modern, pressure: home, junk: modern };
