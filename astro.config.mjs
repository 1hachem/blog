import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField } from 'astro/config';
import rehypeLinkFavicons from './src/lib/rehype-link-favicons.mjs';

export default defineConfig({
	site: 'https://example.com',
	markdown: {
		rehypePlugins: [rehypeLinkFavicons],
	},
	env: {
		schema: {
			PUBLIC_R2_URL: envField.string({
				context: 'client',
				access: 'public',
				url: true,
			}),
		},
	},
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
