import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";
import { GitHubMark } from "../marks";

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
        gap: 40,
      }}
    >
      <Interactive.Div
        name="Mark"
        style={{
          color: c.red,
          opacity: interpolate(frame, [0, 16], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [0, 24], [0.86, 1], {
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <GitHubMark size={92} />
      </Interactive.Div>

      <Interactive.Div
        name="Verdict"
        style={{
          color: c.red,
          fontSize: 88,
          opacity: interpolate(frame, [6, 24], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [6, 28], ["0px 24px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        check:agents · FAILED
      </Interactive.Div>

      <Interactive.Div
        name="Tally"
        style={{
          color: c.muted,
          fontSize: 46,
          border: `1px solid ${c.border}`,
          borderRadius: 99,
          padding: "14px 36px",
          opacity: interpolate(frame, [18, 36], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [18, 38], [0.88, 1], {
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        1 passed · 1 failed
      </Interactive.Div>

      <Interactive.Div
        name="Note"
        style={{
          color: c.muted,
          fontSize: 38,
          textAlign: "center",
          opacity: interpolate(frame, [30, 48], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        One noncompliant hunk fails the pull request check.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
