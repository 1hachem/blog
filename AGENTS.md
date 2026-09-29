# Repository guidance

This repository uses pnpm 10.28.0 and Turborepo. Workspace packages live in `apps/*` and `packages/*`. Read the nearest `AGENTS.md` before changing a workspace. `CLAUDE.md` links to this file.

Keep app-specific dependencies and commands in the app package. Root scripts coordinate workspace tasks through Turbo. Keep task outputs package-relative, and declare environment variables used by cached tasks in `turbo.json`.

`pnpm format` writes formatting across the monorepo with the shared root Prettier configuration, which enforces single quotes. `pnpm lint` checks formatting across the monorepo. `pnpm typecheck` runs each workspace's typecheck task through Turbo. CI installs the blog workspace and its workspace dependencies with `pnpm install --filter=blog... --frozen-lockfile`.

## Comments

**The code carries no comments**, enforced by `check:comments` in CI. The only ones
allowed are directives a tool reads, and those are not prose. The check covers
`.ts`, `.tsx`, `.css`, and `.astro` — the latter's frontmatter, `<script>` and
`<style>` blocks, and the markup's `<!-- -->` and `{/* */}` comments alike.

So: **do not write explanatory comments.** Not a header block, not a JSDoc on an
exported function, not a `// why` above a tricky line. The types say what a thing
is; the name says what it does; if neither is enough, the code is what to fix first.

`pnpm check:comments` lists offenders; `pnpm fix:comments` strips them (then run
`pnpm format`).
