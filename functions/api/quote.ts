// Receives the quote form and emails it to the business via Resend.
//
// Runs as a Cloudflare Pages Function so the Resend key stays server-side. Set
// these in the Pages project's environment:
//   RESEND_API_KEY  Resend key with send rights on the sending domain
//   QUOTE_TO        Inbox(es) that receive requests, comma-separated
//   QUOTE_FROM      Verified sender, e.g. "Clear Flow Website <quotes@send.example.com>"

interface Env {
	RESEND_API_KEY?: string;
	QUOTE_TO?: string;
	QUOTE_FROM?: string;
}

// The only services the form offers. Anything else is dropped rather than
// forwarded, so a caller cannot put arbitrary text in the subject line.
const SERVICES: Record<string, string> = {
	solar: 'Solar panel cleaning',
	windows: 'Window cleaning',
	pressure: 'Pressure washing',
	junk: 'Junk removal',
};

const MAX_FIELD_LENGTH = 200;

const escapeHtml = (value: string) =>
	value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
	// The page's script asks for JSON; a plain form post (no JavaScript) gets a
	// redirect to a real page instead of raw JSON.
	const wantsJson = (request.headers.get('Accept') ?? '').includes('application/json');
	const reply = (success: boolean, status: number, message?: string) => {
		if (wantsJson) {
			return new Response(JSON.stringify(message ? { success, message } : { success }), {
				status,
				headers: { 'Content-Type': 'application/json' },
			});
		}
		const target = new URL(success ? '/thanks/' : '/#quote', request.url);
		return Response.redirect(target.href, 303);
	};

	if (!env.RESEND_API_KEY || !env.QUOTE_TO || !env.QUOTE_FROM) {
		console.error('Quote form is missing RESEND_API_KEY, QUOTE_TO or QUOTE_FROM');
		return reply(false, 500, 'Form is not configured');
	}

	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return reply(false, 400, 'Could not read submission');
	}

	// Honeypot: answer as if it worked so bots get no signal.
	if (form.get('botcheck')) return reply(true, 200);

	const read = (field: string) => String(form.get(field) ?? '').trim().slice(0, MAX_FIELD_LENGTH);
	const name = read('name');
	const phone = read('phone');
	if (!name) return reply(false, 400, 'Name is required');
	if (phone.replace(/\D/g, '').length < 10) return reply(false, 400, 'A valid phone number is required');

	const services = [...new Set(form.getAll('services').map(String))].filter((s) => s in SERVICES).map((s) => SERVICES[s]);
	const serviceLine = services.length ? services.join(', ') : 'Not specified';

	const rows: [string, string][] = [
		['Name', name],
		['Phone', phone],
		['Services', serviceLine],
	];

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.RESEND_API_KEY}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from: env.QUOTE_FROM,
			to: env.QUOTE_TO.split(',').map((s) => s.trim()).filter(Boolean),
			subject: `Quote request: ${name} (${serviceLine})`,
			text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
			html: rows.map(([k, v]) => `<p><strong>${k}:</strong> ${escapeHtml(v)}</p>`).join(''),
		}),
	});

	if (!response.ok) {
		console.error('Resend rejected the send', response.status, await response.text());
		return reply(false, 502, 'Could not send request');
	}

	return reply(true, 200);
};
