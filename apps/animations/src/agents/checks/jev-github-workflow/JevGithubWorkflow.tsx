import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  useCurrentFrame,
} from "remotion";

const c = {
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

const GitHubMark: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-label="GitHub"
  >
    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.32-3.76-1.32-.5-1.3-1.24-1.65-1.24-1.65-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.75 2.1 3.8 1.5.1-.72.39-1.21.7-1.49-2.47-.28-5.07-1.24-5.07-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.28-2.6 5.23-5.08 5.5.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.76.54A11.1 11.1 0 0 0 12 .9Z" />
  </svg>
);

const JevMark: React.FC<{ size?: number }> = ({ size = 42 }) => (
  <Img
    src="https://cdn.d4shi.com/logos/typesafe.png"
    alt="TypeSafe AI logo"
    style={{ width: size, height: size, objectFit: "contain" }}
  />
);

const Tag: React.FC<{ children: React.ReactNode; color: string }> = ({
  children,
  color,
}) => (
  <span
    style={{
      color,
      background: `${color}17`,
      border: `1px solid ${color}55`,
      borderRadius: 99,
      padding: "7px 12px",
      fontSize: 15,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </span>
);

const Caption: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      height: 39,
      marginTop: 18,
      color: c.muted,
      fontSize: 19,
      textAlign: "center",
      opacity: 0.95,
    }}
  >
    {text}
  </div>
);

