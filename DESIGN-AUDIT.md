# Clear Flow design audit — 8 October 2026

Audited the live homepage at https://clear-flow.pages.dev, desktop and mobile layouts, the local Astro components, global CSS, shared selection script, Pages quote function, asset documentation, and inner pages before implementation. The working tree was clean.

## Keep

“Clear, from roof to curb.”; shared service chips and Add to quote state; the service list rather than equal feature cards; one-call bundling; “Careful is the whole point”; pure water and soft brushes on solar; licensed/insured proof; lightweight Astro, native controls, reduced-motion support, responsive image generation, keyboard focus, skip link, honeypot, server-side email delivery, and existing routes.

## Issues found

### Priority 1 — first impression and conversion

1. The artificial dusty/clean wipe dominates the hero, obscures the house, and reads as a visual effect rather than premium photography.
2. All existing photos are explicitly documented as AI concepts. They cannot substantiate workmanship, before/after results, or local job claims.
3. Hero copy gives services but little regional positioning or reason to choose a specialist.
4. Barlow Semi Condensed makes the identity feel utilitarian. Headings, phone, service names, and large numerals share too little typographic distinction.
5. The brand turquoise is bright and the cool glass-white palette clashes with the requested warm desert direction.
6. The white hero selection box is a heavy rectangular interruption; its oversized CTA competes with the headline.
7. Trust beneath the hero consists of one line. Pure-water care and one-visit convenience are missing at the decision point.
8. The local quote form is a short contact form, not a progressive builder. It contains only service selection, name, and phone.
9. No property city, size, story count, service-specific scope, access notes, or photo upload is collected.
10. No progress indicator, back action, editable summary, bundle state, or property-specific handoff exists.
11. Visitors receive no stated quote turnaround and no explanation of how pricing is determined.
12. No actual pricing/discount schedule exists in the repo. A dollar range or percentage discount would be fabricated.
13. The submission function emails only name, phone, and services; added fields or files need complete server support.
14. Error feedback is shared and generic; contact inputs lack adjacent messages and the service selection accepts an empty quote.
15. The form’s no-JavaScript error redirects do not explain delivery failure.
16. Live source and local source differ: live has four homepage services, local adds bird proofing and inner routes. Preserve the extra service route without diluting the four-service brief.

### Priority 2 — story, proof, and hierarchy

17. Service names use Title Case and very large condensed type; solar wraps while neighboring rows have inconsistent visual density.
18. Service imagery disappears entirely on smaller screens and active photos move down the column, adding motion without improving decisions.
19. The full-property illustration currently poses as an aerial photograph. Numbered pins are non-interactive and do not feed the quote system.
20. The method section is a generic four-item list beside a generated worker photo. The pure-water process itself is unexplained.
21. Windblown dust, desert heat, mineral residue, and delicate finishes are not organized into clear regional care decisions.
22. No genuine before/after pair, work video, review, rating, or customer reference is available in the repository. Web search found no verifiable review source for the supplied business and phone.
23. No solar soiling visual exists. Claims must distinguish an adjustable example from measured local savings.
24. There is no city coverage list or regional reassurance despite the local positioning.
25. No recurring care option or optional maintenance interest is captured.
26. The close offers call/email but no text action. The quote builder is buried below every other section.
27. The three-step section uses three equal columns, giant numbers, a drawn path, and another quote CTA; it adds length and visual mechanics with little new information.
28. The FAQ’s vertical phone rail consumes width and creates an unnecessary visual gimmick.
29. The footer is a four-column link farm and foregrounds “Concept imagery” instead of a clear local identity.

### Priority 3 — finish, accessibility, performance, and operations

