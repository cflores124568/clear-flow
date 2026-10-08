# Clear Flow

Existing Astro site for a Coachella Valley exterior cleaning business, upgraded in place with a warm, precise design and a progressive quote builder. Static pages deploy to Cloudflare Pages; `functions/api/quote.ts` delivers requests through Resend.

## Development

```sh
npm install
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
npm run build
npm test
```

The dev server serves Astro pages; Cloudflare Pages Functions run in the Cloudflare environment, not the plain Astro dev server. Do not assume a successful static build confirms live email delivery. Node 22.12 or later is required.

## Quote flow

Services → property details → optional photos → contact and review. Hero chips, service rows, property pins, the quote form, and service-page preselections share the same service selection. Selected service IDs persist in session storage across page navigation; personal details and photos do not.

Four primary services appear on the homepage. Existing bird-proofing routes and quote selection are retained as an additional option. Back/edit navigation keeps entered details and photos. The recurring-care CTA checks an optional interest field. Estimates promise an exact quote in under 24 hours; confirm the business can honor this response time before publishing. Bundle copy invites a savings review without inventing prices or percentage discounts.

The form collects city, approximate property size, story count, relevant service counts/scope, notes, optional photos, name, US phone number, contact preference and recurring-care interest. It validates both client-side and server-side. With JavaScript disabled, all fields remain visible and multipart posts redirect to `/thanks/` or a contact-page failure URL.

Photos: up to 3 JPG/PNG/WebP files, 4 MB each. Preview/removal happens locally. The Pages Function enforces a 16 MB request limit, checks MIME type against signature bytes, sanitizes attachment names, and attaches photos to the email. It retains the honeypot and escapes email HTML. Provider/network failures preserve the visitor’s entered form with a retry and call/text alternative.

## Deployment prerequisites

Set these Cloudflare Pages environment variables:

- `RESEND_API_KEY`: authorized email API key.
- `QUOTE_TO`: recipient inboxes, comma separated.
- `QUOTE_FROM`: a sender on a verified Resend domain.
- `PUBLIC_CARTO_BASEMAPS_KEY`: CARTO basemaps key for the homepage service-area map. It is read at build time and is publishable (it is sent on every map tile request), so restrict it to the site's domain in the CARTO basemaps dashboard. For local builds, put it in the untracked `.env`.

Build command: `npm run build`. Output: `dist/`. Deploy the repository with the `functions/` directory so `/api/quote/` is included. `astro.config.mjs` sets `site` to `https://clear-flow.pages.dev`; update it if the canonical domain changes. A missing delivery configuration produces a visible call/text fallback. No live email was sent during redesign verification.

## Design and content

[DESIGN-AUDIT.md](DESIGN-AUDIT.md) lists the 42 initial issues and priority order. [ASSETS.md](ASSETS.md) records the original generated images restored at the owner's request, retained regional alternatives and the evidence still needed for customer proof.

The homepage leads with the original pool-and-glass image, followed by photo-led services before the quote builder. Desktop service rows update a large sticky photo and caption; mobile shows an image for every service. The original aerial is a full-width property view with shared quote pins. Service pages and the pure-water section use their original action images. These images illustrate services rather than document completed customer work.

The palette uses the original logo’s aqua and blue with charcoal/navy and warm limestone. Upright Plus Jakarta Sans headlines pair with Manrope body text. Compact rectangular controls replace the pill buttons and circular arrow containers. The quote builder retains subtle glass-edge highlights.

`WaterText.astro` and `src/scripts/water-text.ts` render slow, refracted water light inside the hero’s “roof to curb.” lettering. A native WebGL shader uses a small alpha mask made from the actual loaded font, keeps the letterforms steady, caps resolution at 1.5× and rendering at 30 fps, and pauses offscreen or in a hidden document. Reduced motion renders a still frame. No WebGL, initialization failure or lost context shows the normal HTML text; restored contexts rebuild the surface. The renderer is a separate, homepage-only enhancement with no extra library. High-contrast mode displays the regular text.

The original SVG water-light field remains in the pure-water section. Its 24-second transform animation pauses offscreen and when the document is hidden, and remains static with reduced motion or without JavaScript.

Native controls, restrained spring curves, transform/opacity reveals, reduced-motion support and a mobile action bar keep the interaction lightweight. Existing pages and service routes are preserved. Local business metadata includes confirmed service cities, without fabricated ratings, addresses or hours.

The solar soiling section is an adjustable educational scenario: expected annual kWh × assumed loss. Its assumptions are visible and editable; it makes no guaranteed recovery or ROI claim. Quarterly solar and twice-yearly window/exterior care are proposed starting points to discuss with the business, not automatic subscriptions.

## Validation

`npm test` exercises the quote delivery function with a mocked provider: property payload, actual attachment bytes, HTML escaping, duplicate/unknown services, required fields, counts, photo signatures/limits, streamed request limits, honeypot, provider/network failures and no-JavaScript redirects. The browser quote journey was also tested locally with a mocked email provider; production credentials and real inbox receipt still require a deployment smoke test.
