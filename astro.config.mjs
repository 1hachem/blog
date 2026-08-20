import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField } from 'astro/config';
import rehypeLinkFavicons from './src/lib/rehype-link-favicons.mjs';

export default defineConfig({
	site: 'https://blog-worker.hachem-betrouni.workers.dev',
	markdown: {
		rehypePlugins: [rehypeLinkFavicons],
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
		},
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
				// don't reload the dev server on Claude Code worktree/agent churn, and
				// don't follow .direnv/flake-inputs symlinks into the Nix store — they
				// point at full nixpkgs source checkouts and blow past the OS's inotify
				// watch limit (ENOSPC) if the watcher dereferences them.
				ignored: ['**/.claude/**', '**/.direnv/**'],
				followSymlinks: false,
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
