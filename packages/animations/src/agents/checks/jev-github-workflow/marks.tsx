import { Img } from "remotion";
// Imported rather than staticFile()-d: staticFile() resolves against the host
// site's public directory, which for the blog's <Player> is not this package.
// Remotion's bundler resolves the import to a URL string, Astro's astro:assets
// resolves it to an ImageMetadata object, so accept either.
import typesafeLogo from "./typesafe.png";

const logo = typesafeLogo as unknown as string | { src: string };
const typesafeLogoSrc = typeof logo === "string" ? logo : logo.src;

export const GitHubMark: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="GitHub"
    // a flex row shrinks an svg without an explicit basis, clipping its right edge
    style={{ flexShrink: 0, display: "block", overflow: "visible" }}
  >
    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.75 2.1 3.8 1.5.1-.72.39-1.21.7-1.49-2.47-.28-5.07-1.24-5.07-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.28-2.6 5.23-5.08 5.5.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.76.54A11.1 11.1 0 0 0 12 .9Z" />
  </svg>
);

export const JevMark: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <Img
    name="TypeSafe logo"
    src={typesafeLogoSrc}
    alt="TypeSafe AI logo"
    style={{
      width: size,
      height: size,
      objectFit: "contain",
      flexShrink: 0,
      borderRadius: 14,
    }}
  />
);
