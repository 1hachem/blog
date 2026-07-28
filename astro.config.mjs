// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	devToolbar: { enabled: false },
	vite: {
		server: {
			watch: {
				// don't reload the dev server on Claude Code worktree/agent churn
				ignored: ['**/.claude/**'],
			},
		},
	},
	prefetch: {
		prefetchAll: false,
		// Links in the viewport (e.g. the category filter at the top of the
		// page) prefetch on load, so the first category switch is instant.
		defaultStrategy: 'viewport',
	},
});
