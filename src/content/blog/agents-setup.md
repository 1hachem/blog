---
title: 'How I gave up writing code without losing the codebase'
description: 'no handwritten code, agents write all of it, here is the harness that keeps it from rotting: no comments, no dev docs, AGENTS.md files as routers, and ci scripts that fail on anything that drifts.'
pubDate: 2026-09-27
category: 'tech'
tags: ['agents', 'dev']
tldr: 'agents are forbidden from writing docs and comments, scripts run in ci checking that dependency flow is respected, jit docs with artifacts, vibe feature -> test feature -> like feature -> write tests -> refactor but keep tests working'
draft: true
---

since absolutely nobody asked me how I use my agent for coding tasks, here I am writing a blog in detail about it.

lately while developing lisptc - a neuro-symbolic language harness - I decided to fully build it with AI agents, no handwritten code, however that doesn't mean that I am going to follow the vibe-coded app path where I let agents do whatever they want,
it's going to be I design, you code.

giving up code completely to agents meant that I have to make sure to set up the right harness and develop the right tools that would keep things under control, I don't want to end up 2 months down the line with a mess that no one can debug, not even the agents that built it.

the thing is that one bad practice in your code is the context for the next agent, which is going to follow the same bad practice +1, this is the failure mode that most vibe coded codebases usually fall into, thinking that agents are immune to technical debt, nothing is immune to technical debt.

## forbid comments and dev docs, they are obsolete

code is the only source of truth, this means less context for the agent to read, if the agent needs certain details about the implementation it has to read the code.

agents instead of actually adding the functionality would stick a comment on top pretending that it already works, misguiding any other agent that actually reads the context.

comments are made for humans since they can't hold enough in working memory, agents don't need comments

how I enforce this in the codebase:

- check comments script that strips all comments and fails ci in case there was an added comment

- rule in AGENTS.md that forbids comments

- a whole codebase with no comments, agents tend to follow the convention of the code they read

## no implementation details in `AGENTS.md`

this one is a bit tricky to enforce since llms love wasting tokens rambling about implementation details, I never read the docs the agent writes, instead I ask an agent to go and produce an interactive artifact about how something works, data flow, dependency, pros, cons and tradeoffs

dev docs now become just in time, from the code directly and scoped to exactly what you need to know, in five minutes you have it, this is superior big time to having to maintain separate docs that keep growing, drifting and misguiding your agents.

so what is left in these files is a map, `AGENTS.md` files become routers, every workspace carries its own, `packages/interpreter/AGENTS.md`, `packages/backend/AGENTS.md`, `apps/cli/AGENTS.md`, and it holds the shape of that package and nothing more, where each thing is found and where a new one belongs, the agent lands on the root file, finds the one workspace it needs and goes straight there instead of grepping a monorepo of 20 packages.

<svg class="agents-diagram" viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="The root AGENTS.md holds the repo-wide rules, and every package carries an AGENTS.md of its own listing what is inside that package and where to find it">
  <style>
    svg.agents-diagram { color: var(--fg); }
    svg.agents-diagram .s{ stroke:currentColor; stroke-width:1.6; }
    svg.agents-diagram .box{ stroke:currentColor; stroke-width:1.6; fill:none; }
    svg.agents-diagram .dash{ stroke:currentColor; stroke-width:1.2; fill:none; stroke-dasharray:4 4; opacity:.55; }
    svg.agents-diagram .t{ fill:currentColor; font-family:'JetBrains Mono','JetBrainsMono Nerd Font',ui-monospace,'Cascadia Code','Source Code Pro',Menlo,Consolas,'DejaVu Sans Mono',monospace; }
    svg.agents-diagram .lbl{ font-size:13px; }
    svg.agents-diagram .ttl{ font-size:15px; font-weight:600; }
    svg.agents-diagram .cap{ font-size:12px; opacity:.72; }
    svg.agents-diagram .mono{ font-size:12px; }
    svg.agents-diagram .sm{ font-size:11px; }
    svg.agents-diagram .dim{ opacity:.55; }
  </style>
  <defs>
    <marker id="ah-agents" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="currentColor"/>
    </marker>
  </defs>
  <rect class="box" x="40" y="63" width="84" height="44" rx="7"/>
  <text x="82" y="90" text-anchor="middle" class="t lbl">agent</text>
  <line class="s" x1="124" y1="85" x2="226" y2="85" marker-end="url(#ah-agents)"/>
  <text x="175" y="77" text-anchor="middle" class="t cap">starts here</text>
  <rect class="box" x="230" y="24" width="300" height="122" rx="7"/>
  <text x="246" y="48" class="t ttl">AGENTS.md</text>
  <text x="246" y="66" class="t cap dim">the rules, repo wide</text>
  <line class="dash" x1="246" y1="78" x2="514" y2="78"/>
  <text x="246" y="98" class="t mono">dependency flow</text>
  <text x="246" y="116" class="t mono">host ports</text>
  <text x="246" y="134" class="t mono">no comments</text>
  <text x="390" y="98" class="t mono">typed env access</text>
  <text x="390" y="116" class="t mono">no new md files</text>
  <text x="390" y="134" class="t mono">where tests live</text>
  <line class="s" x1="380" y1="146" x2="380" y2="164"/>
  <line class="s" x1="138" y1="164" x2="622" y2="164"/>
  <line class="s" x1="138" y1="164" x2="138" y2="176" marker-end="url(#ah-agents)"/>
  <line class="s" x1="380" y1="164" x2="380" y2="176" marker-end="url(#ah-agents)"/>
  <line class="s" x1="622" y1="164" x2="622" y2="176" marker-end="url(#ah-agents)"/>
  <rect class="dash" x="28" y="180" width="220" height="160" rx="8"/>
  <text x="42" y="200" class="t cap dim">packages/interpreter</text>
  <rect class="box" x="42" y="208" width="192" height="40" rx="6"/>
  <text x="138" y="233" text-anchor="middle" class="t lbl">AGENTS.md</text>
  <line class="dash" x1="58" y1="248" x2="58" y2="316"/>
  <line class="dash" x1="58" y1="272" x2="72" y2="272"/>
  <text x="78" y="276" class="t sm dim">src/reader/</text>
  <line class="dash" x1="58" y1="294" x2="72" y2="294"/>
  <text x="78" y="298" class="t sm dim">src/eval/</text>
  <line class="dash" x1="58" y1="316" x2="72" y2="316"/>
  <text x="78" y="320" class="t sm dim">src/seam/</text>
  <rect class="dash" x="270" y="180" width="220" height="160" rx="8"/>
  <text x="284" y="200" class="t cap dim">packages/backend</text>
  <rect class="box" x="284" y="208" width="192" height="40" rx="6"/>
  <text x="380" y="233" text-anchor="middle" class="t lbl">AGENTS.md</text>
  <line class="dash" x1="300" y1="248" x2="300" y2="316"/>
  <line class="dash" x1="300" y1="272" x2="314" y2="272"/>
  <text x="320" y="276" class="t sm dim">convex/</text>
  <line class="dash" x1="300" y1="294" x2="314" y2="294"/>
  <text x="320" y="298" class="t sm dim">src/stores/</text>
  <line class="dash" x1="300" y1="316" x2="314" y2="316"/>
  <text x="320" y="320" class="t sm dim">src/agent-repl/</text>
  <rect class="dash" x="512" y="180" width="220" height="160" rx="8"/>
  <text x="526" y="200" class="t cap dim">apps/cli</text>
  <rect class="box" x="526" y="208" width="192" height="40" rx="6"/>
  <text x="622" y="233" text-anchor="middle" class="t lbl">AGENTS.md</text>
  <line class="dash" x1="542" y1="248" x2="542" y2="316"/>
  <line class="dash" x1="542" y1="272" x2="556" y2="272"/>
  <text x="562" y="276" class="t sm dim">src/repl/</text>
  <line class="dash" x1="542" y1="294" x2="556" y2="294"/>
  <text x="562" y="298" class="t sm dim">src/render/</text>
  <line class="dash" x1="542" y1="316" x2="556" y2="316"/>
  <text x="562" y="320" class="t sm dim">test/</text>
  <text x="380" y="366" text-anchor="middle" class="t cap">the root holds the rules, each package's AGENTS.md holds its own map</text>
  <text x="380" y="384" text-anchor="middle" class="t cap">what is inside the package, and where to find it</text>
