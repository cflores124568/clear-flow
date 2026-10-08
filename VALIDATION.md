# Redesign verification — 8 October 2026

The existing Astro pages, service routes, shared quote selection and Cloudflare Pages delivery endpoint were upgraded in place. No deployment or real customer email was sent during development.

## Passed

- `npm run build`: all 13 pages and optimized regional images compile.
- `npm test`: five delivery tests pass, covering the complete property payload, exact attachment bytes, escaping, service deduplication, invalid input, photo count/size/signatures, request limits, honeypot behavior, missing configuration, provider/network failure and browser-form redirects.
- TypeScript checks for the browser controller and Pages function pass.
- `git diff --check` passes.
- Built HTML checks: one H1 per page, canonical URLs, and valid internal page/anchor targets.
- Browser widths of 320, 390, 768, 900 and 1280px: no document overflow; mobile/tablet menu remains available.
- Browser console: no warning/error entries in the finished preview.
- Desktop service chips, service rows and property pins share selection. Navigating to a service page preserves the bundle and adds the viewed service.
- Mobile quote journey: required service/city/contact validation, property scope, photo preview, earlier-step editing, optional recurring care and successful submission. The actual Pages function was exercised through a local proxy with a mocked Resend response; no message reached the business.
- Mobile navigation opens/closes with its expanded state and restored trigger focus. The sticky quote action returns to the form and hides while the form or the primary hero quote button is visible. Hidden quick actions are removed from keyboard navigation.
- The soiling example updates correctly: 20,000 kWh at an assumed 10% loss shows 2,000 kWh and 18,000 kWh remaining.

## Scope of verification

Reduced-motion support and no-JavaScript markup are implemented. Server-side redirects were tested; browser JavaScript disabling and OS reduced-motion emulation were not exercised. The provider was mocked, so production Resend delivery still needs a smoke test in the configured Cloudflare environment.

Authentic reviews and before/after job media have not been supplied. The current page uses confirmed care standards, local coverage, the owner's explicitly illustrative property/service images and an educational solar model. It contains no invented ratings, customer quotes, project results or dollar savings. The requested under-24-hour quote promise should match operating capacity before publication.

## Upright typography and water-light follow-up

- Replaced serif/italic headlines with self-hosted Plus Jakarta Sans and recalibrated heading scales, word spacing, service rows, phone numerals and calculator figures.
- Removed the full-page paper grain. Added a decorative SVG water-light field to the pure-water section and refined the quote builder’s glass-edge highlights.
- Rechecked 320, 390, 768, 900 and 1280px widths: no horizontal document overflow and no italic H1/H2 accents.
- Verified the water animation runs with its section visible and pauses at the hero. CSS keeps it static for reduced motion; the browser’s reduced-motion preference was not emulated.
- Rechecked the mobile service chips, bundle state, property selection, photo skipping and contact/review stage. No real quote was submitted.
- Production build, TypeScript, all five delivery tests and whitespace checks pass. The finished browser preview has no warning/error entries.

## Original logo palette follow-up

- Restored the supplied aqua (`#3FB6C6`) and blue (`#1D5F96`) in the wordmark and favicon. Replaced the separate sage accents with shared logo-color tokens and derived tints.
- Verified the hero, selected service chips, quote progress and property controls use the same colors. Desktop selections remain synchronized between the hero, form, service rows and property pins, and the builder advances to the property stage.
- Rechecked the active preview at 320px and 390px and the desktop preview at 1280px: no horizontal document overflow. Fixed the optional proof-strip item’s responsive selector so it stays hidden on mobile.
- Text contrast: navy on the aqua CTA is 5.36:1; warm white on the blue controls is 6.43:1. Blue text on sand is 6.06:1, and muted text on sand is 4.64:1.
- Finished browser console contains no warning/error entries. Production build and whitespace checks pass. Delivery logic was unchanged; the earlier five delivery tests remain the relevant endpoint verification.

