import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const colors = {
  bg: "#111318",
  panel: "#1a1d24",
  border: "#3c424d",
  text: "#f0f1f4",
  muted: "#9da5b2",
  green: "#65d995",
  red: "#ff737a",
  purple: "#e551ba",
  yellow: "#f4cc70",
};
const mono = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";
const ease = Easing.out(Easing.cubic);

const show = (frame: number, start: number, span = 14) =>
  interpolate(frame, [start, start + span], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

const Panel: React.FC<{
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, children, style }) => (
  <div
    style={{
      border: `1px solid ${colors.border}`,
      borderRadius: 14,
      background: colors.panel,
      padding: 24,
      ...style,
    }}
  >
    <div style={{ color: colors.muted, fontSize: 16, marginBottom: 18 }}>
      {title}
    </div>
    {children}
  </div>
);

const Tag: React.FC<{ children: React.ReactNode; color: string }> = ({
  children,
  color,
}) => (
  <span
    style={{
      color,
      border: `1px solid ${color}66`,
      background: `${color}15`,
      borderRadius: 99,
      padding: "7px 12px",
      fontSize: 15,
    }}
  >
    {children}
  </span>
);

export const CheckRefsWorkflow: React.FC = () => {
  const f = useCurrentFrame();
  const source = show(f, 8);
  const sweep = show(f, 45, 65);
  const extract = show(f, 82);
  const run = show(f, 125);
  const search1 = show(f, 180);
  const search2 = show(f, 222);
  const result = show(f, 285);
  const sweepY = interpolate(f, [45, 110], [0, 196], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const sweepLineOpacity = interpolate(f, [45, 100, 110], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const caption =
    f < 45
      ? "Start with the repository's AGENTS.md."
      : f < 82
        ? "A sweep highlights backticked paths, commands, and identifiers."
        : f < 125
          ? "Extract those tokens and send them to check:refs."
          : f < 180
            ? "The script searches tracked files and source code."
            : f < 285
              ? "A reference passes only when the repository contains it."
              : "Unresolved references fail the check.";
  const tokenStyle = (): React.CSSProperties => ({
    color: sweep > 0.1 ? colors.green : colors.text,
    background: sweep > 0.1 ? `${colors.green}18` : "transparent",
    borderRadius: 4,
    padding: "1px 4px",
    boxShadow: sweep > 0.1 ? `0 0 0 1px ${colors.green}66` : "none",
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.bg,
        color: colors.text,
        padding: "48px 92px",
        fontFamily: mono,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 15,
          color: colors.purple,
          fontSize: 21,
        }}
      >
        <span style={{ fontSize: 29 }}>⌘</span>
        <span>AGENTS.md reference check</span>
      </div>
      <div
        style={{
          height: 40,
          marginTop: 16,
          textAlign: "center",
          color: colors.muted,
          fontSize: 19,
        }}
      >
        {caption}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.08fr 64px 0.92fr",
          alignItems: "stretch",
          gap: 18,
          marginTop: 26,
        }}
      >
        <Panel
          title="REPOSITORY · AGENTS.md"
          style={{ minHeight: 240, opacity: source }}
        >
          <div style={{ color: colors.muted, fontSize: 16, marginBottom: 15 }}>
            apps/blog/AGENTS.md
          </div>
          <div style={{ position: "relative", fontSize: 20, lineHeight: 2.1 }}>
            <div>
              Run <span style={tokenStyle()}>`pnpm check:refs`</span> after
              edits.
            </div>
            <div>
              Follow <span style={tokenStyle()}>`apps/blog/src/content`</span>{" "}
              conventions.
            </div>
            <div>
              Keep <span style={tokenStyle()}>`BlogPost`</span> in the post
              renderer.
            </div>
            <div>
              See <span style={tokenStyle()}>`src/lib/ghost.ts`</span> for
              helpers.
            </div>
            <div
              style={{
                position: "absolute",
                left: -8,
                right: -8,
                top: sweepY,
                height: 2,
                opacity: sweepLineOpacity,
                background: `linear-gradient(90deg,transparent,${colors.purple},${colors.yellow},transparent)`,
                boxShadow: `0 0 15px ${colors.purple}`,
              }}
            />
          </div>
          <div
            style={{
              opacity: sweep,
              color: colors.yellow,
              fontSize: 14,
              marginTop: 8,
            }}
          >
            SCANNING BACKTICKED REFERENCES
          </div>
        </Panel>
        <div
          style={{
            alignSelf: "center",
            textAlign: "center",
            color: colors.purple,
            fontSize: 34,
            opacity: Math.max(extract, run),
          }}
        >
          →
        </div>
        <Panel
          title="TOKENS EXTRACTED"
          style={{ minHeight: 240, opacity: extract }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontSize: 16,
            }}
          >
            {[
              "pnpm check:refs",
              "apps/blog/src/content",
              "BlogPost",
              "src/lib/ghost.ts",
            ].map((token) => (
              <div
                key={token}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <code style={{ color: colors.green }}>{token}</code>
                <Tag color={colors.green}>
                  {token === "pnpm check:refs"
                    ? "command"
                    : token === "BlogPost"
                      ? "class name"
                      : "path"}
                </Tag>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div
        style={{
          opacity: run,
          marginTop: 23,
          padding: "17px 24px",
          border: `1px solid ${colors.purple}66`,
          borderRadius: 14,
          background: `${colors.purple}0d`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <span style={{ color: colors.purple, fontSize: 24 }}>▶</span>
          <span style={{ fontSize: 21 }}>pnpm check:refs</span>
        </div>
        <div style={{ color: colors.muted, fontSize: 16 }}>
          receives extracted references
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
          marginTop: 20,
        }}
      >
        <Panel title="CODEBASE SEARCH · EXISTING" style={{ opacity: search1 }}>
          <div style={{ display: "grid", gap: 13, fontSize: 17 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <code>apps/blog/src/content</code>
              <Tag color={colors.green}>✓ FOUND</Tag>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <code>BlogPost</code>
              <Tag color={colors.green}>✓ FOUND</Tag>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <code>pnpm check:refs</code>
              <Tag color={colors.green}>✓ FOUND</Tag>
            </div>
          </div>
        </Panel>
        <Panel
          title="CODEBASE SEARCH · UNRESOLVED"
          style={{ opacity: search2 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: 17,
              marginTop: 9,
            }}
          >
            <code style={{ color: colors.text }}>src/lib/ghost.ts</code>
            <Tag color={colors.red}>× NO MATCH</Tag>
          </div>
          <div style={{ color: colors.muted, fontSize: 15, marginTop: 22 }}>
            No file or source identifier matches this token.
          </div>
        </Panel>
      </div>

      <div
        style={{
          opacity: result,
          marginTop: 19,
          padding: "15px 22px",
          border: `1px solid ${colors.red}77`,
          background: `${colors.red}0d`,
          borderRadius: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ color: colors.red, fontSize: 19 }}>
            check:refs · FAILED
          </div>
          <div style={{ color: colors.muted, fontSize: 14, marginTop: 5 }}>
            One missing reference fails the command and CI.
          </div>
        </div>
        <Tag color={colors.red}>3 valid · 1 unresolved</Tag>
      </div>
    </AbsoluteFill>
  );
};
