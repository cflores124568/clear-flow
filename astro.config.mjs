// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://clear-flow.pages.dev',
	// Cloudflare Pages serves the directory build; links and canonicals use trailing slashes.
	trailingSlash: 'always',
	devToolbar: { enabled: false },
});