## Rectangular controls and WebGL water text

- Replaced pill CTAs, hero service selectors and circular arrow containers with compact 3px corners and simple trailing arrows. Property pins and decorative form icons use the same shape. Verified no fully rounded control rules remain.
- Added a separate, homepage-only native WebGL surface within “roof to curb.”. The semantic H1 still reads the original headline. The text mask matches the loaded font; the effect uses the existing logo tokens and changes the fill without distorting the letters.
- Verified the actual homepage at 1280, 390 and 320px: no horizontal overflow, all four mobile service selectors align, and the resized water mask remains readable. The rendered effect runs at the hero and pauses while the quote form is visible.
- Verified service selection synchronization and the services-to-property transition after the button changes. Restored the preview’s initial empty selection; no real quote was sent.
- Used an isolated, temporary browser fixture to exercise WebGL unavailability, actual WebGL context loss/restoration, and reduced-motion preference change signals. Normal HTML text returned on loss/unavailability; water returned after restoration; reduced motion held a still frame and resumed when the preference changed. The temporary fixture was closed and removed before the final build. This verifies renderer behavior; OS-level motion/high-contrast settings were not changed.
- Production build, TypeScript (including the renderer) and whitespace checks pass. The actual homepage preview contains no warning/error console entries. The endpoint implementation is unchanged.

## Original photography and photo-led layouts

- Restored eight existing generated assets across the homepage, service index, all five service pages and about page. The original source image files remain unchanged. The generated dusty/clean wipe remains unused.
- The homepage leads with the original pool/glass photo and shows the photo-led service section before the quote builder. Desktop rows switch a larger sticky image and its matching caption. Mobile shows a 4:3 image before each service's copy and quote control.
- Restored the aerial as a full-width interactive property view and the water-fed window image in the care section. Repositioned the property pins for the aerial composition.
- Checked actual 390px and 320px layouts: all four homepage service photos are visible, with no horizontal overflow. All property targets remain 44px and do not overlap at 320px. Corrected hero source sizing for its tall mobile crop so the image is not upscaled from a small width-based source.
- Verified service image/caption switching, shared selection between service rows, hero selectors, aerial pins and the quote, and the mobile services → property → optional photos → contact/review journey. No real quote was submitted, and test selections were cleared afterward.
- Built HTML imports the correct distinct service asset on every service route. Responsive AVIF/WebP/JPEG variants compile for all 13 routes. The quote endpoint and water renderer are unchanged.

## Live service-area map follow-up

- Replaced the static illustration with a live MapLibre map on CARTO's vector basemap, tinted to the site palette, with terrain shading and eight brand-drop city markers. The approved illustration (`src/assets/maps/`) remains the no-JavaScript/no-WebGL fallback.
- Production build, all five delivery tests and `git diff --check` pass.
- Production preview in Chromium at 320, 390, 768 and 1280px: the map renders, all eight drops sit on their city centers, and visible labels stay inside the map without overlapping any drop, label or control. At 320px the Indian Wells label is held back for lack of room; its drop and the HTML list remain. No document overflow.
- Every CARTO request carried the key; no CARTO or terrain request failed. MapLibre's script and stylesheet were not requested on page load, only as the section approached.
- Zoom buttons change the view, fullscreen opens and closes, and an unmodified mouse wheel over the map scrolls the page. Map controls are 40px, or 44px on touch screens. Markers are hidden from assistive tech; the H2 and the eight-city HTML list remain.
- With WebGL blocked, and with JavaScript disabled, the illustration renders instead of the map.
- Existing behavior: recurring care checks the maintenance interest and opens the builder; a service selection syncs across chips and property pins; the builder advances. No quote was submitted.
- Console: no warnings or errors at 390, 768 and 1280px. At 320px the headless software renderer (SwiftShader) logged four "GPU stall due to ReadPixels" driver performance warnings; these come from the test GPU, not site code.
