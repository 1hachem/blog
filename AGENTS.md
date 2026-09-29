# Repository guidance

A pnpm + Turborepo monorepo holding the blog and the animations it embeds.
`CLAUDE.md` links to this file. Read the nearest `AGENTS.md` before changing a
workspace.

## Layout

- `apps/blog` — the Astro site, deployed to Cloudflare Workers. See `apps/blog/AGENTS.md`.
- `apps/animations` — Remotion Studio and the CLI renderer for the compositions.
- `packages/animations` — the compositions themselves. See `packages/animations/AGENTS.md`.
- `scripts/` — repo-wide checks, run from the root.
- `turbo.json` — the task graph, cache inputs and outputs, and the env vars cached tasks read.
- `.github/workflows/` — `test.yaml` runs CI, `deploy.yaml` ships the blog.
- `.prettierrc.json` and `.prettierignore` — the shared formatting config; the animations workspaces override it with their own `.prettierrc`.

## Commands

Run from the root; Turbo fans them out across workspaces.

- `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm test`, `pnpm deploy`
- `pnpm lint` checks formatting, `pnpm format` writes it
- `pnpm check:comments` lists comments, `pnpm fix:comments` strips them

## Conventions

- Workspace-specific dependencies and scripts belong to that workspace, not the root.
- Task outputs stay package-relative, and cached tasks declare their env vars in `turbo.json`.
- The code carries no comments. CI enforces it over `.ts`, `.tsx`, `.css`, and `.astro`.

## What an AGENTS.md may contain

**Every other `AGENTS.md` is a router, never a description.** It says what a
workspace is, names the directories and files worth opening, and stops. No
implementation details: not how a thing works, not the rule some call has to
follow, not the invariant two files share.

Prose like that goes stale the moment the code moves, and a stale pointer is
worse than none — an agent trusts it and reads the wrong file. **The code is the
only source of truth.** If a constraint is real, it belongs in a name, a type or
a test, where it cannot drift.
