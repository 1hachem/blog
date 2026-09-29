import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill } from "remotion";
import { ProgressBar } from "../../../ProgressBar";
import { palette, type ThemedProps } from "../../../theme";
import { FailScene } from "./scenes/FailScene";
import { ResolvedScene } from "./scenes/ResolvedScene";
import { RunScene } from "./scenes/RunScene";
import { SourceScene } from "./scenes/SourceScene";
import { TokensScene } from "./scenes/TokensScene";
import { UnresolvedScene } from "./scenes/UnresolvedScene";

export const CheckRefsWorkflow: React.FC<ThemedProps> = ({ theme }) => {
  const c = palette(theme);

  return (
    <AbsoluteFill style={{ backgroundColor: c.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Source" durationInFrames={132}>
          <SourceScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Tokens" durationInFrames={72}>
          <TokensScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Run" durationInFrames={58}>
          <RunScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Resolved" durationInFrames={78}>
          <ResolvedScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Unresolved" durationInFrames={72}>
          <UnresolvedScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Fail" durationInFrames={84}>
          <FailScene theme={theme} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
      <ProgressBar theme={theme} />
    </AbsoluteFill>
  );
};
