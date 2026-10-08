// Live service-area map: CARTO's vector basemap, tinted to the site palette,
// with Mapzen terrain shading and one brand drop per service city. Loaded
// only when the section approaches the viewport.
import { AttributionControl, FullscreenControl, LngLatBounds, Map, Marker, NavigationControl, setWorkerUrl } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import stylesheetUrl from 'maplibre-gl/dist/maplibre-gl.css?url';

setWorkerUrl(workerUrl);

const cartoKey = import.meta.env.PUBLIC_CARTO_BASEMAPS_KEY as string | undefined;
const styleUrl = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const palette = {
  ground: '#efe9dc',
  landuse: '#e9e2d3',
  park: '#e2e4d5',
  water: '#cde6ea',
  building: '#e3dccd',
  roadCase: '#dcd3c2',
  road: '#fbf9f4',
  major: '#f7f0e1',
  majorCase: '#d2c4a6',
  boundary: '#c9bfae',
  text: '#5d6b72',
  halo: '#f6f3ec',
};

function tint(map: Map) {
  for (const layer of map.getStyle().layers) {
    const id = layer.id;
    // The drops carry the city names; the basemap's own town labels would repeat them.
    if (/^place_(town|villages|city)/.test(id)) { map.setLayoutProperty(id, 'visibility', 'none'); continue; }
    if (layer.type === 'background') map.setPaintProperty(id, 'background-color', palette.ground);
    else if (layer.type === 'fill') {
      if (id.startsWith('water')) map.setPaintProperty(id, 'fill-color', palette.water);
      else if (id.startsWith('park')) map.setPaintProperty(id, 'fill-color', palette.park);
      else if (id.startsWith('building')) map.setPaintProperty(id, 'fill-color', palette.building);
      else map.setPaintProperty(id, 'fill-color', palette.landuse);
    } else if (layer.type === 'line') {
      if (id.startsWith('waterway')) map.setPaintProperty(id, 'line-color', palette.water);
      else if (id.startsWith('boundary')) map.setPaintProperty(id, 'line-color', palette.boundary);
      else if (/_(mot|trunk)_case/.test(id)) map.setPaintProperty(id, 'line-color', palette.majorCase);
      else if (/_(mot|trunk)_fill/.test(id)) map.setPaintProperty(id, 'line-color', palette.major);
      else if (id.includes('_case')) map.setPaintProperty(id, 'line-color', palette.roadCase);
      else if (id.includes('_fill')) map.setPaintProperty(id, 'line-color', palette.road);
    } else if (layer.type === 'symbol' && layer.paint && 'text-color' in layer.paint) {
      map.setPaintProperty(id, 'text-color', palette.text);
      map.setPaintProperty(id, 'text-halo-color', palette.halo);
    }
  }
  map.addSource('terrain', {
    type: 'raster-dem',
    tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
    encoding: 'terrarium',
    tileSize: 256,
    maxzoom: 14,
    attribution: '<a href="https://github.com/tilezen/joerd/blob/master/docs/attribution.md">Terrain: Mapzen, USGS 3DEP, NASA SRTM</a>',
  });
  map.addLayer({
    id: 'terrain-shade',
    type: 'hillshade',
    source: 'terrain',
    paint: {
      'hillshade-exaggeration': 0.45,
      'hillshade-shadow-color': '#9c8b6c',
      'hillshade-highlight-color': '#fffaf0',
      'hillshade-accent-color': '#b8a682',
      'hillshade-illumination-direction': 315,
    },
  }, 'waterway');
}

const sides = ['right', 'left', 'below-right', 'below-left', 'below', 'above-right', 'above-left', 'above', 'hidden'] as const;
const overlaps = (a: DOMRect, b: DOMRect) => a.left < b.right + 2 && b.left < a.right + 2 && a.top < b.bottom + 2 && b.top < a.bottom + 2;

// Give each city label the first side that stays inside the map and clears every
// drop, every label already placed, and the map controls. A label with no room
// is hidden until zooming in makes space; the drop and the HTML list remain.
function placeLabels(root: HTMLElement) {
  const frame = root.querySelector<HTMLElement>('[data-map-canvas]')!.getBoundingClientRect();
  const pins = [...root.querySelectorAll<HTMLElement>('.map-pin')];
  const taken = [
    ...pins.map(el => el.querySelector('svg')!.getBoundingClientRect()),
    ...[...root.querySelectorAll('.maplibregl-ctrl-group, .maplibregl-ctrl-attrib')].map(el => el.getBoundingClientRect()),
  ];
  for (const el of pins) {
    const label = el.querySelector('span')!;
    const fits = () => {
      const r = label.getBoundingClientRect();
      return r.left >= frame.left + 4 && r.right <= frame.right - 4 && r.top >= frame.top + 4 && r.bottom <= frame.bottom - 4 && !taken.some(other => overlaps(r, other));
    };
    const choose = (side: typeof sides[number]) => sides.forEach(option => el.classList.toggle(`map-pin--${option}`, option === side));
    const side = sides.find(option => { choose(option); return option === 'hidden' || fits(); })!;
    if (side !== 'hidden') taken.push(label.getBoundingClientRect());
  }
}

