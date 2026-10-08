# Clear Flow photography and visuals

The site now renders real Palm Springs architecture photographs by Carol M. Highsmith. These establish regional context; they are not presented as Clear Flow customers or completed work. The original property diagram is an SVG illustration, not a photograph.

| Asset | Source | Image | Rights advisory | Use |
| --- | --- | --- | --- | --- |
| `src/assets/photos/desert-house.jpg` | [Library of Congress, 2010630225](https://www.loc.gov/item/2010630225/) | Palm Springs mid-century home, 2 May 2009, LC-DIG-highsm-04230 | No known restrictions on publication | Hero, service context, about page, social image |
| `src/assets/photos/desert-modern.jpg` | [Library of Congress, 2013631255](https://www.loc.gov/item/2013631255/) | Kaufmann House, Palm Springs, 2013, LC-DIG-highsm-24077 | No known restrictions on publication | Material detail and service context |

Credit: Carol M. Highsmith’s America, Library of Congress, Prints and Photographs Division. The Kaufmann House photo is from the Jon B. Lovelace Collection of California Photographs. The footer links the two catalog records. Astro generates responsive AVIF/WebP/JPEG derivatives; the hero has eager loading and high fetch priority. Fonts are served locally.

Legacy concept photos remain in the source tree for provenance, but no page imports or renders them. The old dusty layer is not used. Do not reintroduce concept imagery as proof of work.

## Brand colors

The original wordmark and favicon retain the supplied drop’s aqua (`#3FB6C6`) and blue (`#1D5F96`). These are the shared `--brand-aqua` and `--brand-blue` CSS tokens. Aqua marks the hero and closing actions; blue supplies readable text, primary controls and selected services. Water surfaces, glass edges and caustic lines use tints of these two colors, with warm sand and dark navy as supporting neutrals. No separate sage accent palette is used.

## Typography and water texture

Headlines use upright [Plus Jakarta Sans](https://fontsource.org/fonts/plus-jakarta-sans/about); body text uses Manrope. Both are self-hosted Fontsource packages under the SIL Open Font License. The serif/italic display fonts have been removed.

`src/components/WaterLight.astro` creates an original abstract SVG caustic field from warped, shared paths. It is decorative, excluded from the accessibility tree and pointer input, and does not represent a job photograph. Only the pure-water section uses it. CSS animates its transform slowly while visible; reduced-motion and no-JavaScript views keep it static.

`src/components/WaterText.astro` and `src/scripts/water-text.ts` add an original procedural WebGL water fill inside the hero accent text. Drifting, refracted cells form bright caustic paths, using only the supplied aqua, blue and warm-white tokens. The mask comes from the actual font and DOM text; the accessible heading remains ordinary HTML. The effect is static for reduced motion and falls back to a solid aqua fill without JavaScript or WebGL. No water photograph, video, external shader asset or rendering library is downloaded.

## Authentic customer evidence

Real reviews and before/after footage were unavailable during this redesign. No reviews, ratings, review counts, completed-job images, or before/after transformations were fabricated. Add customer evidence only from a verified business profile or from originals provided by the business with permission to publish.

For before/after pairs, use the same camera position, framing and lighting; retain the originals. Keep customer faces, house numbers, license plates and private interiors out of the frame. Pair each published review with its authentic source link and publish only the wording that source supports.

Useful job coverage: rooftop panels; window glass plus frames/tracks; driveway or patio; garage or haul-away; real crew and equipment. One wide and one detail photograph per service are enough to replace regional context with authentic work.
