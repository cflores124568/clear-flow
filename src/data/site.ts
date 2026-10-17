// Everything here except the service names, the phone number, the email and
// the Licensed, Bonded & Insured line is proposed copy. Those come from the
// business card and flyers; the rest needs the owner's sign-off before launch
// (see README).

export const phone = {
	display: '760-422-3069',
	href: 'tel:+17604223069',
};

export const email = {
	display: 'clearflowofthedesert@gmail.com',
	href: 'mailto:clearflowofthedesert@gmail.com',
};

export const textHref = 'sms:+17604223069';

export const instagram = {
	handle: '@clear_flow760',
	href: 'https://www.instagram.com/clear_flow760/',
};

// The burst at /brand/yelp-favicon.svg is Yelp's official favicon, unaltered.
// Yelp's brand rules allow it as a shortcut link; don't redraw or recolor it,
// and don't use Yelp's star artwork for ratings.
export const yelp = {
	href: 'https://www.yelp.com/biz/clear-flow-cathedral-city',
	icon: '/brand/yelp-favicon.svg',
};

// Quoted verbatim from Clear Flow's Yelp page. Edit only to match Yelp.
export const reviews = [
	{ name: 'Kat G.', rating: 5, title: 'Solar Panel Cleaning-Exceptional Service and Crystal Clear Results!', body: 'Easy scheduling, punctual, used a drone to evaluate roof condition (no extra charge), before and after pictures of the solar panels, Arnold was knowledgeable and professional. If you want to maximize your solar investment, I highly recommend ClearFlow to maintain and clean your solar panels.' },
	{ name: 'Barbara C.', rating: 5, body: 'We highly recommend Clear Flow for solar panel cleaning. Clear Flow is very customer focused - they are on-time, efficient, very neat and careful. They do an excellent job cleaning the solar panels and provide before and after pictures. This is a very effective way to take care of a solar system at a reasonable price. Cleaning our panels resulted in an immediate improvement in our solar production. Thank you Clear Flow!' },
	{ name: 'Ed J.', rating: 5, body: 'This place is amazing ! Arnold was so easy to work with great service I highly recommend it was a great experience' },
];
export const cities = ['Cathedral City', 'Palm Springs', 'Rancho Mirage', 'Palm Desert', 'La Quinta', 'Indio', 'Indian Wells', 'Desert Hot Springs'];

// City centers for the service-area map, as [longitude, latitude]. Pins mark
// the cities served, not an office or job site.
export const cityCenters: Record<string, [number, number]> = {
	'Desert Hot Springs': [-116.5017, 33.9611],
	'Palm Springs': [-116.5453, 33.8303],
	'Cathedral City': [-116.4653, 33.7797],
	'Rancho Mirage': [-116.4128, 33.7397],
	'Palm Desert': [-116.3745, 33.7222],
	'Indian Wells': [-116.3408, 33.7175],
	'La Quinta': [-116.31, 33.6634],
	'Indio': [-116.2156, 33.7206],
};

export type ServiceId = 'solar' | 'birds' | 'windows' | 'pressure' | 'junk';

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
		name: 'Solar panel cleaning',
		chip: 'Solar panels',
		line: 'Soft brushes and pure water lift dust and droppings.',
		caption: 'Soft brushes. Pure water. Nothing harsh on your panels.',
		lede: 'Desert dust, pollen and bird droppings build up on panels fast. We wash them with soft brushes and pure water, never a pressure washer.',
		includes: [
			{ title: 'Soft-brush wash', body: 'Every panel, edge to edge, with a brush made for solar glass.' },
			{ title: 'Pure-water rinse', body: 'Filtered water that dries without spots or residue.' },
			{ title: 'A look while we are up there', body: "If we see cracked glass or loose wiring, we'll tell you." },
		],
	},
	{
		id: 'birds',
		slug: 'bird-proofing',
		name: 'Bird proofing',
		chip: 'Bird proofing',
		line: 'Critter guard that keeps pigeons out from under your panels.',
		caption: 'A considered fit around the edge of the array.',
		lede: "Pigeons and other critters nest in the gap under rooftop panels. We clear out what's there and fit critter guard around the array so they can't get back in.",
		includes: [
			{ title: 'Nest and debris cleanout', body: 'Nesting material and droppings cleared from under the panels.' },
			{ title: 'Critter guard installation', body: 'Mesh fitted around the edge of the array to close the gap underneath.' },
			{ title: 'Pair it with a panel wash', body: 'Book it with solar cleaning and both get done in one visit.' },
		],
	},
	{
		id: 'windows',
		slug: 'window-cleaning',
		name: 'Window cleaning',
		chip: 'Windows',
		line: 'Inside and out, frames and tracks included.',
		caption: 'Clear glass, with the details taken care of.',
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
		name: 'Pressure washing',
		chip: 'Pressure washing',
		line: 'Driveways, patios, walkways and walls.',
		caption: 'The right approach for every surface.',
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
		name: 'Junk removal',
		chip: 'Junk removal',
		line: 'Furniture, yard debris and garage clutter, hauled away.',
		caption: 'Point it out. We’ll take it from there.',
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
		a: "Tell us what you're seeing and we'll recommend the right mix, whether that's one service or all five.",
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

export const coreServices = services.filter((service) => service.id !== 'birds');

export const nav = [
	{ href: '/services/', label: 'Services' },
	{ href: '/service-areas/', label: 'Service areas' },
	{ href: '/about/', label: 'About' },
	{ href: '/faq/', label: 'FAQ' },
	{ href: '/contact/', label: 'Contact' },
];
