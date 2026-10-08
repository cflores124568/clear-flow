// Everything here except the four service names, the phone number and the
// Licensed & Insured line is proposed copy. Those three come from the business
// card; the rest needs the owner's sign-off before launch (see README).

export const phone = {
	display: '760-422-3069',
	href: 'tel:+17604223069',
};

export type ServiceId = 'solar' | 'windows' | 'pressure' | 'junk';

export type Service = {
	id: ServiceId;
	slug: string;
	name: string;
	chip: string;
	line: string;
	caption: string;
	// Service page copy. `includes` is a scope promise, so it is the first
	// thing the owner should check.
	lede: string;
	includes: { title: string; body: string }[];
};

export const services: Service[] = [
	{
		id: 'solar',
		slug: 'solar-panel-cleaning',
		name: 'Solar Panel Cleaning',
		chip: 'Solar panels',
		line: 'Soft brushes and pure water lift dust and droppings.',
		caption: 'Soft-brush solar cleaning',
		lede: 'Desert dust, pollen and bird droppings build up on panels fast. We wash them with soft brushes and pure water, never a pressure washer.',
		includes: [
			{ title: 'Soft-brush wash', body: 'Every panel, edge to edge, with a brush made for solar glass.' },
			{ title: 'Pure-water rinse', body: 'Filtered water that dries without spots or residue.' },
			{ title: 'A look while we are up there', body: "If we see cracked glass or loose wiring, we'll tell you." },
		],
	},
	{
		id: 'windows',
		slug: 'window-cleaning',
		name: 'Window Cleaning',
		chip: 'Windows',
		line: 'Inside and out, frames and tracks included.',
		caption: 'Squeegee on exterior glass',
		lede: 'Clear glass changes how a whole room feels. We clean inside and out, and we do the frames and tracks while we are there.',
		includes: [
			{ title: 'Outside and inside glass', body: 'Ground floor by hand, high windows with a water-fed pole.' },
			{ title: 'Frames, sills and tracks', body: 'The dust and grit that collect around the glass, wiped out.' },
			{ title: 'Screens', body: 'Brushed and rinsed so clean glass stays clean.' },
		],
	},
	{
		id: 'pressure',
		slug: 'pressure-washing',
		name: 'Pressure Washing',
		chip: 'Pressure washing',
		line: 'Driveways, patios, walkways and walls.',
		caption: 'Pressure washing a concrete driveway',
		lede: 'Driveways, walkways and patios lose their color to tire marks, oil and grime. We bring the concrete back, and use a gentler soft wash on walls and stucco.',
		includes: [
			{ title: 'Driveways and walkways', body: 'Tire marks, drips and built-up grime lifted off the concrete.' },
			{ title: 'Patios and pool decks', body: 'Pavers and decking cleaned without blasting the joints apart.' },
			{ title: 'Walls and stucco', body: 'Soft wash, not high pressure, so the finish stays intact.' },
		],
	},
	{
		id: 'junk',
		slug: 'junk-removal',
		name: 'Junk Removal',
		chip: 'Junk removal',
		line: 'Furniture, yard debris and garage clutter, hauled away.',
		caption: 'Loading furniture for haul-away',
		lede: "Point at what needs to go. We load it, haul it away and sweep up after, from a single sofa to a full garage.",
		includes: [
			{ title: 'Furniture and mattresses', body: 'Sofas, dressers, beds and the rest, carried out for you.' },
			{ title: 'Yard debris', body: 'Branches, palm fronds and green waste bagged and hauled.' },
			{ title: 'Garage and storage cleanouts', body: 'Boxes, clutter and old odds and ends, cleared in one trip.' },
		],
	},
];

export const faqs = [
	{
		q: 'Which service is right for my property?',
		a: "Tell us what you're seeing and we'll recommend the right mix, whether that's one service or all four.",
	},
	{
		q: 'Can I combine services?',
		a: "Yes. Pick as many as you need and we'll put them on one quote, and on one visit where the work allows.",
	},
	{
		q: 'Do I need to be home?',
		a: "Not for most exterior work, as long as we can reach the areas being cleaned. We'll confirm the details when we schedule.",
	},
	{
		q: 'How do I request a quote?',
		a: `Use the quote form, tap "Add to quote" on any service, or call ${phone.display}.`,
	},
];

export const serviceHref = (s: Service) => `/services/${s.slug}/`;

export const nav = [
	{ href: '/services/', label: 'Services' },
	{ href: '/about/', label: 'About' },
	{ href: '/faq/', label: 'FAQ' },
	{ href: '/contact/', label: 'Contact' },
];