</svg>

the root file holds only what is true repo wide, the rules that no single package owns, in lisptc these are:

- the dependency flow, `interpreter -> extensions -> repl front-ends -> agent -> apps`, declared as turbo tags rather than described
- everything an extension does that reaches outside the process, the filesystem, the network, the clock, a subprocess, goes through a port it declares itself, no importing `node:fs` "just for this one path"
- nothing above an extension names it, behaviour crosses the seam through a chain, a capability through a slot, data through an annotation, never through an import
- the code carries no comments
- never read the environment directly, every variable is declared in `packages/env` and read typed
- every icon comes from hugeicons, adding `lucide-react` fails the arch check
- tests live in each package's `test/`, and a test belongs to the package that owns what it asserts

every one of these is a rule an agent can break in a single line and a script can catch in ci, that is the bar for putting it in the root file, a rule that belongs to one package goes in that package's file instead, the convex deployment's environment is `packages/backend/AGENTS.md` business, not the workspace's.

in ci I make sure that any change to `AGENTS.md` is only a pointer toward what is there, not how it works and implementation details, by running jev classification on each hunk of change.

another script goes through all the `AGENTS.md` files in the repo and checks that any file path, class name, or function name actually exists in the repo and that it didn't get renamed or removed, in case of failure the agent is instructed to fix the file.

<svg class="checks-diagram" viewBox="0 0 760 470" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="check:agents sends every changed paragraph to a classifier and fails the ones that explain how the code works, check:refs resolves every backticked name against the repo and fails the ones that no longer exist">
  <style>
    svg.checks-diagram { color: var(--fg); }
    svg.checks-diagram .s{ stroke:currentColor; stroke-width:1.6; }
    svg.checks-diagram .box{ stroke:currentColor; stroke-width:1.6; fill:none; }
    svg.checks-diagram .dash{ stroke:currentColor; stroke-width:1.2; fill:none; stroke-dasharray:4 4; opacity:.55; }
    svg.checks-diagram .t{ fill:currentColor; font-family:'JetBrains Mono','JetBrainsMono Nerd Font',ui-monospace,'Cascadia Code','Source Code Pro',Menlo,Consolas,'DejaVu Sans Mono',monospace; }
    svg.checks-diagram .lbl{ font-size:13px; }
    svg.checks-diagram .ttl{ font-size:14px; font-weight:600; }
    svg.checks-diagram .cap{ font-size:12px; opacity:.72; }
    svg.checks-diagram .mono{ font-size:12px; }
    svg.checks-diagram .sm{ font-size:11px; }
    svg.checks-diagram .dim{ opacity:.55; }
  </style>
  <defs>
    <marker id="ah-checks" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="currentColor"/>
    </marker>
  </defs>
  <line class="dash" x1="380" y1="16" x2="380" y2="420"/>
  <text x="190" y="30" text-anchor="middle" class="t ttl">pnpm check:agents</text>
  <text x="190" y="50" text-anchor="middle" class="t cap dim">judges the prose a PR adds</text>
  <text x="570" y="30" text-anchor="middle" class="t ttl">pnpm check:refs</text>
  <text x="570" y="50" text-anchor="middle" class="t cap dim">resolves every name it mentions</text>
  <rect class="box" x="24" y="68" width="332" height="76" rx="7"/>
  <text x="38" y="90" class="t sm dim">packages/interpreter/AGENTS.md</text>
  <text x="38" y="114" class="t mono">+ the reader walks the tokens</text>
  <text x="38" y="132" class="t mono">+ and returns a form for each</text>
  <line class="s" x1="190" y1="144" x2="190" y2="172" marker-end="url(#ah-checks)"/>
  <rect class="box" x="24" y="176" width="332" height="128" rx="7"/>
  <text x="38" y="198" class="t mono">~typesafe/jev-latest</text>
  <line class="dash" x1="38" y1="210" x2="342" y2="210"/>
  <text x="38" y="232" class="t mono">implementation</text>
  <text x="342" y="232" text-anchor="end" class="t mono">0.92</text>
  <text x="38" y="254" class="t mono">mechanism</text>
  <text x="342" y="254" text-anchor="end" class="t mono">0.88</text>
  <text x="38" y="276" class="t mono">identifiers</text>
  <text x="342" y="276" text-anchor="end" class="t mono">0.31</text>
  <text x="38" y="296" class="t sm dim">kind=mechanism</text>
  <line class="s" x1="190" y1="304" x2="190" y2="332" marker-end="url(#ah-checks)"/>
  <text x="206" y="322" class="t cap dim">over 0.85, it fails</text>
  <rect class="box" x="24" y="336" width="332" height="74" rx="7"/>
  <text x="38" y="362" class="t mono">FAIL  interpreter/AGENTS.md:31</text>
  <text x="38" y="386" class="t sm dim">it says what the code does while it runs</text>
  <rect class="box" x="404" y="68" width="332" height="76" rx="7"/>
  <text x="418" y="90" class="t sm dim">apps/cli/AGENTS.md</text>
  <text x="418" y="114" class="t mono">+ run `pnpm check:seams`</text>
  <text x="418" y="132" class="t mono">+ before touching `makeReader()`</text>
  <line class="s" x1="570" y1="144" x2="570" y2="172" marker-end="url(#ah-checks)"/>
  <rect class="box" x="404" y="176" width="332" height="128" rx="7"/>
  <text x="418" y="198" class="t mono">every backticked token</text>
  <line class="dash" x1="418" y1="210" x2="722" y2="210"/>
  <text x="418" y="232" class="t mono">path</text>
  <text x="722" y="232" text-anchor="end" class="t sm dim">the tracked file list</text>
  <text x="418" y="254" class="t mono">command</text>
  <text x="722" y="254" text-anchor="end" class="t sm dim">package.json, Taskfile.yml</text>
  <text x="418" y="276" class="t mono">identifier</text>
  <text x="722" y="276" text-anchor="end" class="t sm dim">git grep in the source</text>
  <text x="418" y="296" class="t sm dim">prose without backticks is not a reference</text>
  <line class="s" x1="570" y1="304" x2="570" y2="332" marker-end="url(#ah-checks)"/>
  <text x="586" y="322" class="t cap dim">nothing matched</text>
  <rect class="box" x="404" y="336" width="332" height="74" rx="7"/>
  <text x="418" y="362" class="t mono">DEAD  check:seams</text>
  <text x="722" y="362" text-anchor="end" class="t sm dim">no script declares it</text>
  <text x="418" y="386" class="t mono">DEAD  makeReader()</text>
  <text x="722" y="386" text-anchor="end" class="t sm dim">no source file names it</text>
  <text x="380" y="442" text-anchor="middle" class="t cap">one keeps the prose to rules and pointers, the other keeps the pointers alive</text>
  <text x="380" y="460" text-anchor="middle" class="t cap">both run on the hunks a PR adds, and sweep every AGENTS.md with --all</text>
