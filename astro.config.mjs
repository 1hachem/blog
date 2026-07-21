// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap(), pagefind()],
	devToolbar: { enabled: false },
	prefetch: {
		prefetchAll: false,
		defaultStrategy: 'hover',
	},
});
