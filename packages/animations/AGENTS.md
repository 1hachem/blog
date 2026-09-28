# Animations

Remotion compositions consumed by two hosts: the `animations-studio` app (Remotion
Studio and `render.mjs`) and the blog, which mounts them in `@remotion/player`.

Because the blog is one of those hosts, `staticFile()` does not work here — it
resolves against the host site's public directory, not this package. Import
assets instead, so the bundler rewrites the URL for whichever host is building.

Compositions take a `theme` prop and read their colors from `palette(theme)` in
`src/theme.ts`, which mirrors the blog's custom properties. Keep `interpolate()`
calls inline in `style` props so Studio can keyframe them.

`src/compositions.ts` is the registry both hosts read; keep `durationInFrames`
there in sync with the `<TransitionSeries>` in each composition.
