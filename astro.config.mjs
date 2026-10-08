// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Cloudflare Pages serves the directory build, so links and canonical URLs use
	// the trailing-slash shape. Set `site` once the domain is known; Base.astro
	// only emits canonical and og:url tags when it is present.
	trailingSlash: 'always',
});
