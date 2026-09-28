import "./index.css";
import { Composition } from "remotion";
import { JevGithubWorkflow } from "./agents/checks/jev-github-workflow/JevGithubWorkflow";
import { CheckRefsWorkflow } from "./agents/checks/check-refs/CheckRefsWorkflow";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JevGithubWorkflow"
        component={JevGithubWorkflow}
        durationInFrames={390}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CheckRefsWorkflow"
        component={CheckRefsWorkflow}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
