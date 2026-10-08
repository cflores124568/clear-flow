// Everything here except the four service names, the phone number and the
// Licensed & Insured line is proposed copy. Those three come from the business
// card; the rest needs the owner's sign-off before launch (see README).

export const phone = {
	display: '760-422-3069',
	href: 'tel:+17604223069',
};

export type ServiceId = 'solar' | 'windows' | 'pressure' | 'junk';

export const services: {
	id: ServiceId;
	name: string;
	chip: string;
	line: string;
	caption: string;
}[] = [
	{
		id: 'solar',
		name: 'Solar Panel Cleaning',
		chip: 'Solar panels',
		line: 'Soft brushes and pure water lift dust and droppings.',
		caption: 'Soft-brush solar cleaning',
	},
	{
		id: 'windows',
		name: 'Window Cleaning',
		chip: 'Windows',
		line: 'Inside and out, frames and tracks included.',
		caption: 'Squeegee on exterior glass',
	},
	{
		id: 'pressure',
		name: 'Pressure Washing',
		chip: 'Pressure washing',
		line: 'Driveways, patios, walkways and walls.',
		caption: 'Pressure washing a concrete driveway',
	},
	{
		id: 'junk',
		name: 'Junk Removal',
		chip: 'Junk removal',
		line: 'Furniture, yard debris and garage clutter, hauled away.',
		caption: 'Loading furniture for haul-away',
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
		a: `Use the form below, tap "Add to quote" on any service, or call ${phone.display}.`,
	},
];
