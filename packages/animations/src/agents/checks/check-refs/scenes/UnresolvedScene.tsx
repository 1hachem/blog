import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";

export const UnresolvedScene: React.FC<ThemedProps> = ({ theme }) => {
  const c = palette(theme);
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: c.bg,
        color: c.text,
        fontFamily: mono,
        padding: "110px 140px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 40,
      }}
    >
      <Interactive.Div
        name="Kicker"
        style={{
          color: c.muted,
          fontSize: 32,
          letterSpacing: 3,
          opacity: interpolate(frame, [0, 14], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        CODEBASE SEARCH
      </Interactive.Div>

      <Interactive.Div
        name="Headline"
        style={{
          fontSize: 80,
          opacity: interpolate(frame, [2, 20], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [2, 24], ["0px 26px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        One does not
      </Interactive.Div>

      <Interactive.Div
        name="Unresolved row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "34px 44px",
          borderRadius: 18,
          border: `1px solid ${c.red}73`,
          backgroundColor: `${c.red}14`,
          fontSize: 56,
          opacity: interpolate(frame, [10, 28], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [10, 32], [0.94, 1], {
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        src/lib/ghost.ts
        <Interactive.Span
          name="Verdict"
          style={{
            color: c.red,
            border: `1px solid ${c.red}80`,
            backgroundColor: `${c.red}1f`,
            borderRadius: 99,
            padding: "10px 26px",
            fontSize: 34,
            scale: interpolate(frame, [22, 38], [0.8, 1], {
              easing: Easing.spring({ damping: 200 }),
              output: "perceptual-scale",
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          × NO MATCH
        </Interactive.Span>
      </Interactive.Div>

      <Interactive.Div
        name="Note"
        style={{
          color: c.muted,
          fontSize: 40,
          opacity: interpolate(frame, [30, 48], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        No file or identifier in the repo matches it.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