const ScoreRow: React.FC<{ label: string; score: number; start: number }> = ({
  label,
  score,
  start,
}) => {
  const frame = useCurrentFrame();
  const color = score > 0.85 ? c.red : c.purple;
  const progress = interpolate(frame, [start, start + 12], [0, score * 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "138px 1fr 44px",
        alignItems: "center",
        gap: 11,
        opacity: show(frame, start, 8),
        fontSize: 13,
        marginTop: 6,
      }}
    >
      <span style={{ color: c.muted }}>{label}</span>
      <span
        style={{
          height: 7,
          overflow: "hidden",
          borderRadius: 10,
          background: `${c.border}88`,
        }}
      >
        <span
          style={{
            display: "block",
            width: `${progress}%`,
            height: "100%",
            background: color,
            borderRadius: 10,
          }}
        />
      </span>
      <span
        style={{
          color,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {score.toFixed(2)}
      </span>
    </div>
  );
};

export const JevGithubWorkflow: React.FC = () => {
  const f = useCurrentFrame();
  const caption =
    f < 60
      ? "A pull request changes AGENTS.md…"
      : f < 120
        ? "GitHub Actions detects the file change and starts the check."
        : f < 220
          ? "Jev reads the rules for a compliant AGENTS.md entry."
          : f < 270
            ? "Jev checks the first hunk against a short request."
            : f < 320
              ? "Jev checks the second hunk against a short request."
              : f < 380
                ? "Scores over 0.85 fail the hunk."
                : "One failing hunk makes the CI check fail.";
  const diff = show(f, 12);
  const workflow = show(f, 62);
  const prompt = show(f, 124);
  const rules = [show(f, 132), show(f, 150), show(f, 168), show(f, 186)];
  const requests = show(f, 220);
  const pass = show(f, 260);
  const fail = show(f, 312);
  const result = show(f, 374);
  const load1 = f >= 230 && f < 258;
  const load2 = f >= 282 && f < 310;
  const spin = f * 12;
  return (
    <AbsoluteFill
      style={{
        background: c.bg,
        color: c.text,
        padding: "48px 92px",
        fontFamily: mono,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          color: c.purple,
          fontSize: 20,
        }}
      >
        <GitHubMark size={30} />
        <span>AGENTS.md pull request check</span>
      </div>
      <Caption text={caption} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 1fr",
          alignItems: "center",
          gap: 24,
          marginTop: 24,
        }}
      >
        <div
          style={{
            opacity: diff,
            minHeight: 220,
            padding: 24,
            border: `1px solid ${c.border}`,
            borderRadius: 14,
            background: c.panel,
          }}
        >
          <div style={{ color: c.muted, fontSize: 16, marginBottom: 14 }}>
            PULL REQUEST DIFF
          </div>
          <div style={{ color: c.muted, fontSize: 16, marginBottom: 16 }}>
            packages/interpreter/AGENTS.md
          </div>
          <div style={{ color: c.green, fontSize: 18, lineHeight: 1.7 }}>
            + run `pnpm check:seams`
            <br />+ before touching `makeReader()`
          </div>
          <div
            style={{ borderTop: `1px dashed ${c.border}`, margin: "13px 0" }}
          />
          <div style={{ color: c.green, fontSize: 18, lineHeight: 1.7 }}>
            + the reader walks the tokens
            <br />+ and returns a form for each
          </div>
        </div>
        <div
          style={{
            opacity: workflow,
            textAlign: "center",
            color: c.purple,
            fontSize: 44,
          }}
        >
          →
        </div>
        <div
          style={{
            opacity: workflow,
            minHeight: 220,
            padding: 24,
            border: `1px solid ${c.border}`,
            borderRadius: 14,
            background: c.panel,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 18,
          }}
        >
          <GitHubMark size={54} />
          <div style={{ fontSize: 23 }}>GitHub Actions</div>
          <Tag color={c.yellow}>check:agents started</Tag>
          <div style={{ color: c.muted, fontSize: 15 }}>
            Changed AGENTS.md hunks collected
          </div>
        </div>
      </div>

      <div
        style={{
          opacity: prompt,
          marginTop: 23,
          padding: "18px 28px",
          border: `1px solid ${c.purple}77`,
          background: `${c.purple}0c`,
          borderRadius: 14,
          display: "grid",
          gridTemplateColumns: "56px 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div style={{ color: c.purple }}>
          <JevMark size={48} />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <span style={{ color: c.purple, fontSize: 20 }}>
              JEV CLASSIFICATION INSTRUCTIONS
            </span>
            <Tag color={c.purple}>one changed hunk at a time</Tag>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px 26px",
              fontSize: 17,
              lineHeight: 1.4,
            }}
          >
            <div style={{ opacity: rules[0] }}>
              <span style={{ color: c.green }}>✓</span> Keep useful pointers.
            </div>
            <div style={{ opacity: rules[1] }}>
              <span style={{ color: c.red }}>×</span> Reject implementation
              details.
            </div>
            <div style={{ opacity: rules[2] }}>
              <span style={{ color: c.muted }}>→</span> Judge only the added
              hunk.
            </div>
            <div style={{ opacity: rules[3] }}>
              <span style={{ color: c.muted }}>→</span> Return pass or fail.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          opacity: requests,
          textAlign: "center",
          color: c.muted,
          fontSize: 15,
          margin: "15px 0 12px",
        }}
      >
        CLASSIFICATION REQUESTS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div
          style={{
            opacity: requests,
            border: `1px solid ${pass > 0.1 ? c.green : c.border}`,
            borderRadius: 14,
            background: pass > 0.1 ? `${c.green}12` : c.panel,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 11,
            }}
          >
            <span style={{ color: c.muted, fontSize: 15 }}>
              HUNK 01 · JEV REQUEST
            </span>
            {pass > 0.1 ? (
              <Tag color={c.green}>✓ COMPLIANT</Tag>
            ) : load1 ? (
              <span style={{ color: c.yellow, fontSize: 14 }}>CHECKING…</span>
            ) : null}
          </div>
          <div
            style={{
              color: c.text,
              fontSize: 17,
              lineHeight: 1.5,
              minHeight: 51,
            }}
          >
            “Is this a useful pointer?”
          </div>
          {load1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: c.yellow,
                fontSize: 14,
                marginTop: 12,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  border: `2px solid ${c.yellow}55`,
                  borderTopColor: c.yellow,
                  borderRadius: "50%",
                  transform: `rotate(${spin}deg)`,
                }}
              />
              Jev is classifying this hunk…
            </div>
          )}
          {pass > 0.1 && (
            <div
              style={{
                color: c.green,
                fontSize: 16,
                marginTop: 10,
                lineHeight: 1.5,
              }}
            >
              + run `pnpm check:seams`
              <br />+ before touching `makeReader()`
            </div>
          )}
          {pass > 0.1 && (
            <div
              style={{
                borderTop: `1px solid ${c.border}`,
                marginTop: 12,
                paddingTop: 9,
              }}
            >
              <div style={{ color: c.muted, fontSize: 12, marginBottom: 7 }}>
                EXAMPLE JEV SCORES · ALL BELOW 0.85
              </div>
              <ScoreRow label="implementation" score={0.12} start={264} />
              <ScoreRow label="mechanism" score={0.08} start={274} />
              <ScoreRow label="identifiers" score={0.31} start={284} />
            </div>
          )}
        </div>
        <div
          style={{
            opacity: requests,
            border: `1px solid ${fail > 0.1 ? c.red : c.border}`,
            borderRadius: 14,
            background: fail > 0.1 ? `${c.red}12` : c.panel,
            padding: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 11,
            }}
          >
            <span style={{ color: c.muted, fontSize: 15 }}>
              HUNK 02 · JEV REQUEST
            </span>
            {fail > 0.1 ? (
              <Tag color={c.red}>× NONCOMPLIANT</Tag>
            ) : load2 ? (
              <span style={{ color: c.yellow, fontSize: 14 }}>CHECKING…</span>
            ) : null}
          </div>
          <div
            style={{
              color: c.text,
              fontSize: 17,
              lineHeight: 1.5,
              minHeight: 51,
            }}
          >
            “Does this explain how code works?”
          </div>
          {load2 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                color: c.yellow,
                fontSize: 14,
                marginTop: 12,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  border: `2px solid ${c.yellow}55`,
                  borderTopColor: c.yellow,
                  borderRadius: "50%",
                  transform: `rotate(${spin}deg)`,
                }}
              />
              Jev is classifying this hunk…
            </div>
          )}
          {fail > 0.1 && (
            <div
              style={{
                color: c.red,
                fontSize: 16,
                marginTop: 10,
                lineHeight: 1.5,
              }}
            >
              + the reader walks the tokens
              <br />+ and returns a form for each
            </div>
          )}
          {fail > 0.1 && (
            <div
              style={{
                borderTop: `1px solid ${c.border}`,
                marginTop: 12,
                paddingTop: 9,
              }}
            >
              <div style={{ color: c.muted, fontSize: 12, marginBottom: 7 }}>
                EXAMPLE JEV SCORES · FAIL ABOVE 0.85
              </div>
              <ScoreRow label="implementation" score={0.92} start={314} />
              <ScoreRow label="mechanism" score={0.88} start={324} />
              <ScoreRow label="identifiers" score={0.31} start={334} />
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          opacity: result,
          marginTop: 17,
          padding: "14px 21px",
          border: `1px solid ${c.red}70`,
          borderRadius: 12,
          background: `${c.red}0c`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <GitHubMark size={30} />
          <div>
            <div style={{ color: c.red, fontSize: 18 }}>
              check:agents · FAILED
            </div>
            <div style={{ color: c.muted, fontSize: 14 }}>
              The noncompliant hunk fails the pull request check.
            </div>
          </div>
        </div>
        <Tag color={c.red}>1 passed · 1 failed</Tag>
      </div>
    </AbsoluteFill>
  );
};