</svg>

## boundaries and dependencies

for lisptc I set up a monorepo with turborepo, you have `apps/` and `packages/`, a feature that I discovered lately on turbo is called `boundaries`

which allows you to define rules of how your apps and packages can depend on one another, this means you can set up groups, deny and allow dependencies between these groups.

in lisptc every workspace carries a tag in its own `turbo.json`, `foundation`, `ui`, `language`, `extension`, `runtime`, `backend`, `product`, and the root `turbo.json` says which tag is not allowed to depend on which, the whole graph then has to point one way, down:

<svg class="layers-diagram" viewBox="0 0 760 486" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="Every lisptc workspace on the layer its turbo tag puts it in, with an arrow from each package to what it depends on, all of them pointing down">
  <style>
    svg.layers-diagram { color: var(--fg); }
    svg.layers-diagram .s{ stroke:currentColor; }
    svg.layers-diagram .box{ stroke:currentColor; stroke-width:1.2; fill:var(--bg); }
    svg.layers-diagram .rule{ stroke:currentColor; stroke-width:1; opacity:.25; }
    svg.layers-diagram .edge{ stroke:currentColor; stroke-width:1; fill:none; opacity:.13; transition:opacity .15s, stroke-width .15s; }
    svg.layers-diagram:has(.n:hover) .edge{ opacity:.06; }
    svg.layers-diagram .n rect{ transition:stroke-width .15s; }
    svg.layers-diagram .n:hover rect{ stroke-width:2.2; }
    @media (hover: none) { svg.layers-diagram .edge{ opacity:.24; } }
    svg.layers-diagram:has(.n-lisptc-cli:hover) .e-lisptc-cli{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-lisptc-dashi-code:hover) .e-lisptc-dashi-code{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-lisptc-lsp:hover) .e-lisptc-lsp{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-lisptc-mcp-repl:hover) .e-lisptc-mcp-repl{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-lisptc-mcp-toolkit:hover) .e-lisptc-mcp-toolkit{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-lisptc-trace-viewer:hover) .e-lisptc-trace-viewer{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-ai:hover) .e-repo-ai{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-backend:hover) .e-repo-backend{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-bloub:hover) .e-repo-bloub{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-checks:hover) .e-repo-checks{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-compaction-extension:hover) .e-repo-compaction-extension{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-components:hover) .e-repo-components{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-env:hover) .e-repo-env{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-evals:hover) .e-repo-evals{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-interpreter:hover) .e-repo-interpreter{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-llm-extension:hover) .e-repo-llm-extension{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-mcp-extension:hover) .e-repo-mcp-extension{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-memory-extension:hover) .e-repo-memory-extension{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-promises-extension:hover) .e-repo-promises-extension{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-prose-extension:hover) .e-repo-prose-extension{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-repl:hover) .e-repo-repl{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-secrets-extension:hover) .e-repo-secrets-extension{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-shared:hover) .e-repo-shared{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-syntax:hover) .e-repo-syntax{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-tsconfigs:hover) .e-repo-tsconfigs{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-ui:hover) .e-repo-ui{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-repo-ui-extension:hover) .e-repo-ui-extension{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-api:hover) .e-api{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram:has(.n-app:hover) .e-app{ opacity:.95; stroke-width:1.8; }
    svg.layers-diagram .t{ fill:currentColor; font-family:'JetBrains Mono','JetBrainsMono Nerd Font',ui-monospace,'Cascadia Code','Source Code Pro',Menlo,Consolas,'DejaVu Sans Mono',monospace; }
    svg.layers-diagram .tag{ font-size:11px; opacity:.72; }
    svg.layers-diagram .pkg{ font-size:9.5px; }
    svg.layers-diagram .cap{ font-size:12px; opacity:.72; }
  </style>
  <defs>
    <marker id="ah-layers" viewBox="0 0 6 6" refX="6" refY="3" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M0 0L6 3L0 6z" fill="currentColor"/>
    </marker>
  </defs>
  <text x="104" y="409" text-anchor="end" class="t tag">foundation</text>
  <line class="rule" x1="116" y1="420" x2="750" y2="420"/>
  <text x="104" y="347" text-anchor="end" class="t tag">ui</text>
  <line class="rule" x1="116" y1="358" x2="750" y2="358"/>
  <text x="104" y="285" text-anchor="end" class="t tag">language</text>
  <line class="rule" x1="116" y1="296" x2="750" y2="296"/>
  <text x="104" y="223" text-anchor="end" class="t tag">extension</text>
  <line class="rule" x1="116" y1="234" x2="750" y2="234"/>
  <text x="104" y="161" text-anchor="end" class="t tag">runtime</text>
  <line class="rule" x1="116" y1="172" x2="750" y2="172"/>
  <text x="104" y="99" text-anchor="end" class="t tag">backend</text>
  <line class="rule" x1="116" y1="110" x2="750" y2="110"/>
  <text x="104" y="37" text-anchor="end" class="t tag">product</text>
  <line class="rule" x1="116" y1="48" x2="750" y2="48"/>
  <path class="edge e-api e-repo-ai" d="M713.9,44 C713.9,90.0 337.0,90.0 337.0,136" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-backend" d="M713.9,44 C713.9,59.0 433.0,59.0 433.0,74" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-compaction-extension" d="M713.9,44 C713.9,121.0 575.7,121.0 575.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-env" d="M713.9,44 C713.9,214.0 337.0,214.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-interpreter" d="M713.9,44 C713.9,152.0 433.0,152.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-llm-extension" d="M713.9,44 C713.9,121.0 290.3,121.0 290.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-mcp-extension" d="M713.9,44 C713.9,121.0 361.7,121.0 361.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-memory-extension" d="M713.9,44 C713.9,121.0 433.0,121.0 433.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-promises-extension" d="M713.9,44 C713.9,121.0 647.0,121.0 647.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-prose-extension" d="M713.9,44 C713.9,121.0 718.3,121.0 718.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-secrets-extension" d="M713.9,44 C713.9,121.0 504.3,121.0 504.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-shared" d="M713.9,44 C713.9,214.0 433.0,214.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-tsconfigs" d="M713.9,44 C713.9,214.0 529.0,214.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-api e-repo-ui-extension" d="M713.9,44 C713.9,121.0 219.0,121.0 219.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-app e-repo-backend" d="M553.4,44 C553.4,59.0 433.0,59.0 433.0,74" marker-end="url(#ah-layers)"/>
  <path class="edge e-app e-repo-bloub" d="M553.4,44 C553.4,183.0 289.0,183.0 289.0,322" marker-end="url(#ah-layers)"/>
  <path class="edge e-app e-repo-components" d="M553.4,44 C553.4,183.0 385.0,183.0 385.0,322" marker-end="url(#ah-layers)"/>
  <path class="edge e-app e-repo-env" d="M553.4,44 C553.4,214.0 337.0,214.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-app e-repo-syntax" d="M553.4,44 C553.4,183.0 481.0,183.0 481.0,322" marker-end="url(#ah-layers)"/>
  <path class="edge e-app e-repo-tsconfigs" d="M553.4,44 C553.4,214.0 529.0,214.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-app e-repo-ui" d="M553.4,44 C553.4,183.0 577.0,183.0 577.0,322" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-compaction-extension" d="M473.1,44 C473.1,121.0 575.7,121.0 575.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-env" d="M473.1,44 C473.1,214.0 337.0,214.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-interpreter" d="M473.1,44 C473.1,152.0 433.0,152.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-llm-extension" d="M473.1,44 C473.1,121.0 290.3,121.0 290.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-mcp-extension" d="M473.1,44 C473.1,121.0 361.7,121.0 361.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-memory-extension" d="M473.1,44 C473.1,121.0 433.0,121.0 433.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-promises-extension" d="M473.1,44 C473.1,121.0 647.0,121.0 647.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-prose-extension" d="M473.1,44 C473.1,121.0 718.3,121.0 718.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-repl" d="M473.1,44 C473.1,90.0 529.0,90.0 529.0,136" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-secrets-extension" d="M473.1,44 C473.1,121.0 504.3,121.0 504.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-shared" d="M473.1,44 C473.1,214.0 433.0,214.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-cli e-repo-tsconfigs" d="M473.1,44 C473.1,214.0 529.0,214.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-dashi-code e-repo-env" d="M152.1,44 C152.1,214.0 337.0,214.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-dashi-code e-repo-tsconfigs" d="M152.1,44 C152.1,214.0 529.0,214.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-dashi-code e-repo-ui" d="M152.1,44 C152.1,183.0 577.0,183.0 577.0,322" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-compaction-extension" d="M392.9,44 C392.9,121.0 575.7,121.0 575.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-interpreter" d="M392.9,44 C392.9,152.0 433.0,152.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-llm-extension" d="M392.9,44 C392.9,121.0 290.3,121.0 290.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-mcp-extension" d="M392.9,44 C392.9,121.0 361.7,121.0 361.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-memory-extension" d="M392.9,44 C392.9,121.0 433.0,121.0 433.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-promises-extension" d="M392.9,44 C392.9,121.0 647.0,121.0 647.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-prose-extension" d="M392.9,44 C392.9,121.0 718.3,121.0 718.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-repl" d="M392.9,44 C392.9,90.0 529.0,90.0 529.0,136" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-secrets-extension" d="M392.9,44 C392.9,121.0 504.3,121.0 504.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-shared" d="M392.9,44 C392.9,214.0 433.0,214.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-lsp e-repo-tsconfigs" d="M392.9,44 C392.9,214.0 529.0,214.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-toolkit e-repo-env" d="M232.4,44 C232.4,214.0 337.0,214.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-toolkit e-repo-tsconfigs" d="M232.4,44 C232.4,214.0 529.0,214.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-repl e-repo-compaction-extension" d="M312.6,44 C312.6,121.0 575.7,121.0 575.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-repl e-repo-llm-extension" d="M312.6,44 C312.6,121.0 290.3,121.0 290.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-repl e-repo-mcp-extension" d="M312.6,44 C312.6,121.0 361.7,121.0 361.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-repl e-repo-memory-extension" d="M312.6,44 C312.6,121.0 433.0,121.0 433.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-repl e-repo-promises-extension" d="M312.6,44 C312.6,121.0 647.0,121.0 647.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-repl e-repo-prose-extension" d="M312.6,44 C312.6,121.0 718.3,121.0 718.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-repl e-repo-repl" d="M312.6,44 C312.6,90.0 529.0,90.0 529.0,136" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-repl e-repo-secrets-extension" d="M312.6,44 C312.6,121.0 504.3,121.0 504.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-mcp-repl e-repo-tsconfigs" d="M312.6,44 C312.6,214.0 529.0,214.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-ai" d="M633.6,44 C633.6,90.0 337.0,90.0 337.0,136" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-checks" d="M633.6,44 C633.6,121.0 147.7,121.0 147.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-compaction-extension" d="M633.6,44 C633.6,121.0 575.7,121.0 575.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-components" d="M633.6,44 C633.6,183.0 385.0,183.0 385.0,322" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-env" d="M633.6,44 C633.6,214.0 337.0,214.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-evals" d="M633.6,44 C633.6,90.0 433.0,90.0 433.0,136" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-interpreter" d="M633.6,44 C633.6,152.0 433.0,152.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-llm-extension" d="M633.6,44 C633.6,121.0 290.3,121.0 290.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-mcp-extension" d="M633.6,44 C633.6,121.0 361.7,121.0 361.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-memory-extension" d="M633.6,44 C633.6,121.0 433.0,121.0 433.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-promises-extension" d="M633.6,44 C633.6,121.0 647.0,121.0 647.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-prose-extension" d="M633.6,44 C633.6,121.0 718.3,121.0 718.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-repl" d="M633.6,44 C633.6,90.0 529.0,90.0 529.0,136" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-secrets-extension" d="M633.6,44 C633.6,121.0 504.3,121.0 504.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-shared" d="M633.6,44 C633.6,214.0 433.0,214.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-tsconfigs" d="M633.6,44 C633.6,214.0 529.0,214.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-lisptc-trace-viewer e-repo-ui" d="M633.6,44 C633.6,183.0 577.0,183.0 577.0,322" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-ai e-repo-env" d="M337.0,168 C337.0,276.0 337.0,276.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-ai e-repo-interpreter" d="M337.0,168 C337.0,214.0 433.0,214.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-ai e-repo-shared" d="M337.0,168 C337.0,276.0 433.0,276.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-ai e-repo-tsconfigs" d="M337.0,168 C337.0,276.0 529.0,276.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-compaction-extension" d="M433.0,106 C433.0,152.0 575.7,152.0 575.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-interpreter" d="M433.0,106 C433.0,183.0 433.0,183.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-llm-extension" d="M433.0,106 C433.0,152.0 290.3,152.0 290.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-mcp-extension" d="M433.0,106 C433.0,152.0 361.7,152.0 361.7,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-memory-extension" d="M433.0,106 C433.0,152.0 433.0,152.0 433.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-promises-extension" d="M433.0,106 C433.0,152.0 647.0,152.0 647.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-prose-extension" d="M433.0,106 C433.0,152.0 718.3,152.0 718.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-repl" d="M433.0,106 C433.0,121.0 529.0,121.0 529.0,136" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-secrets-extension" d="M433.0,106 C433.0,152.0 504.3,152.0 504.3,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-shared" d="M433.0,106 C433.0,245.0 433.0,245.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-tsconfigs" d="M433.0,106 C433.0,245.0 529.0,245.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-backend e-repo-ui-extension" d="M433.0,106 C433.0,152.0 219.0,152.0 219.0,198" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-bloub e-repo-tsconfigs" d="M289.0,354 C289.0,369.0 529.0,369.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-checks e-repo-interpreter" d="M147.7,230 C147.7,245.0 433.0,245.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-checks e-repo-tsconfigs" d="M147.7,230 C147.7,307.0 529.0,307.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-compaction-extension e-repo-interpreter" d="M575.7,230 C575.7,245.0 433.0,245.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-compaction-extension e-repo-shared" d="M575.7,230 C575.7,307.0 433.0,307.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-compaction-extension e-repo-tsconfigs" d="M575.7,230 C575.7,307.0 529.0,307.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-components e-repo-tsconfigs" d="M385.0,354 C385.0,369.0 529.0,369.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-evals e-repo-env" d="M433.0,168 C433.0,276.0 337.0,276.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-evals e-repo-shared" d="M433.0,168 C433.0,276.0 433.0,276.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-evals e-repo-tsconfigs" d="M433.0,168 C433.0,276.0 529.0,276.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-interpreter e-repo-shared" d="M433.0,292 C433.0,338.0 433.0,338.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-interpreter e-repo-tsconfigs" d="M433.0,292 C433.0,338.0 529.0,338.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-llm-extension e-repo-env" d="M290.3,230 C290.3,307.0 337.0,307.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-llm-extension e-repo-interpreter" d="M290.3,230 C290.3,245.0 433.0,245.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-llm-extension e-repo-shared" d="M290.3,230 C290.3,307.0 433.0,307.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-llm-extension e-repo-tsconfigs" d="M290.3,230 C290.3,307.0 529.0,307.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-mcp-extension e-repo-env" d="M361.7,230 C361.7,307.0 337.0,307.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-mcp-extension e-repo-interpreter" d="M361.7,230 C361.7,245.0 433.0,245.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-mcp-extension e-repo-shared" d="M361.7,230 C361.7,307.0 433.0,307.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-mcp-extension e-repo-tsconfigs" d="M361.7,230 C361.7,307.0 529.0,307.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-memory-extension e-repo-env" d="M433.0,230 C433.0,307.0 337.0,307.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-memory-extension e-repo-interpreter" d="M433.0,230 C433.0,245.0 433.0,245.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-memory-extension e-repo-shared" d="M433.0,230 C433.0,307.0 433.0,307.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-memory-extension e-repo-tsconfigs" d="M433.0,230 C433.0,307.0 529.0,307.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-promises-extension e-repo-interpreter" d="M647.0,230 C647.0,245.0 433.0,245.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-promises-extension e-repo-shared" d="M647.0,230 C647.0,307.0 433.0,307.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-promises-extension e-repo-tsconfigs" d="M647.0,230 C647.0,307.0 529.0,307.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-prose-extension e-repo-interpreter" d="M718.3,230 C718.3,245.0 433.0,245.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-prose-extension e-repo-shared" d="M718.3,230 C718.3,307.0 433.0,307.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-prose-extension e-repo-tsconfigs" d="M718.3,230 C718.3,307.0 529.0,307.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-repl e-repo-env" d="M529.0,168 C529.0,276.0 337.0,276.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-repl e-repo-interpreter" d="M529.0,168 C529.0,214.0 433.0,214.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-repl e-repo-shared" d="M529.0,168 C529.0,276.0 433.0,276.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-repl e-repo-tsconfigs" d="M529.0,168 C529.0,276.0 529.0,276.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-secrets-extension e-repo-env" d="M504.3,230 C504.3,307.0 337.0,307.0 337.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-secrets-extension e-repo-interpreter" d="M504.3,230 C504.3,245.0 433.0,245.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-secrets-extension e-repo-shared" d="M504.3,230 C504.3,307.0 433.0,307.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-secrets-extension e-repo-tsconfigs" d="M504.3,230 C504.3,307.0 529.0,307.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-syntax e-repo-shared" d="M481.0,354 C481.0,369.0 433.0,369.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-syntax e-repo-tsconfigs" d="M481.0,354 C481.0,369.0 529.0,369.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-ui-extension e-repo-interpreter" d="M219.0,230 C219.0,245.0 433.0,245.0 433.0,260" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-ui-extension e-repo-shared" d="M219.0,230 C219.0,307.0 433.0,307.0 433.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-ui-extension e-repo-tsconfigs" d="M219.0,230 C219.0,307.0 529.0,307.0 529.0,384" marker-end="url(#ah-layers)"/>
  <path class="edge e-repo-ui e-repo-tsconfigs" d="M577.0,354 C577.0,369.0 529.0,369.0 529.0,384" marker-end="url(#ah-layers)"/>
  <g class="n n-repo-env">
    <rect class="box" x="293.0" y="390" width="88.0" height="26" rx="3"/>
    <text x="337.0" y="406.5" text-anchor="middle" class="t pkg">env</text>
  </g>
  <g class="n n-repo-shared">
    <rect class="box" x="389.0" y="390" width="88.0" height="26" rx="3"/>
    <text x="433.0" y="406.5" text-anchor="middle" class="t pkg">shared</text>
  </g>
  <g class="n n-repo-tsconfigs">
    <rect class="box" x="485.0" y="390" width="88.0" height="26" rx="3"/>
    <text x="529.0" y="406.5" text-anchor="middle" class="t pkg">tsconfigs</text>
  </g>
  <g class="n n-repo-bloub">
    <rect class="box" x="245.0" y="328" width="88.0" height="26" rx="3"/>
    <text x="289.0" y="344.5" text-anchor="middle" class="t pkg">bloub</text>
  </g>
  <g class="n n-repo-components">
    <rect class="box" x="341.0" y="328" width="88.0" height="26" rx="3"/>
    <text x="385.0" y="344.5" text-anchor="middle" class="t pkg">components</text>
  </g>
  <g class="n n-repo-syntax">
    <rect class="box" x="437.0" y="328" width="88.0" height="26" rx="3"/>
    <text x="481.0" y="344.5" text-anchor="middle" class="t pkg">syntax</text>
  </g>
  <g class="n n-repo-ui">
    <rect class="box" x="533.0" y="328" width="88.0" height="26" rx="3"/>
    <text x="577.0" y="344.5" text-anchor="middle" class="t pkg">ui</text>
  </g>
  <g class="n n-repo-interpreter">
    <rect class="box" x="389.0" y="266" width="88.0" height="26" rx="3"/>
    <text x="433.0" y="282.5" text-anchor="middle" class="t pkg">interpreter</text>
  </g>
  <g class="n n-repo-checks">
    <rect class="box" x="116.0" y="204" width="63.3" height="26" rx="3"/>
    <text x="147.7" y="220.5" text-anchor="middle" class="t pkg">checks</text>
  </g>
  <g class="n n-repo-ui-extension">
    <rect class="box" x="187.3" y="204" width="63.3" height="26" rx="3"/>
    <text x="219.0" y="220.5" text-anchor="middle" class="t pkg">ui-extensi…</text>
  </g>
  <g class="n n-repo-llm-extension">
    <rect class="box" x="258.7" y="204" width="63.3" height="26" rx="3"/>
    <text x="290.3" y="220.5" text-anchor="middle" class="t pkg">llm</text>
  </g>
  <g class="n n-repo-mcp-extension">
    <rect class="box" x="330.0" y="204" width="63.3" height="26" rx="3"/>
    <text x="361.7" y="220.5" text-anchor="middle" class="t pkg">mcp</text>
  </g>
  <g class="n n-repo-memory-extension">
    <rect class="box" x="401.3" y="204" width="63.3" height="26" rx="3"/>
    <text x="433.0" y="220.5" text-anchor="middle" class="t pkg">memory</text>
  </g>
  <g class="n n-repo-secrets-extension">
    <rect class="box" x="472.7" y="204" width="63.3" height="26" rx="3"/>
    <text x="504.3" y="220.5" text-anchor="middle" class="t pkg">secrets</text>
  </g>
  <g class="n n-repo-compaction-extension">
    <rect class="box" x="544.0" y="204" width="63.3" height="26" rx="3"/>
    <text x="575.7" y="220.5" text-anchor="middle" class="t pkg">compaction</text>
  </g>
  <g class="n n-repo-promises-extension">
    <rect class="box" x="615.3" y="204" width="63.3" height="26" rx="3"/>
    <text x="647.0" y="220.5" text-anchor="middle" class="t pkg">promises</text>
  </g>
  <g class="n n-repo-prose-extension">
    <rect class="box" x="686.7" y="204" width="63.3" height="26" rx="3"/>
    <text x="718.3" y="220.5" text-anchor="middle" class="t pkg">prose</text>
  </g>
  <g class="n n-repo-ai">
    <rect class="box" x="293.0" y="142" width="88.0" height="26" rx="3"/>
    <text x="337.0" y="158.5" text-anchor="middle" class="t pkg">ai</text>
  </g>
  <g class="n n-repo-evals">
    <rect class="box" x="389.0" y="142" width="88.0" height="26" rx="3"/>
    <text x="433.0" y="158.5" text-anchor="middle" class="t pkg">evals</text>
  </g>
  <g class="n n-repo-repl">
    <rect class="box" x="485.0" y="142" width="88.0" height="26" rx="3"/>
    <text x="529.0" y="158.5" text-anchor="middle" class="t pkg">repl</text>
  </g>
  <g class="n n-repo-backend">
    <rect class="box" x="389.0" y="80" width="88.0" height="26" rx="3"/>
    <text x="433.0" y="96.5" text-anchor="middle" class="t pkg">backend</text>
  </g>
  <g class="n n-lisptc-dashi-code">
    <rect class="box" x="116.0" y="18" width="72.2" height="26" rx="3"/>
    <text x="152.1" y="34.5" text-anchor="middle" class="t pkg">dashi-code</text>
  </g>
  <g class="n n-lisptc-mcp-toolkit">
    <rect class="box" x="196.2" y="18" width="72.2" height="26" rx="3"/>
    <text x="232.4" y="34.5" text-anchor="middle" class="t pkg">mcp-toolkit</text>
  </g>
  <g class="n n-lisptc-mcp-repl">
    <rect class="box" x="276.5" y="18" width="72.2" height="26" rx="3"/>
    <text x="312.6" y="34.5" text-anchor="middle" class="t pkg">mcp</text>
  </g>
  <g class="n n-lisptc-lsp">
    <rect class="box" x="356.8" y="18" width="72.2" height="26" rx="3"/>
    <text x="392.9" y="34.5" text-anchor="middle" class="t pkg">lsp</text>
  </g>
  <g class="n n-lisptc-cli">
    <rect class="box" x="437.0" y="18" width="72.2" height="26" rx="3"/>
    <text x="473.1" y="34.5" text-anchor="middle" class="t pkg">cli</text>
  </g>
  <g class="n n-app">
    <rect class="box" x="517.2" y="18" width="72.2" height="26" rx="3"/>
    <text x="553.4" y="34.5" text-anchor="middle" class="t pkg">app</text>
  </g>
  <g class="n n-lisptc-trace-viewer">
    <rect class="box" x="597.5" y="18" width="72.2" height="26" rx="3"/>
    <text x="633.6" y="34.5" text-anchor="middle" class="t pkg">trace-view…</text>
  </g>
  <g class="n n-api">
    <rect class="box" x="677.8" y="18" width="72.2" height="26" rx="3"/>
    <text x="713.9" y="34.5" text-anchor="middle" class="t pkg">api</text>
  </g>
  <text x="380.0" y="460" text-anchor="middle" class="t cap">140 dependencies over 7 layers, every arrow pointing down, that is the whole rule</text>
  <text x="380.0" y="478" text-anchor="middle" class="t cap">hover a package to pick its dependencies out of the pile</text>
</svg>

I run `turbo boundaries` in ci checks as well as in a pre-push hook to make sure that everything is following my rules.

for rules that turbo boundaries cannot enforce I have a separate script `check-arch`

the big one is host ports, an extension declares an interface for everything it does that reaches outside the process and is handed an implementation of it, so the only ring of code that touches the filesystem, the network, a subprocess or an sdk is the adapter ring, the language surface itself stays sealed:

<svg class="rings-diagram" viewBox="0 0 760 566" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="Four concentric rings, evaluator core, extension modules, host adapters and composition roots, with the world reaching in from outside and stopping at the adapter ring">
  <style>
    svg.rings-diagram { color: var(--fg); }
    svg.rings-diagram .s-wire{ stroke:#6d5fa6; }
    svg.rings-diagram .f-wire{ fill:#6d5fa6; }
    svg.rings-diagram .s-world{ stroke:#b4441f; }
    svg.rings-diagram .f-world{ fill:#b4441f; }
    svg.rings-diagram .s-sealed{ stroke:#0f7a6b; }
    svg.rings-diagram .f-sealed{ fill:#0f7a6b; }
    svg.rings-diagram .s-core{ stroke:#2c3a3d; }
    svg.rings-diagram .f-core{ fill:#2c3a3d; }
    svg.rings-diagram .band{ fill:none; }
    svg.rings-diagram .edge{ fill:none; stroke-width:1.25; opacity:.6; }
    svg.rings-diagram .spoke{ stroke-width:1.4; fill:none; stroke-dasharray:5 3; stroke-linecap:round; }
    svg.rings-diagram .t{ font-family:'JetBrains Mono','JetBrainsMono Nerd Font',ui-monospace,'Cascadia Code','Source Code Pro',Menlo,Consolas,'DejaVu Sans Mono',monospace; }
    svg.rings-diagram .rl{ font-size:12px; letter-spacing:.09em; }
    svg.rings-diagram .rs{ font-size:10.5px; opacity:.72; }
    svg.rings-diagram .sl{ font-size:10.5px; }
    svg.rings-diagram .note{ font-size:12px; fill:currentColor; opacity:.72; }
    [data-theme='dark'] svg.rings-diagram .s-wire{ stroke:#a79bd6; }
    [data-theme='dark'] svg.rings-diagram .f-wire{ fill:#a79bd6; }
    [data-theme='dark'] svg.rings-diagram .s-world{ stroke:#f07f4f; }
    [data-theme='dark'] svg.rings-diagram .f-world{ fill:#f07f4f; }
    [data-theme='dark'] svg.rings-diagram .s-sealed{ stroke:#3fbfab; }
    [data-theme='dark'] svg.rings-diagram .f-sealed{ fill:#3fbfab; }
    [data-theme='dark'] svg.rings-diagram .s-core{ stroke:#b9c7c9; }
    [data-theme='dark'] svg.rings-diagram .f-core{ fill:#b9c7c9; }
  </style>
  <circle class="band s-wire" cx="380" cy="250" r="190.0" stroke-width="44" opacity=".13"/>
  <circle class="edge s-wire" cx="380" cy="250" r="212"/>
  <circle class="band s-world" cx="380" cy="250" r="144.0" stroke-width="44" opacity=".2"/>
  <circle class="edge s-world" cx="380" cy="250" r="166"/>
  <circle class="band s-sealed" cx="380" cy="250" r="99.0" stroke-width="42" opacity=".13"/>
  <circle class="edge s-sealed" cx="380" cy="250" r="120"/>
  <circle class="band s-core" cx="380" cy="250" r="38.0" stroke-width="76" opacity=".13"/>
  <circle class="edge s-core" cx="380" cy="250" r="76"/>
  <text x="380" y="58.0" text-anchor="middle" class="t rl f-wire">COMPOSITION</text>
  <text x="380" y="72.0" text-anchor="middle" class="t rs f-wire">apps and front-ends</text>
  <text x="380" y="104.0" text-anchor="middle" class="t rl f-world">ADAPTERS</text>
  <text x="380" y="118.0" text-anchor="middle" class="t rs f-world">*-host.ts</text>
  <text x="380" y="149.0" text-anchor="middle" class="t rl f-sealed">EXTENSIONS</text>
  <text x="380" y="163.0" text-anchor="middle" class="t rs f-sealed">*.ts</text>
  <text x="380" y="244" text-anchor="middle" class="t rl f-core">EVALUATOR</text>
  <text x="380" y="258" text-anchor="middle" class="t rs f-core">lisp.ts</text>
  <line class="spoke s-world" x1="553.1" y1="104.7" x2="490.3" y2="157.4"/>
  <circle class="f-world" cx="490.3" cy="157.4" r="3.2"/>
  <text x="562.3" y="100.0" text-anchor="start" class="t sl f-world">environment</text>
  <line class="spoke s-world" x1="606.0" y1="250.0" x2="524.0" y2="250.0"/>
  <circle class="f-world" cx="524.0" cy="250.0" r="3.2"/>
  <text x="618.0" y="253.0" text-anchor="start" class="t sl f-world">network</text>
  <line class="spoke s-world" x1="553.1" y1="395.3" x2="490.3" y2="342.6"/>
  <circle class="f-world" cx="490.3" cy="342.6" r="3.2"/>
  <text x="562.3" y="406.0" text-anchor="start" class="t sl f-world">SDK</text>
  <line class="spoke s-world" x1="380.0" y1="476.0" x2="380.0" y2="394.0"/>
  <circle class="f-world" cx="380.0" cy="394.0" r="3.2"/>
  <text x="380.0" y="499.0" text-anchor="middle" class="t sl f-world">subprocess</text>
  <line class="spoke s-world" x1="206.9" y1="395.3" x2="269.7" y2="342.6"/>
  <circle class="f-world" cx="269.7" cy="342.6" r="3.2"/>
  <text x="197.7" y="406.0" text-anchor="end" class="t sl f-world">clock</text>
  <line class="spoke s-world" x1="154.0" y1="250.0" x2="236.0" y2="250.0"/>
  <circle class="f-world" cx="236.0" cy="250.0" r="3.2"/>
  <text x="142.0" y="253.0" text-anchor="end" class="t sl f-world">filesystem</text>
  <text x="380" y="528" text-anchor="middle" class="t note">every reach for the world stops at the adapter ring</text>
  <text x="380" y="546" text-anchor="middle" class="t note">the extension declares the port, it never imports what is behind it</text>
</svg>

`check-arch` fails on a `node:fs` inside an extension module and names the `-host.ts` file to move it to, a boundary an agent can feel in one command is a boundary that survives.

## test driven refactors

as I develop the product, I ask an agent to add a new functionality, I describe how it has to work, the agent goes and builds it, I don't care how, we iterate, I test the feature, modify it, once I like it, I commit to it by asking for tests that the feature passes, now I turn my eye to the implementation, I read the code, ask the agent to brief me about its changes and how it works and all the workarounds it used, I then propose a better design, an architecture choice, a technology choice, the right abstraction and the refactor work starts, we have the tests as guidelines that the refactor didn't change the feature.

## closing the loop with traces

since my application is based on natural language interaction, I collect these conversations using posthog,
which allows me to run a bunch of scouting agents that look for signal to enhance the product,
sometimes I would just pull a list of traces and their user reports and look for what the product is missing, since the product is also a programming language, I can directly go from traces into new builtins in the language, better error reports, better built in context compaction and sometimes completely new features.

## Dashicodes a dashboard to visualize technical debt

scripts catch a rule the moment it breaks, but technical debt doesn't break anything, it accumulates, a file that gets a little hairier every week never fails ci, so I built a dashboard inside the monorepo, `apps/dashi-code`, tagged `product` like any other app, whose only job is to show me the shape of the codebase and how it is moving.

the important part is that nothing is run by hand, there is no script I remember to invoke and no json I copy somewhere, the app runs its own analysis: `fallow dead-code` and `fallow health` for the ast side, a walk of `git log --numstat` for the history side, the workspace graph read off the turbo tags, and the open pull requests pulled through a `Forge` port, all written into an r2 bucket as timestamped documents, the last twelve of each kind kept, the rest pruned. a page can only show what the store holds, so what I am looking at and what was actually measured cannot drift apart.

what it draws:

- **hotspot quadrant**, churn on one axis and complexity on the other, the top right is the only place where a refactor pays for itself, code that is both hard to understand and changing constantly, everything else is either stable or simple and can be left alone

- **layered dependency graph and a dsm of the same edges**, the graph pins every package to the layer its turbo tag already declares so a violation is an edge that climbs, the matrix orders both axes by layer so a violation is a mark in the empty triangle, which is much easier to spot than an arrow in a tangle

- **import cycles**, one ring per cycle drawn on its own, every edge in a cycle looks fine in isolation, the only way to see one is to isolate the loop and follow it round

- **temporal coupling arcs**, two packages that always change in the same commit are coupled whether or not either imports the other, this one comes purely from git history and it routinely finds coupling the import graph cannot see, which is exactly the kind of thing an agent creates when it copies logic instead of sharing it

- **blast radius per pull request**, the changed files closed over the reverse dependency graph, what a pr edits is the small part, what transitively depends on what it edited is what a mistake actually reaches

- **pull request flow and lifetimes**, opened above the line, resolved below it, backlog underneath, and one lane per pr with a dot per commit sized by the churn it landed, a branch that grew quietly for a week and then doubled overnight reads differently from one that arrived whole

every frame carries its own spec next to the chart, what it is built from, how many marks before it stops being readable, and the condition under which it lies, a treemap where you compare areas of non adjacent tiles, a quadrant you read as a ranking instead of a triage, a lifetimes chart on a rebased branch whose commit dates predate the pr. agents are very good at producing a chart that looks right and means nothing, writing down the failure mode next to the chart is how I keep myself and them honest about what each view can actually be used for.

snapshots are the reason it is worth storing anything at all, `/versions` lists them and `/compare` puts two side by side, so the question stops being "is this file bad" and becomes "was this worse or better a month ago", debt you can only see as a level is debt you argue about, debt you can see as a slope is debt you act on.

the app follows the same rules as everything else in the repo, the same layers, the same ports, the same checks in ci. the dashboard that measures the debt is not allowed to be the place where it accumulates.

## less technical debt means better agent code

clear architecture and good design patterns are the signal your agents copy, and so are the bad ones,
allow for a cyclic import once, solve it with a lazy load one time, come back 2 days later and your codebase is full of this pattern.

## check for code duplication

using tools like [fallow](https://fallow.tools/) you can detect code duplication and dead code, these can be your signals for better abstractions and shared logic

agents are notoriously good at creating whole functions to do the same thing with some extra spice or changes
making your codebase a headache to change, you need to keep track of every occurrence of that piece of logic.

having scouting agents that occasionally kick off and look for these opportunities automates most of this, however it stays important to keep an eye on the code and try to find these yourself.
