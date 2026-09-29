import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";

export const DiffScene: React.FC<ThemedProps> = ({ theme }) => {
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
        PULL REQUEST · packages/interpreter/AGENTS.md
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
        A pull request edits AGENTS.md
      </Interactive.Div>

      <Interactive.Div
        name="Hunk 01"
        style={{
          borderLeft: `4px solid ${c.green}`,
          paddingLeft: 30,
          opacity: interpolate(frame, [10, 28], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [10, 32], ["-24px 0px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ color: c.muted, fontSize: 30, letterSpacing: 2 }}>
          HUNK 01
        </div>
        <div style={{ color: c.green, fontSize: 44, lineHeight: 1.6 }}>
          + run `pnpm check:seams`
          <br />+ before touching `makeReader()`
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Hunk 02"
        style={{
          borderLeft: `4px solid ${c.green}`,
          paddingLeft: 30,
          opacity: interpolate(frame, [24, 42], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [24, 46], ["-24px 0px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div style={{ color: c.muted, fontSize: 30, letterSpacing: 2 }}>
          HUNK 02
        </div>
        <div style={{ color: c.green, fontSize: 44, lineHeight: 1.6 }}>
          + the reader walks the tokens
          <br />+ and returns a form for each
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
