import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";
import { JevMark } from "../marks";

export const RulesScene: React.FC<ThemedProps> = ({ theme }) => {
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
          color: c.purple,
          fontSize: 32,
          letterSpacing: 3,
          opacity: interpolate(frame, [0, 14], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        JEV CLASSIFICATION INSTRUCTIONS
      </Interactive.Div>

      <Interactive.Div
        name="Headline"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 30,
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
        <JevMark size={78} />
        One hunk at a time
      </Interactive.Div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <Interactive.Div
          name="Rule 1"
          style={{
            fontSize: 46,
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
          <span style={{ color: c.green }}>✓</span> Keep useful pointers.
        </Interactive.Div>

        <Interactive.Div
          name="Rule 2"
          style={{
            fontSize: 46,
            opacity: interpolate(frame, [22, 40], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [22, 44], ["-24px 0px", "0px 0px"], {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span style={{ color: c.red }}>×</span> Reject implementation details.
        </Interactive.Div>

        <Interactive.Div
          name="Rule 3"
          style={{
            fontSize: 46,
            opacity: interpolate(frame, [34, 52], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [34, 56], ["-24px 0px", "0px 0px"], {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span style={{ color: c.muted }}>→</span> Judge only the added hunk.
        </Interactive.Div>

        <Interactive.Div
          name="Rule 4"
          style={{
            fontSize: 46,
            opacity: interpolate(frame, [46, 64], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [46, 68], ["-24px 0px", "0px 0px"], {
              easing: Easing.spring({ damping: 200 }),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span style={{ color: c.muted }}>→</span> Return pass or fail.
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
