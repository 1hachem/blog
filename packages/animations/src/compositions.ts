import { CheckRefsWorkflow } from "./agents/checks/check-refs/CheckRefsWorkflow";
import { JevGithubWorkflow } from "./agents/checks/jev-github-workflow/JevGithubWorkflow";
import type { ThemedProps } from "./theme";

export type CompositionId = keyof typeof compositions;

export const compositions = {
  JevGithubWorkflow: {
    component: JevGithubWorkflow,
    durationInFrames: 522,
    fps: 30,
    width: 1920,
    height: 1080,
  },
  CheckRefsWorkflow: {
    component: CheckRefsWorkflow,
    durationInFrames: 426,
    fps: 30,
    width: 1920,
    height: 1080,
  },
} satisfies Record<
  string,
  {
    component: React.FC<ThemedProps>;
    durationInFrames: number;
    fps: number;
    width: number;
    height: number;
  }
>;

export { type Theme, type ThemedProps } from "./theme";
