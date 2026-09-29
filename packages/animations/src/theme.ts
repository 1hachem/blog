import { loadFont } from "@remotion/google-fonts/JetBrainsMono";

export type Theme = "light" | "dark";

export type Palette = {
  bg: string;
  panel: string;
  border: string;
  text: string;
  muted: string;
  green: string;
  red: string;
  purple: string;
  yellow: string;
};

const palettes: Record<Theme, Palette> = {
  dark: {
    bg: "#0a0a0a",
    panel: "#111111",
    border: "#333333",
    text: "#e8e8e8",
    muted: "#888888",
    green: "#65d995",
    red: "#ff737a",
    purple: "#e551ba",
    yellow: "#f4cc70",
  },
  light: {
    bg: "#faf8f5",
    panel: "#f0ede9",
    border: "#cccccc",
    text: "#222222",
    muted: "#666666",
    green: "#1a7f4b",
    red: "#c1272d",
    purple: "#a3238e",
    yellow: "#8a6d3b",
  },
};

export const palette = (theme: Theme): Palette => palettes[theme];

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export const mono = `${fontFamily}, ui-monospace, SFMono-Regular, monospace`;

export type ThemedProps = { theme: Theme };
