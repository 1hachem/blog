import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { AbsoluteFill } from "remotion";
import { palette, type ThemedProps } from "../../../theme";
import { ActionsScene } from "./scenes/ActionsScene";
import { DiffScene } from "./scenes/DiffScene";
import { FailScene } from "./scenes/FailScene";
import { HunkFailScene } from "./scenes/HunkFailScene";
import { HunkPassScene } from "./scenes/HunkPassScene";
import { RulesScene } from "./scenes/RulesScene";
import { ScoresScene } from "./scenes/ScoresScene";

export const JevGithubWorkflow: React.FC<ThemedProps> = ({ theme }) => {
  const c = palette(theme);

  return (
    <AbsoluteFill style={{ backgroundColor: c.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence name="Diff" durationInFrames={90}>
          <DiffScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Actions" durationInFrames={60}>
          <ActionsScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Rules" durationInFrames={96}>
          <RulesScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Hunk 01" durationInFrames={90}>
          <HunkPassScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Hunk 02" durationInFrames={90}>
          <HunkFailScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Scores" durationInFrames={102}>
          <ScoresScene theme={theme} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 14 })}
        />
        <TransitionSeries.Sequence name="Fail" durationInFrames={78}>
          <FailScene theme={theme} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