30. A fixed edge-to-edge header uses animated heights; it feels attached to the viewport and causes unnecessary layout animation.
31. Desktop navigation vanishes at 1024px while the menu button appears only below 768px, leaving tablet visitors without navigation.
32. Every component shares a 4px radius. Buttons lack pressed feedback, selected chips lack an explicit check mark, and surface depth is almost absent.
33. Automatic dark-mode tokens can change the art-directed palette without a coherent alternate design.
34. Long reveal durations and staggered opacity can leave content faint during scrolling. The inline head script hides reveal content even if the main bundle fails.
35. FAQ height interpolation and hero clip animation violate the requested restrained transform/opacity motion direction.
36. The mobile action bar is edge-to-edge and may linger while tall quote content is visible because its visibility is based on a fraction of the whole section.
37. Canonical URL and absolute social preview URL are absent because Astro’s site URL is unset.
38. Local-business schema omits the now-confirmed service region; it must not invent an address, opening hours, reviews, or ratings.
39. The privacy copy does not cover optional property photos or new property information.
40. No server file limits, file-type verification, multipart request limit, or photo attachment handling exists.
41. No automated verification covers service synchronization, progressive navigation, attachment delivery, failure recovery, or mobile overflow.
42. README/asset instructions describe an earlier design and do not document the expanded quote payload or deployment prerequisites.

## Upgrade order

1. Display/body font pairing, restrained sand/navy/teal tokens, fine grain, interaction states.
2. Real Palm Springs photography, composed hero and proof strip; bring the quote builder immediately after the hero.
3. Four-stage quote: services, property, optional photos, contact/review. Preserve shared selection, extra bird-proofing support, and Pages delivery.
4. Refine service rows; replace the generated aerial with an interactive original property diagram; explain pure-water care.
5. Add a sourced, adjustable soiling example, honest local trust and city coverage, quiet recurring care, and dual call/text close.
6. Verify production build, all routes, desktop/tablet/mobile, keyboard and reduced-motion behavior, API payloads, attachment limits, and failure states.

## Evidence-dependent content

Real customer reviews and before/after footage require an authentic business source. They will not be invented or substituted with generated imagery. Until supplied, the implemented page will use the confirmed care standards, local service coverage, and a clearly labeled educational soiling model. The quote can state the requested under-24-hour turnaround; no unsupported dollar range or guaranteed discount percentage will be displayed.

## Accepted typography and texture refinement

Following review, the display direction moved from repeated serif italics to upright Plus Jakarta Sans. Headline sizes, line heights, service rows, phone numerals and calculator figures were recalibrated for the wider sans face. The paper grain was removed. A restrained SVG water-light texture now identifies the pure-water process section, with satin glass highlights around the quote builder. The effect uses CSS transforms and pauses offscreen; WebGL was not needed for this treatment.

## Logo-color follow-up

Restored the original two-tone drop and favicon after the first pass muted them too far into sage. The site now uses the supplied aqua and blue throughout the hero, quote actions and selections, water-light detail, property diagram and closing CTA. Secondary tints derive from these same two CSS tokens. Warm sand remains the main neutral surface; upright typography and the existing quote interactions remain in place.

## Photo-led follow-up

The owner asked to bring the existing generated imagery back into view. The initial preference for real-only photography is superseded by that direction. The files were preserved throughout the redesign; eight originals now appear again. The pool/glass hero leads, followed by service imagery before the quote builder. Mobile has a photo for each service rather than a single image after all four rows. The aerial replaces the SVG property drawing as a wide, explicitly illustrative view and retains interactive quote pins. The pure-water section and all service-detail heroes also regain their action imagery. The generated dusty/clean wipe remains unused, and no generated image is presented as customer evidence.

## Water typography and control-shape follow-up

Audit: the primary CTAs repeated fully rounded silhouettes; inset circular arrows made them look like generic nested buttons; hero service selectors repeated the same pill treatment. Decorative action icons and property pins also reinforced the rounding. The existing water detail lived behind a later section, leaving the hero text with a flat fill.

Priority: replace those control silhouettes with a compact 3px corner and a simple arrow, then add a lightweight WebGL water fill to the hero accent text. Preserve the actual heading, its layout, the logo palette, service selections and quote stages. Keep the shader contained to the lettering, static for reduced motion, paused offscreen, and optional when WebGL is unavailable.
