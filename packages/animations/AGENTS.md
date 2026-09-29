# Animations

Remotion compositions with two hosts: the `animations-studio` app, which previews
and renders them, and the blog, which mounts them in `@remotion/player`.

## Where things are

- `src/compositions.ts` — the registry both hosts read.
- `src/scenes.ts` — the scene exports.
- `src/theme.ts` — the palette and the themed props every composition takes.
- `src/agents/checks/<name>/` — one directory per composition: its top-level
  component, a `scenes/` directory, and the assets it imports.

## Commands

`pnpm typecheck` and `pnpm lint` here; preview and render from `apps/animations`.
