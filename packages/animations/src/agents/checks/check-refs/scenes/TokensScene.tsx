import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";

export const TokensScene: React.FC<ThemedProps> = ({ theme }) => {
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
        EXTRACTED REFERENCES
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
        Four tokens to check
      </Interactive.Div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <Interactive.Div
          name="Token row 1"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${c.border}`,
            paddingBottom: 18,
            fontSize: 52,
            color: c.green,
            opacity: interpolate(frame, [6, 24], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [6, 28], ["-28px 0px", "0px 0px"], {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          pnpm check:refs
          <span
            style={{
              color: c.muted,
              fontSize: 30,
              letterSpacing: 2,
            }}
          >
            COMMAND
          </span>
        </Interactive.Div>

        <Interactive.Div
          name="Token row 2"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${c.border}`,
            paddingBottom: 18,
            fontSize: 52,
            color: c.green,
            opacity: interpolate(frame, [12, 30], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [12, 34], ["-28px 0px", "0px 0px"], {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          apps/blog/src/content
          <span
            style={{
              color: c.muted,
              fontSize: 30,
              letterSpacing: 2,
            }}
          >
            PATH
          </span>
        </Interactive.Div>

        <Interactive.Div
          name="Token row 3"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${c.border}`,
            paddingBottom: 18,
            fontSize: 52,
            color: c.green,
            opacity: interpolate(frame, [18, 36], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [18, 40], ["-28px 0px", "0px 0px"], {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          BlogPost
          <span
            style={{
              color: c.muted,
              fontSize: 30,
              letterSpacing: 2,
            }}
          >
            SYMBOL
          </span>
        </Interactive.Div>

        <Interactive.Div
          name="Token row 4"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${c.border}`,
            paddingBottom: 18,
            fontSize: 52,
            color: c.green,
            opacity: interpolate(frame, [24, 42], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [24, 46], ["-28px 0px", "0px 0px"], {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          src/lib/ghost.ts
          <span
            style={{
              color: c.muted,
              fontSize: 30,
              letterSpacing: 2,
            }}
          >
            PATH
          </span>
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
