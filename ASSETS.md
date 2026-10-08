# Clear Flow photography and visuals

The site leads with the owner's existing generated property and service images. Eight original assets are restored to the layouts, with responsive Astro optimization. They illustrate the setting, services and equipment; they are not presented as verified customer jobs. A quiet footer note and descriptive image alternatives identify the imagery as illustrative.

| Original asset | Image | Current use |
| --- | --- | --- |
| `src/assets/photos/hero-clean.jpg` | Glass doors, desert pool, palms and mountains | Homepage hero and social image |
| `src/assets/photos/aerial.jpg` | Solar-equipped home, windows, driveway and haul-away trailer | Interactive full-property section; about and services page heroes |
| `src/assets/photos/svc-solar.jpg` | Soft-brush solar cleaning | Service selector, mobile service image and solar page |
| `src/assets/photos/svc-windows.jpg` | Squeegee and wet glass | Service selector, mobile service image and windows page |
| `src/assets/photos/svc-pressure.jpg` | Driveway rinsing | Service selector, mobile service image and pressure-washing page |
| `src/assets/photos/svc-junk.jpg` | Sofa haul-away | Service selector, mobile service image and junk-removal page |
| `src/assets/photos/svc-birds.jpg` | Solar-array mesh installation | Services selector, mobile service image and bird-proofing page |
| `src/assets/photos/method-window.jpg` | Water-fed brush and filtration cart | Pure-water process section |

The service section follows the hero and precedes the quote builder. Desktop service hover/focus changes a large, sticky image and its caption; mobile shows a separate image before each service's copy and quote control. The aerial retains all four interactive quote pins. Astro generates responsive AVIF/WebP/JPEG derivatives; hero images load eagerly with high fetch priority and section images load lazily. Fonts are served locally.

## Service-area map

The homepage "Close to home" section shows a live, zoomable map (`src/scripts/service-map.ts`, MapLibre GL). The basemap is CARTO's Positron vector style, recolored to the site's sand, navy and logo aqua/blue; terrain shading comes from the public Mapzen terrain tiles on AWS Open Data. The map credits "© CARTO, © OpenStreetMap contributors" and the terrain sources, as both require. CARTO's free commercial tier covers 1 million requests a month; the key is set through `PUBLIC_CARTO_BASEMAPS_KEY` (see README).

Eight brand drops mark the city centers in `src/data/site.ts` (`cityCenters`), not offices or job sites. Their labels are real HTML text placed to avoid each other; on the narrowest phones a label with no room is held back until zooming in makes space, and the section's HTML city list always names all eight. MapLibre and its stylesheet load only as the section nears the viewport. Page scrolling is preserved: the map zooms with Ctrl/⌘ + scroll or two fingers, and offers zoom and fullscreen controls.

`src/assets/maps/clear-flow-service-area-map.png` (1536 × 1024), the approved generated illustration, is the fallback when JavaScript or WebGL is unavailable. It is rendered complete with responsive AVIF/WebP sources. Its prompt and notes stay with the original in `output/design/`. The illustration's roads and terrain are simplified and not navigation data.

The old `hero-dusty.jpg` layer remains in the source tree but is not rendered as a before/after transformation. No original generated image was deleted or replaced on disk.

Regional alternatives from the first redesign pass are also retained, but are no longer rendered:

| Asset | Source | Rights advisory |
| --- | --- | --- |
| `src/assets/photos/desert-house.jpg` | [Library of Congress, 2010630225](https://www.loc.gov/item/2010630225/), Carol M. Highsmith, Palm Springs mid-century home, 2 May 2009 | No known restrictions on publication |
| `src/assets/photos/desert-modern.jpg` | [Library of Congress, 2013631255](https://www.loc.gov/item/2013631255/), Carol M. Highsmith, Kaufmann House, Palm Springs, 2013 | No known restrictions on publication |

## Brand colors

The original wordmark and favicon retain the supplied drop’s aqua (`#3FB6C6`) and blue (`#1D5F96`). These are the shared `--brand-aqua` and `--brand-blue` CSS tokens. Aqua marks the hero and closing actions; blue supplies readable text, primary controls and selected services. Water surfaces, glass edges and caustic lines use tints of these two colors, with warm sand and dark navy as supporting neutrals. No separate sage accent palette is used.

## Typography and water texture

Headlines use upright [Plus Jakarta Sans](https://fontsource.org/fonts/plus-jakarta-sans/about); body text uses Manrope. Both are self-hosted Fontsource packages under the SIL Open Font License. The serif/italic display fonts have been removed.

`src/components/WaterLight.astro` creates an original abstract SVG caustic field from warped, shared paths. It is decorative, excluded from the accessibility tree and pointer input, and does not represent a job photograph. Only the pure-water section uses it. CSS animates its transform slowly while visible; reduced-motion and no-JavaScript views keep it static.

`src/components/WaterText.astro` and `src/scripts/water-text.ts` add an original procedural WebGL water fill inside the hero accent text. Drifting, refracted cells form bright caustic paths, using only the supplied aqua, blue and warm-white tokens. The mask comes from the actual font and DOM text; the accessible heading remains ordinary HTML. The effect is static for reduced motion and falls back to a solid aqua fill without JavaScript or WebGL. No water photograph, video, external shader asset or rendering library is downloaded.

## Authentic customer evidence

Real reviews and before/after footage were unavailable during this redesign. No reviews, ratings, review counts, completed-job images, or before/after transformations were fabricated. Add customer evidence only from a verified business profile or from originals provided by the business with permission to publish.

For before/after pairs, use the same camera position, framing and lighting; retain the originals. Keep customer faces, house numbers, license plates and private interiors out of the frame. Pair each published review with its authentic source link and publish only the wording that source supports.

Useful job coverage: rooftop panels; window glass plus frames/tracks; driveway or patio; garage or haul-away; real crew and equipment. Verified photographs can replace the concept images through the same shared asset map without changing the quote interactions.
