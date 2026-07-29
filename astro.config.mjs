// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { validateEnv } from './src/env.ts';

// Validate environment variables the moment Astro boots (dev server or build)
// rather than lazily on first render, so misconfiguration fails fast.
function envValidation() {
	return {
		name: 'env-validation',
		hooks: {
			'astro:config:setup'({ command }) {
				const mode = command === 'dev' ? 'development' : 'production';
				validateEnv(loadEnv(mode, process.cwd(), ''));
			},
		},
	};
}

export default defineConfig({
	site: 'https://example.com',
	integrations: [envValidation(), mdx(), sitemap()],
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
