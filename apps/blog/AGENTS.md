# Blog application

This workspace is an Astro site deployed to Cloudflare Workers. Its Astro source, public assets, tests, and Worker configuration live here.

`PUBLIC_R2_URL` has a development default in `astro.config.mjs`; deployments may set it to the production asset host. Keep the schema and value use aligned.

Run `pnpm dev` to start the site, `pnpm typecheck` for Astro diagnostics, `pnpm lint` to check formatting across the monorepo with Prettier, `pnpm format` to write formatting, and `pnpm test` for unit tests. Root scripts coordinate build, typecheck, and test tasks through Turbo.
