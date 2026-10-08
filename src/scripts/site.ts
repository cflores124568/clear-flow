// Page behaviour for the landing page. Everything here is an enhancement: the
// page reads, links and submits without it.

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Header turns solid once the page hero's top edge has scrolled away. Pages
// without a dark hero get the solid header from the start.
const header = document.querySelector<HTMLElement>('[data-header]');
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (header && !hero) header.classList.add('is-solid');
if (header && hero) {
	const sentinel = document.createElement('div');
	sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:64px;pointer-events:none';
	hero.prepend(sentinel);
	new IntersectionObserver(([entry]) => {
		header.classList.toggle('is-solid', !entry.isIntersecting);
	}).observe(sentinel);
}

// Close the mobile menu when one of its links is used.
const menu = document.getElementById('menu');
document.querySelectorAll('[data-close-menu]').forEach((link) => {
	link.addEventListener('click', () => menu?.hidePopover?.());
});

// One selection of services, mirrored everywhere it can be changed: the hero
// starter, each service's "Add to quote", and the quote form itself. The form's
// checkboxes are what actually get submitted.
const selected = new Set<string>(
	[...document.querySelectorAll<HTMLInputElement>('input[data-service]:checked')].map((input) => input.dataset.service!),
);

function renderSelection() {
	document.querySelectorAll<HTMLInputElement>('input[data-service]').forEach((input) => {
		input.checked = selected.has(input.dataset.service!);
	});
	document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((button) => {
		const on = selected.has(button.dataset.add!);
		button.setAttribute('aria-pressed', String(on));
		button.querySelector<HTMLElement>('[data-label-off]')!.hidden = on;
		button.querySelector<HTMLElement>('[data-label-on]')!.hidden = !on;
	});
}

function setService(id: string, on: boolean) {
	if (on) selected.add(id);
	else selected.delete(id);
	renderSelection();
}

renderSelection();

document.addEventListener('change', (event) => {
	const input = event.target as HTMLInputElement;
	if (input.matches?.('input[data-service]')) setService(input.dataset.service!, input.checked);
});

document.querySelectorAll<HTMLButtonElement>('[data-add]').forEach((button) => {
	button.addEventListener('click', () => setService(button.dataset.add!, !selected.has(button.dataset.add!)));
});

// The hero starter hands off to the full form instead of navigating.
const nameField = document.getElementById('q-name') as HTMLInputElement | null;
document.querySelector<HTMLFormElement>('[data-starter]')?.addEventListener('submit', (event) => {
	event.preventDefault();
	document.getElementById('quote')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
	nameField?.focus({ preventScroll: true });
});

// Services index: the active row drives which photo shows and where it sits.
const servicesBody = document.querySelector<HTMLElement>('[data-services]');
if (servicesBody) {
	const rows = [...servicesBody.querySelectorAll<HTMLElement>('[data-svc]')];
	const images = [...servicesBody.querySelectorAll<HTMLElement>('[data-svc-img]')];
	const media = servicesBody.querySelector<HTMLElement>('[data-svc-media]');
	const caption = servicesBody.querySelector<HTMLElement>('[data-svc-caption]');
	const captions: string[] = JSON.parse(
		servicesBody.querySelector<HTMLTemplateElement>('[data-captions]')?.innerHTML ?? '[]',
	);
	const frame = media?.querySelector<HTMLElement>('.svc-media__frame');

	const activate = (index: number) => {
		rows.forEach((row, i) => row.classList.toggle('is-active', i === index));
		images.forEach((img, i) => img.classList.toggle('is-active', i === index));
		if (caption && captions[index]) caption.textContent = captions[index];
		if (media && frame) {
			// Keep the photo level with its row, but never past the end of the list.
			const max = servicesBody.offsetHeight - frame.offsetHeight - 40;
			const y = Math.max(0, Math.min(rows[index].offsetTop - rows[0].offsetTop, max));
			media.style.setProperty('--media-y', `${y}px`);
		}
	};

	rows.forEach((row, i) => {
		row.addEventListener('pointerenter', () => activate(i));
		row.addEventListener('focusin', () => activate(i));
	});
}

