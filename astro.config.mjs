// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	devToolbar: { enabled: false },
	prefetch: {
		prefetchAll: false,
		// Links in the viewport (e.g. the category filter at the top of the
		// page) prefetch on load, so the first category switch is instant.
		defaultStrategy: 'viewport',
	},
});
