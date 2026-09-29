import { useCurrentFrame, useVideoConfig } from "remotion";
import { palette, type ThemedProps } from "./theme";

export const ProgressBar: React.FC<ThemedProps> = ({ theme }) => {
  const c = palette(theme);
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = durationInFrames > 1 ? frame / (durationInFrames - 1) : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: c.border,
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          backgroundColor: c.text,
        }}
      />
    </div>
  );
};
