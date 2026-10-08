# Photo assets

The site's photos are AI-generated Coachella Valley concept images, made from the prompts below (untouched originals in `assets-src/`). They are illustration, not Clear Flow's work. The best replacement is real Clear Flow job photos (shot list at the bottom). Once every photo is real, remove the "Concept imagery" note from the footer.

Every file lives in `src/assets/photos/` and keeps the same name, so a swap is a drop-in: no code changes except the two noted steps.

| File | Size | Used in | After swapping |
| --- | --- | --- | --- |
| `hero-clean.jpg` | 2400 × 1350 | Hero (clean side of the wipe) | Run `./scripts/make-dusty.sh` to rebuild `hero-dusty.jpg` |
| `aerial.jpg` | 2400 × 1350 | "One visit. The whole property." | Re-measure the four pin positions in `src/components/Property.astro` |
| `svc-solar.jpg` | 1600 × 1200 | Services hover photo 01 | — |
| `svc-birds.jpg` | 1600 × 1200 | Services hover photo 02 | — |
| `svc-windows.jpg` | 1600 × 1200 | Services hover photo 03 | — |
| `svc-pressure.jpg` | 1600 × 1200 | Services hover photo 04 | — |
| `svc-junk.jpg` | 1600 × 1200 | Services hover photo 05 | — |
| `method-window.jpg` | 1200 × 1333 | "Careful is the whole point." | — |

The 2026 flyers are not a photo source: their before/after solar shots look AI-generated, and the window-cleaning shots appear to be Canva stock, which can't be lifted out for standalone web use.

## Rules for AI photos

AI photos are illustration, not proof. While any are on the site:
- Keep the "Concept imagery" note in the footer.
- Never use them as before/after shots, in a "Our work" gallery, on the Google Business Profile, in ads that imply real jobs, or next to reviews.
- Never put the Clear Flow logo or name on AI workers, trucks or uniforms. Branded fakes read as real jobs.

## Codex prompts (Coachella Valley realism)

Paste into Codex with the image-generation tool. Generate one image per call. Prepend the shared block to every prompt and save each result under its file name. Do NOT attach the design frames as a style anchor here: they push toward glossy, catalog-perfect light, which is exactly what makes AI photos look fake.

If a result still looks staged, regenerate with: "Less perfect. Plainer house, harsher light, more ordinary mess, more like a phone photo a crew lead took on the job."

### Shared block (prepend to every prompt)

> PHOTOGRAPH ONLY. No text anywhere: no logos, no lettering on shirts, trucks, equipment or signs, no license plates (crop them out or angle them away), no watermarks, no UI, no borders.
>
> LOOK: An unretouched documentary photo, as if a crew lead shot it on a recent iPhone with the main 24mm lens on a real job. Natural phone HDR, true color, slightly imperfect framing, a horizon a degree or two off, mild lens flare when facing the sun. NOT cinematic, NOT golden-hour glamour, NOT a stock photo, NOT a magazine shoot. No shallow-depth-of-field bokeh portrait look.
>
> PLACE: The Coachella Valley in California (Palm Desert, La Quinta, Indio, Rancho Mirage). Ordinary, lived-in homes, not mansions: 1990s to 2000s Mediterranean and Spanish-style stucco in tan, sand or beige, with concrete S-tile or barrel-tile roofs; slump-block garden walls; decomposed-granite and river-rock yards with boulders, agave, ocotillo, palo verde and bougainvillea on the walls; tall skinny fan palms; drip-irrigation lines; a neighbor's house visible. Rugged, bare, brown Santa Rosa or San Jacinto mountains in the distance. A pale, washed-out desert sky with a little haze.
>
> LIGHT: Early morning, roughly 6 to 8 a.m., because crews work early to beat the heat: low, hard, bright sun, crisp long shadows, high contrast, no warm orange glow.
>
> REAL DIRT: Fine tan windblown dust, white hard-water rings from sprinkler overspray on glass, bird droppings, tire marks and oil stains on driveways, efflorescence on pavers, leaf litter in corners.
>
> CREW: Real working clothes for desert heat: long-sleeve sun shirts in plain gray, navy or tan, neck gaiters or sun hoods, plain caps or wide-brim hats, sunglasses, work gloves, sweat marks, scuffed boots. Faces turned away, shaded or cropped. Natural bodies and hands, with correct fingers gripping the tools.
>
> GEAR THAT OBEYS PHYSICS: Hoses run from a real source (a truck-mounted tank and reel, a filter cart, a spigot). Water sprays, sheets and drips believably. Correct tools: water-fed telescoping poles with soft brushes for solar panels and high glass; squeegees and scrubbers for windows; a gas pressure washer with wand and hose for concrete and pavers only; a dump trailer or box truck for hauling. Never a pressure washer on solar panels. Anyone on a roof wears a harness tied off to a visible anchor.

### hero-clean.jpg (2400 × 1350, 16:9)

