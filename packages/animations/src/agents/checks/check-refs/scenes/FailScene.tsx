import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";

export const FailScene: React.FC<ThemedProps> = ({ theme }) => {
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
        alignItems: "center",
        gap: 44,
      }}
    >
      <Interactive.Div
        name="Verdict"
        style={{
          color: c.red,
          fontSize: 96,
          opacity: interpolate(frame, [0, 18], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 26], [0.9, 1], {
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        check:refs · FAILED
      </Interactive.Div>

      <Interactive.Div
        name="Tally"
        style={{
          color: c.muted,
          fontSize: 46,
          border: `1px solid ${c.border}`,
          borderRadius: 99,
          padding: "14px 36px",
          opacity: interpolate(frame, [14, 32], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [14, 36], ["0px 18px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        3 valid · 1 unresolved
      </Interactive.Div>

      <Interactive.Div
        name="Note"
        style={{
          color: c.muted,
          fontSize: 40,
          textAlign: "center",
          opacity: interpolate(frame, [28, 46], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        One missing reference fails the command and CI.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
