import "./index.css";
import { Composition, Folder } from "remotion";
import { compositions } from "animations/compositions";
import {
  ActionsScene,
  CheckRefsFailScene,
  DiffScene,
  HunkFailScene,
  HunkPassScene,
  JevFailScene,
  ResolvedScene,
  RulesScene,
  RunScene,
  ScoresScene,
  SourceScene,
  TokensScene,
  UnresolvedScene,
} from "animations/scenes";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JevGithubWorkflow"
        {...compositions.JevGithubWorkflow}
        defaultProps={{ theme: "dark" as const }}
      />
      <Composition
        id="CheckRefsWorkflow"
        {...compositions.CheckRefsWorkflow}
        defaultProps={{ theme: "dark" as const }}
      />
      <Folder name="CheckRefs-Scenes">
        <Composition
          id="CheckRefs-Source"
          component={SourceScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={132}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CheckRefs-Tokens"
          component={TokensScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={72}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CheckRefs-Run"
          component={RunScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={58}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CheckRefs-Resolved"
          component={ResolvedScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={78}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CheckRefs-Unresolved"
          component={UnresolvedScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={72}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="CheckRefs-Fail"
          component={CheckRefsFailScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={84}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
      <Folder name="Jev-Scenes">
        <Composition
          id="Jev-Diff"
          component={DiffScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Jev-Actions"
          component={ActionsScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={60}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Jev-Rules"
          component={RulesScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={96}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Jev-Hunk01"
          component={HunkPassScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Jev-Hunk02"
          component={HunkFailScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={90}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Jev-Scores"
          component={ScoresScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={102}
          fps={30}
          width={1920}
          height={1080}
        />
        <Composition
          id="Jev-Fail"
          component={JevFailScene}
          defaultProps={{ theme: "dark" as const }}
          durationInFrames={78}
          fps={30}
          width={1920}
          height={1080}
        />
      </Folder>
    </>
  );
};
