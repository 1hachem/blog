# Repository guidance

This repository uses pnpm 10.28.0 and Turborepo. Workspace packages live in `apps/*` and `packages/*`. Read the nearest `AGENTS.md` before changing a workspace. `CLAUDE.md` links to this file.

Keep app-specific dependencies and commands in the app package. Root scripts coordinate workspace tasks through Turbo. Keep task outputs package-relative, and declare environment variables used by cached tasks in `turbo.json`.

`pnpm format` writes formatting across the monorepo with the shared root Prettier configuration, which enforces single quotes. `pnpm lint` checks formatting across the monorepo. `pnpm typecheck` runs each workspace's typecheck task through Turbo. CI installs the blog package and its dependencies plus root tooling with `pnpm install --filter=blog... --filter=blog-monorepo --frozen-lockfile`.
