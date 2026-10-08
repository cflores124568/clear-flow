# Clear Flow

One-page site for Clear Flow (solar panel cleaning, window cleaning, pressure washing, junk removal). Astro, static output, deployed to Cloudflare Pages with one Pages Function for the quote form. Built from the approved "Clear Pass" design frames.

```sh
npm install
npm run dev       # local dev server
npm run build     # static site in dist/
```

## Before launch

1. **Photos.** The current photos are interim crops. See [ASSETS.md](ASSETS.md) for the replacement list and Codex prompts.
2. **Copy sign-off.** Only the four service names, `760-422-3069` and "Licensed & Insured" come from the business card. The owner needs to confirm the rest, especially these promises:
   - "No pressure washers on panels, ever." / "Pure-water rinse, no detergent residue."
   - "Inside and out, frames and tracks included." (window scope)
   - "Furniture, yard debris and garage clutter, hauled away." (junk scope)
   - "Four jobs, one crew you call." (implies a single crew)
   - FAQ answers in `src/data/site.ts`, especially "Do I need to be home?"
   - Each service page's "What's included" list (`includes` in `src/data/site.ts`). These are scope promises.
   - The About page has no owner story yet. Add the owner's name, a short background and a real photo when they're available.
   - The privacy policy (`src/pages/privacy.astro`) describes what the site actually does; the owner should still review it.
3. **Domain.** Set `site` in `astro.config.mjs`. Canonical, `og:url` and `og:image` tags are only emitted once it is set.
4. **Form delivery.** In the Cloudflare Pages project, set `RESEND_API_KEY`, `QUOTE_TO` and `QUOTE_FROM` (see `.dev.vars.example`). The sending domain must be verified in Resend. Until these are set, the form shows its fallback message asking visitors to call.

## Pages

| Path | Source |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/services/` | `src/pages/services/index.astro` |
| `/services/<slug>/` (four) | `src/pages/services/[slug].astro`, one per entry in `services` in `src/data/site.ts` |
| `/about/`, `/faq/`, `/contact/`, `/privacy/` | `src/pages/*.astro` |
| `/thanks/`, 404 | landing spot for no-JavaScript form posts, and the not-found page |

Every page except `/thanks/` and 404 uses `src/layouts/Page.astro` (header, footer, mobile call bar, page script). Inner pages open with `PageHero`; anything marked `data-hero` keeps the header transparent until it scrolls away.

## Where things live

- `src/data/site.ts`: phone number, services (including service page copy), FAQ and the nav.
- `src/data/photos.ts`: which photo belongs to which service.
- `src/components/`: one component per page section, in page order in `src/pages/index.astro`.
- `src/scripts/site.ts`: header state, the shared service selection (hero chips, "Add to quote", form), the services photo, scroll reveals, the process line, the mobile call bar, and form submission.
- `functions/api/quote.ts`: receives the form and emails it via Resend. Plain form posts (no JavaScript) redirect to `/thanks/`.
- `src/assets/brand/wordmark.svg`: the logo, rebuilt from the card (Outfit SemiBold outlines plus the two-tone drop). Letters use `currentColor`.
- `scripts/make-dusty.sh`: rebuilds the hero's dusty layer from `hero-clean.jpg`.

## Design notes

- Palette and type follow the design lock: navy `#12263A`, glass white `#F5F8F9`, mist `#E6EFF1`, turquoise `#3FB6C6` for actions only (with `#187885` where turquoise is used as text on light backgrounds, for contrast). Type is Barlow Semi Condensed for headlines, service names and the phone number, with Barlow for everything else.
- Dark mode follows the visitor's system setting.
- All motion respects `prefers-reduced-motion`. The hero's scroll-linked wipe uses CSS scroll timelines where supported; elsewhere it plays once on load.
