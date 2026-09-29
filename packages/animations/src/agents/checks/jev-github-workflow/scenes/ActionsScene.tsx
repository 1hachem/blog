import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";
import { GitHubMark } from "../marks";

export const ActionsScene: React.FC<ThemedProps> = ({ theme }) => {
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
        name="Mark"
        style={{
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
        <GitHubMark size={110} />
      </Interactive.Div>

      <Interactive.Div
        name="Headline"
        style={{
          fontSize: 80,
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
        GitHub Actions picks it up
      </Interactive.Div>

      <Interactive.Div
        name="Status"
        style={{
          color: c.yellow,
          border: `1px solid ${c.yellow}73`,
          backgroundColor: `${c.yellow}1a`,
          borderRadius: 99,
          padding: "14px 36px",
          fontSize: 44,
          opacity: interpolate(frame, [16, 34], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [16, 36], [0.86, 1], {
            easing: Easing.spring({ damping: 200 }),
            output: "perceptual-scale",
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        check:agents started
      </Interactive.Div>

      <Interactive.Div
        name="Note"
        style={{
          color: c.muted,
          fontSize: 40,
          opacity: interpolate(frame, [26, 44], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Two changed AGENTS.md hunks collected.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