// The process path runs from each numeral to the next. It is measured from the
// laid-out numerals so it lands on them at any width.
const stepsPath = document.querySelector<SVGSVGElement>('[data-steps-path]');
if (stepsPath) {
	const steps = stepsPath.parentElement!;
	const line = stepsPath.querySelector('polyline')!;
	const draw = () => {
		// Layout offsets, not client rects: the reveal animation moves the steps
		// with transforms, and the line should match where they come to rest.
		const within = (el: HTMLElement) => {
			let x = 0;
			let y = 0;
			for (let node: HTMLElement | null = el; node && node !== steps; node = node.offsetParent as HTMLElement | null) {
				x += node.offsetLeft;
				y += node.offsetTop;
			}
			return { x, y };
		};
		const nums = [...steps.querySelectorAll<HTMLElement>('.step__num')].map((n) => {
			const { x, y } = within(n);
			return { left: x, right: x + n.offsetWidth, mid: y + n.offsetHeight * 0.5 };
		});
		if (!nums.length || !steps.offsetWidth) return;
		stepsPath.setAttribute('viewBox', `0 0 ${steps.offsetWidth} ${steps.offsetHeight}`);
		const pts: number[][] = [];
		nums.forEach((n, i) => {
			const next = nums[i + 1];
			if (!next) return;
			pts.push([n.right + 14, n.mid], [next.left - 46, n.mid], [next.left - 10, next.mid]);
		});
		line.setAttribute('points', pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '));
	};
	draw();
	new ResizeObserver(draw).observe(steps);
	document.fonts?.ready.then(draw);
}

// Reveal-on-scroll, the aerial's pins, and the process line all key off one
// observer that marks elements visible once and lets go.
const revealables = document.querySelectorAll<HTMLElement>('[data-reveal], [data-pins], [data-draw]');
if (reducedMotion || !('IntersectionObserver' in window)) {
	revealables.forEach((el) => el.classList.add('is-visible'));
} else {
	const io = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-visible');
				io.unobserve(entry.target);
			});
		},
		{ rootMargin: '0px 0px -12% 0px', threshold: 0.15 },
	);
	revealables.forEach((el) => io.observe(el));
}

// The sticky mobile bar steps aside while the quote form is on screen.
const mbar = document.querySelector<HTMLElement>('[data-mbar]');
const quote = document.getElementById('quote');
if (mbar && quote) {
	new IntersectionObserver(([entry]) => mbar.classList.toggle('is-hidden', entry.isIntersecting), {
		threshold: 0.2,
	}).observe(quote);
}

// Quote form: validate in place, send in the background, swap in a thank-you.
const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
if (form) {
	const status = form.querySelector<HTMLElement>('[data-form-status]')!;
	const fields = form.querySelector<HTMLElement>('[data-form-fields]')!;
	const done = form.querySelector<HTMLElement>('[data-form-done]')!;
	const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
	const defaultNote = status.textContent?.trim() ?? '';

	const setStatus = (text: string, isError = false) => {
		status.textContent = text;
		status.classList.toggle('is-error', isError);
	};

	const checks: [HTMLInputElement, (value: string) => string | null][] = [
		[form.elements.namedItem('name') as HTMLInputElement, (v) => (v.trim() ? null : 'Please add your name.')],
		[
			form.elements.namedItem('phone') as HTMLInputElement,
			(v) => (v.replace(/\D/g, '').length >= 10 ? null : 'Please add a phone number we can reach you on.'),
		],
	];

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		for (const [input] of checks) input.removeAttribute('aria-invalid');
		const failed = checks.find(([input, check]) => check(input.value) !== null);
		if (failed) {
			const [input, check] = failed;
			input.setAttribute('aria-invalid', 'true');
			setStatus(check(input.value)!, true);
			input.focus();
			return;
		}

		submit.disabled = true;
		setStatus('Sending…');

		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: new FormData(form),
				headers: { Accept: 'application/json' },
			});
			const result = await response.json().catch(() => ({ success: false }));
			if (!response.ok || !result.success) throw new Error(result.message ?? 'Send failed');

			fields.hidden = true;
			done.hidden = false;
			done.focus();
		} catch {
			setStatus("That didn't send. Please call 760-422-3069 and we'll quote you by phone.", true);
			submit.disabled = false;
		}
	});

	form.addEventListener('input', (event) => {
		const input = event.target as HTMLInputElement;
		if (input.getAttribute('aria-invalid') === 'true') {
			input.removeAttribute('aria-invalid');
			setStatus(defaultNote);
		}
	});
}
