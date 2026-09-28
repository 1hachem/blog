import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { mono, palette, type ThemedProps } from "../../../../theme";

export const SourceScene: React.FC<ThemedProps> = ({ theme }) => {
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
        REPOSITORY · apps/blog/AGENTS.md
      </Interactive.Div>

      <Interactive.Div
        name="Headline"
        style={{
          fontSize: 80,
          opacity: interpolate(frame, [4, 22], [0, 1], {
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [4, 26], ["0px 26px", "0px 0px"], {
            easing: Easing.spring({ damping: 200 }),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Scan the backticked refs
      </Interactive.Div>

      <div
        style={{
          position: "relative",
          fontSize: 52,
          lineHeight: 1.9,
          color: c.muted,
        }}
      >
        <Interactive.Div
          name="Line 1"
          style={{
            opacity: interpolate(frame, [12, 30], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Run{" "}
          <Interactive.Span
            name="Token · pnpm check:refs"
            style={{
              borderRadius: 8,
              padding: "2px 10px",
              color: interpolateColors(frame, [49, 59], [c.text, c.green]),
              backgroundColor: interpolateColors(
                frame,
                [49, 59],
                [`${c.green}00`, `${c.green}24`],
              ),
            }}
          >
            `pnpm check:refs`
          </Interactive.Span>{" "}
          after edits.
        </Interactive.Div>

        <Interactive.Div
          name="Line 2"
          style={{
            opacity: interpolate(frame, [16, 34], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Follow{" "}
          <Interactive.Span
            name="Token · apps/blog/src/content"
            style={{
              borderRadius: 8,
              padding: "2px 10px",
              color: interpolateColors(frame, [66, 76], [c.text, c.green]),
              backgroundColor: interpolateColors(
                frame,
                [66, 76],
                [`${c.green}00`, `${c.green}24`],
              ),
            }}
          >
            `apps/blog/src/content`
          </Interactive.Span>
        </Interactive.Div>

        <Interactive.Div
          name="Line 3"
          style={{
            opacity: interpolate(frame, [20, 38], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Keep{" "}
          <Interactive.Span
            name="Token · BlogPost"
            style={{
              borderRadius: 8,
              padding: "2px 10px",
              color: interpolateColors(frame, [84, 94], [c.text, c.green]),
              backgroundColor: interpolateColors(
                frame,
                [84, 94],
                [`${c.green}00`, `${c.green}24`],
              ),
            }}
          >
            `BlogPost`
          </Interactive.Span>{" "}
          in the renderer.
        </Interactive.Div>

        <Interactive.Div
          name="Line 4"
          style={{
            opacity: interpolate(frame, [24, 42], [0, 1], {
              easing: Easing.bezier(0.16, 1, 0.3, 1),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          See{" "}
          <Interactive.Span
            name="Token · src/lib/ghost.ts"
            style={{
              borderRadius: 8,
              padding: "2px 10px",
              color: interpolateColors(frame, [101, 111], [c.text, c.green]),
              backgroundColor: interpolateColors(
                frame,
                [101, 111],
                [`${c.green}00`, `${c.green}24`],
              ),
            }}
          >
            `src/lib/ghost.ts`
          </Interactive.Span>{" "}
          for helpers.
        </Interactive.Div>

        <Interactive.Div
          name="Scan line"
          style={{
            position: "absolute",
            left: -32,
            right: -32,
            top: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${c.purple}, ${c.yellow}, transparent)`,
            boxShadow: `0 0 28px ${c.purple}`,
            opacity: interpolate(frame, [40, 50, 106, 116], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(
              frame,
              [40, 112],
              ["0px -6px", "0px 400px"],
              {
                easing: Easing.bezier(0.33, 0, 0.67, 1),
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              },
            ),
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
