import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";

export const HunkPassScene: React.FC<ThemedProps> = ({ theme }) => {
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
        HUNK 01 · JEV REQUEST
      </Interactive.Div>

      <Interactive.Div
        name="Request"
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
        “Is this a useful pointer?”
      </Interactive.Div>

      <Interactive.Div
        name="Hunk"
        style={{
          padding: "32px 40px",
          borderRadius: 18,
          border: `1px solid ${interpolateColors(frame, [46, 62], [c.border, c.green])}`,
          backgroundColor: interpolateColors(
            frame,
            [46, 62],
            [`${c.green}00`, `${c.green}14`],
          ),
          color: c.green,
          fontSize: 44,
          lineHeight: 1.6,
          opacity: interpolate(frame, [8, 26], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        + run `pnpm check:seams`
        <br />+ before touching `makeReader()`
      </Interactive.Div>

      <div style={{ position: "relative", height: 76 }}>
        <Interactive.Div
          name="Classifying"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            gap: 22,
            color: c.yellow,
            fontSize: 40,
            opacity: interpolate(frame, [18, 30, 44, 52], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Interactive.Div
            name="Spinner"
            style={{
              width: 34,
              height: 34,
              border: `4px solid ${c.yellow}55`,
              borderTopColor: c.yellow,
              borderRadius: "50%",
              rotate: interpolate(frame, [18, 52], ["0deg", "900deg"], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
          Jev is classifying this hunk…
        </Interactive.Div>

        <Interactive.Div
          name="Verdict"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            gap: 24,
            color: c.green,
            fontSize: 52,
            opacity: interpolate(frame, [50, 64], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [50, 68], [0.88, 1], {
              easing: Easing.spring({ damping: 200 }),
              output: "perceptual-scale",
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transformOrigin: "0% 50%",
          }}
        >
          ✓ COMPLIANT
          <span style={{ color: c.muted, fontSize: 36 }}>
            all scores below 0.85
          </span>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
