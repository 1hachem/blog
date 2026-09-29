# Blog application

An Astro site deployed to Cloudflare Workers.

## Where things are

- `src/pages/` — the routes: home, about, the paginated blog with its category and
  tag indexes, the lists, 404, and `rss.xml.js`.
- `src/layouts/` — the page shells the routes render into.
- `src/components/` — shared UI; `diagrams/` holds the ones posts embed inline.
- `src/content/blog/` — the posts, as `.md` and `.mdx`. Their schema is `src/content.config.ts`.
- `src/data/` — hand-maintained content: the about-page git graph and the lists.
- `src/lib/` — helpers, each with its `.test.ts` beside it, plus the markdown pipeline plugin.
- `src/styles/global.css` — site-wide styling and the theme custom properties.
- `src/consts.ts` — site-level constants.
- `src/assets/` and `public/` — fonts and static files.
- `src/__mocks__/` — stand-ins for Astro's virtual modules under Vitest, wired up in `vitest.config.ts`.
- `astro.config.mjs` — integrations, the markdown pipeline, and the env schema.
- `wrangler.jsonc` — the Worker deployment.
- `scripts/optimize-photos.mjs` — prepares the photos served from R2.

## Commands

`pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm typecheck` (`astro check`),
`pnpm test` (Vitest), `pnpm deploy`, `pnpm optimize:photos`.
