import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";

export const ResolvedScene: React.FC<ThemedProps> = ({ theme }) => {
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
        Three of them resolve
      </Interactive.Div>

      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <Interactive.Div
          name="Result row 1"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 52,
            opacity: interpolate(frame, [8, 26], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [8, 30], ["0px 18px", "0px 0px"], {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          apps/blog/src/content
          <Interactive.Span
            name="Verdict 1"
            style={{
              color: c.green,
              border: `1px solid ${c.green}73`,
              backgroundColor: `${c.green}1a`,
              borderRadius: 99,
              padding: "10px 26px",
              fontSize: 34,
              scale: interpolate(frame, [18, 34], [0.8, 1], {
                easing: Easing.spring({ damping: 200 }),
                output: "perceptual-scale",
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            ✓ FOUND
          </Interactive.Span>
        </Interactive.Div>

        <Interactive.Div
          name="Result row 2"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 52,
            opacity: interpolate(frame, [16, 34], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [16, 38], ["0px 18px", "0px 0px"], {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          BlogPost
          <Interactive.Span
            name="Verdict 2"
            style={{
              color: c.green,
              border: `1px solid ${c.green}73`,
              backgroundColor: `${c.green}1a`,
              borderRadius: 99,
              padding: "10px 26px",
              fontSize: 34,
              scale: interpolate(frame, [26, 42], [0.8, 1], {
                easing: Easing.spring({ damping: 200 }),
                output: "perceptual-scale",
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            ✓ FOUND
          </Interactive.Span>
        </Interactive.Div>

        <Interactive.Div
          name="Result row 3"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 52,
            opacity: interpolate(frame, [24, 42], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [24, 46], ["0px 18px", "0px 0px"], {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          pnpm check:refs
          <Interactive.Span
            name="Verdict 3"
            style={{
              color: c.green,
              border: `1px solid ${c.green}73`,
              backgroundColor: `${c.green}1a`,
              borderRadius: 99,
              padding: "10px 26px",
              fontSize: 34,
              scale: interpolate(frame, [34, 50], [0.8, 1], {
                easing: Easing.spring({ damping: 200 }),
                output: "perceptual-scale",
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            ✓ FOUND
          </Interactive.Span>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
