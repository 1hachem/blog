import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";

export const RunScene: React.FC<ThemedProps> = ({ theme }) => {
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
        gap: 52,
      }}
    >
      <Interactive.Div
        name="Headline"
        style={{
          fontSize: 80,
          opacity: interpolate(frame, [0, 18], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0, 22], ["0px 26px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Hand them to the script
      </Interactive.Div>

      <Interactive.Div
        name="Command bar"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 34,
          padding: "44px 56px",
          borderRadius: 20,
          border: `1px solid ${c.purple}73`,
          backgroundColor: `${c.purple}12`,
          fontSize: 64,
          opacity: interpolate(frame, [8, 26], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [8, 30], [0.94, 1], {
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <Interactive.Span name="Prompt" style={{ color: c.purple }}>
          ▶
        </Interactive.Span>
        pnpm check:refs
      </Interactive.Div>

      <Interactive.Div
        name="Subline"
        style={{
          color: c.muted,
          fontSize: 40,
          opacity: interpolate(frame, [20, 38], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Four references queued against the repository.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