function pin(city: string) {
  const el = document.createElement('div');
  el.className = 'map-pin map-pin--right';
  el.dataset.city = city;
  el.innerHTML = `<svg viewBox="0 0 100 130" aria-hidden="true"><path fill="#3FB6C6" d="M50 0C50 0 0 58 0 84a50 46 0 0 0 100 0C100 58 50 0 50 0Z"/><path fill="#1D5F96" d="M0 84C14 70 36 96 58 92S92 72 100 80a50 46 0 0 1-100 4Z"/><path fill="#FFFFFF" fill-opacity=".55" d="M24 74c2-12 10-26 18-36-4 12-8 26-6 38-4 3-10 2-12-2Z"/></svg><span></span>`;
  el.querySelector('span')!.textContent = city;
  return el;
}

// Linked at runtime so MapLibre's stylesheet arrives with the map, not with every page view.
function loadStylesheet() {
  return new Promise<void>(resolve => {
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: stylesheetUrl });
    link.addEventListener('load', () => resolve(), { once: true });
    link.addEventListener('error', () => resolve(), { once: true });
    document.head.append(link);
  });
}

// Room for the drops above each point and the longest labels to the right.
function padding(el: HTMLElement) {
  const w = el.clientWidth;
  const h = el.clientHeight;
  return { top: Math.round(Math.max(40, h * .08)), bottom: Math.round(Math.max(52, h * .07)), left: Math.round(Math.max(28, w * .06)), right: Math.round(Math.max(64, w * .1)) };
}

export async function initServiceMap(root: HTMLElement) {
  const canvas = root.querySelector<HTMLElement>('[data-map-canvas]');
  if (!canvas) return;
  const centers = JSON.parse(root.dataset.cities ?? '{}') as Record<string, [number, number]>;
  const bounds = new LngLatBounds();
  Object.values(centers).forEach(center => bounds.extend(center));
  const fail = () => root.classList.add('is-fallback');
  await loadStylesheet();

  let map: Map;
  try {
    map = new Map({
      container: canvas,
      style: styleUrl,
      bounds,
      fitBoundsOptions: { padding: padding(canvas) },
      minZoom: 8,
      maxZoom: 16,
      maxBounds: [[-117.4, 33.2], [-115.6, 34.4]],
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      cooperativeGestures: true,
      attributionControl: false,
      transformRequest: url => (cartoKey && url.includes('cartocdn.com')
        ? { url: `${url}${url.includes('?') ? '&' : '?'}key=${encodeURIComponent(cartoKey)}` }
        : { url }),
    });
  } catch {
    fail();
    return;
  }
  map.touchZoomRotate.disableRotation();
  map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
  map.addControl(new FullscreenControl({ container: root.querySelector<HTMLElement>('[data-map-frame]') ?? undefined }), 'top-right');
  map.addControl(new AttributionControl({ compact: false }), 'bottom-right');
  map.once('style.load', () => tint(map));
  map.once('load', () => root.classList.add('is-ready'));
  // Keep the whole service area framed as the layout changes, until the visitor moves the map.
  let explored = false;
  map.on('movestart', event => { if (event.originalEvent) explored = true; });
  map.on('resize', () => { if (!explored) map.fitBounds(bounds, { padding: padding(canvas), duration: 0 }); });
  map.on('load', () => placeLabels(root));
  map.on('moveend', () => placeLabels(root));
  map.on('error', event => {
    if (!map.loaded() && !map.isStyleLoaded() && String((event.error as { url?: string })?.url ?? '').includes('style.json')) fail();
  });
  // The HTML city list carries these names for assistive tech; the pins are visual.
  Object.entries(centers).forEach(([city, center]) => {
    const marker = new Marker({ element: pin(city), anchor: 'bottom' }).setLngLat(center).addTo(map);
    marker.getElement().setAttribute('aria-hidden', 'true');
    marker.getElement().removeAttribute('tabindex');
  });
}
