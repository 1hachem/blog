import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";

export const ScoresScene: React.FC<ThemedProps> = ({ theme }) => {
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
        JEV SCORES · HUNK 02
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
        Anything over 0.85 fails
      </Interactive.Div>

      <div style={{ display: "flex", flexDirection: "column", gap: 38 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <span style={{ color: c.muted, fontSize: 40, width: 380 }}>
            implementation
          </span>
          <div style={{ position: "relative", flex: 1, height: 20 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 12,
                backgroundColor: `${c.border}88`,
                overflow: "hidden",
              }}
            >
              <Interactive.Div
                name="Bar · implementation"
                style={{
                  height: "100%",
                  borderRadius: 12,
                  backgroundColor: c.red,
                  width: interpolate(frame, [12, 40], ["0%", "92%"], {
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: "85%",
                top: -14,
                bottom: -14,
                width: 2,
                backgroundColor: c.muted,
              }}
            />
          </div>
          <span
            style={{
              color: c.red,
              fontSize: 44,
              width: 140,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {interpolate(frame, [12, 40], [0, 0.92], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }).toFixed(2)}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <span style={{ color: c.muted, fontSize: 40, width: 380 }}>
            mechanism
          </span>
          <div style={{ position: "relative", flex: 1, height: 20 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 12,
                backgroundColor: `${c.border}88`,
                overflow: "hidden",
              }}
            >
              <Interactive.Div
                name="Bar · mechanism"
                style={{
                  height: "100%",
                  borderRadius: 12,
                  backgroundColor: c.red,
                  width: interpolate(frame, [26, 54], ["0%", "88%"], {
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: "85%",
                top: -14,
                bottom: -14,
                width: 2,
                backgroundColor: c.muted,
              }}
            />
          </div>
          <span
            style={{
              color: c.red,
              fontSize: 44,
              width: 140,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {interpolate(frame, [26, 54], [0, 0.88], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }).toFixed(2)}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <span style={{ color: c.muted, fontSize: 40, width: 380 }}>
            identifiers
          </span>
          <div style={{ position: "relative", flex: 1, height: 20 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 12,
                backgroundColor: `${c.border}88`,
                overflow: "hidden",
              }}
            >
              <Interactive.Div
                name="Bar · identifiers"
                style={{
                  height: "100%",
                  borderRadius: 12,
                  backgroundColor: c.purple,
                  width: interpolate(frame, [40, 68], ["0%", "31%"], {
                    easing: Easing.bezier(0.16, 1, 0.3, 1),
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: "85%",
                top: -14,
                bottom: -14,
                width: 2,
                backgroundColor: c.muted,
              }}
            />
          </div>
          <span
            style={{
              color: c.purple,
              fontSize: 44,
              width: 140,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {interpolate(frame, [40, 68], [0, 0.31], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }).toFixed(2)}
          </span>
        </div>
      </div>

      <Interactive.Div
        name="Note"
        style={{
          color: c.muted,
          fontSize: 38,
          opacity: interpolate(frame, [62, 80], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Two scores cross the 0.85 line, so the hunk fails.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