> View from inside a living room looking out through a large, freshly cleaned sliding glass door toward a Coachella Valley backyard: a covered patio with pavers, a small pool with a tan pool deck, a slump-block back wall with bougainvillea, two tall skinny fan palms, and the brown Santa Rosa Mountains beyond. Early-morning light. The glass is completely clear. A slim door frame runs down the far right edge only. No people, no hands, no tools. Keep the left 45% calm (sky, wall, palms) because a headline sits over it.

### aerial.jpg (2400 × 1350, 16:9)

> Drone photo from about 40 feet up at a three-quarter angle over an ordinary single-story Mediterranean stucco home in a Palm Desert neighborhood: a concrete tile roof with a rooftop solar array, several large windows and a sliding door, a long concrete driveway with tire marks, an open two-car garage with a few storage shelves, and a white pickup with a utility trailer at the curb, the trailer loaded with an old sofa, a dresser, yard waste bags and broken patio furniture. Neighboring houses, palms, gravel yards and the mountains behind. Leave calm sky and distant mountains in the top-left third for a headline. Early-morning light, long shadows.

### svc-solar.jpg (1600 × 1200, 4:3)

> On a tile roof, a crew member in a harness and sun hood guides a water-fed pole with a soft rectangular brush across a row of dusty solar panels. Half the panel row is still coated in tan dust and bird droppings; the cleaned half is dark, wet and reflects the sky. Pure water sheets off the low edge into the tile gutter. A hose runs back along the roof to the edge. Early-morning sun from the side. Mountains in the background.

### svc-windows.jpg (1600 × 1200, 4:3)

> Close, over-the-shoulder shot of a gloved hand pulling a squeegee across a large exterior window of a stucco home. Left of the blade the glass is spotted with white hard-water rings and dust; right of the blade it is perfectly clear. Soapy water drips down the frame onto the sill. A bucket and scrubber sit on the gravel below. Early-morning light, a palm reflected in the glass.

### svc-pressure.jpg (1600 × 1200, 4:3)

> A crew member's legs and boots and a pressure-washer wand cleaning a stained concrete driveway in front of a stucco garage. A crisp, clean stripe cuts through gray grime, tire marks and an oil stain; water fans out and runs toward the gutter carrying dirt. The hose leads back to a gas pressure washer on a trailer at the curb. Wet concrete, early-morning shadows.

### svc-junk.jpg (1600 × 1200, 4:3)

> Two crew members in sun shirts and gloves carrying an old upholstered loveseat down a driveway toward a dump trailer hitched to a white pickup. The trailer already holds a mattress, broken patio chairs, yard waste bags and cardboard boxes. An open garage behind them is half cleared out. Early-morning light, faces turned away.

### svc-birds.jpg (1600 × 1200, 4:3)

> On a concrete S-tile roof, a crew member in a harness and sun hood kneels at the edge of a rooftop solar array, pressing a strip of black PVC-coated half-inch wire mesh against the panel frame with one gloved hand and fixing it with a small stainless clip with the other. The mesh closes the gap between the panel edge and the roof tiles. Along the finished side the mesh runs neat and continuous; further along, the gap is still open, with twigs, feathers and white droppings visible underneath. A roll of mesh and a small bucket of clips sit on the tiles beside them. The harness is tied off to a visible roof anchor. Early-morning side light, neighboring roofs and the mountains behind. No birds in frame.

### method-window.jpg (1200 × 1333, 9:10 portrait)

> A crew member standing on the gravel beside a two-story stucco home, reaching a high second-story window with a long water-fed telescoping pole and a soft brush, a fine pure-water spray on the glass. A small wheeled pure-water filter cart with two blue filter canisters sits beside them, the hose running to the pole. Both hands on the pole. Palms and the mountains behind, early-morning light. No solar panels, no pressure washer, no foam.

## Re-measuring the aerial pins

Each pin in `Property.astro` is `{ x, y }` as a percentage of the photo's width and height, at the center of the spot it marks. Open the new `aerial.jpg` in any viewer that shows pixel coordinates, take the center of the solar array, the windows, the driveway and the trailer's load, and divide by the image width and height. Pin 4 has `flip: true` so its label sits to the left on phones; keep that on whichever pin is nearest the right edge.

## Real-photo shot list (for the Clear Flow crew)

Real job photos beat any generated image, and real before/after pairs are the strongest proof a local service site can show. Over the next few jobs, with the homeowner's OK:

1. Shoot horizontally (landscape), phone held level, early in the job when the light is low.
2. For each service, take one **wide** shot (the crew working, the house in frame) and one **close** shot (the tool on the surface).
3. Take **before and after from the exact same spot**: dusty panels then clean, spotted glass then clear, stained driveway then clean, full garage then empty, open gap under the panels then critter guard fitted.
4. One shot of the truck and gear setup (water tank, filter cart, trailer). A Clear Flow logo is fine here, because it's real.
5. Keep out customer faces, house numbers, license plates and anything inside the home.
6. Send the originals (AirDrop or a shared album), not screenshots or texted copies, which lose resolution.

Six to ten good photos cover every image slot on the site.
