---
title: 'lisptc — a Lisp built for AI agents'
description: "Anthropic's post on programmatic tool calling sent me down a rabbit hole: instead of calling tools in a loop, the agent becomes a programmer. So I built a Lisp from the ground up to be the language it writes in, and to make the case that the LLM is not the agent."
pubDate: 2026-08-16
category: 'tech'
tags: ['ai', 'agents', 'lisp', 'interpreters', 'neuro-symbolic', 'mcp']
ogImage: 'og2'
link: 'https://github.com/1hachem/lisptc'
tldr: "Programmatic tool calling lets an agent write code instead of firing one tool call at a time, but running that code safely is a hard, unsolved problem. Instead of sandboxing an existing language, I built one that never had the dangerous capabilities in the first place: lisptc, a Lisp dialect with an interpreter, an LSP, a formatter and a REPL, designed from scratch for AI agents, with native MCP support, grammar-constrained output, and context compression built in. The bigger claim: the LLM isn't the agent, it's one module in a cognitive architecture, and Lisp is the symbolic half."
---

Anthropic's [blog post](https://www.anthropic.com/engineering/advanced-tool-use) about programmatic tool calling pointed to a better
way to use AI agents. Instead of calling tools in a loop, the agent becomes a
programmer: it writes the function calls and the logic in a language of its
choice, and the runtime executes them.

This is the story of how I went down a rabbit hole of sandboxing, interpreter
design, and Lisp (a programming language from 1958), and came out the other side
with **lisptc**, a small Lisp built specifically for AI agents: interpreter,
LSP, formatter, and REPL.

But the tooling is only half the story.

My idea is that the LLM is not the agent. It's one module in a larger system, and the
Lisp is the glue that holds all these modules together. Hold onto that; I'll come back to it.

## What programmatic tool calling is

The usual way an agent uses tools is a call-and-wait loop. The model emits a
single tool call as structured JSON, the runtime executes it and hands back the
result, the model reads that result and emits the next call. That's one round
trip per step, and every intermediate value has to pass back through the model's
context along the way.

Programmatic tool calling flips the whole arrangement. Instead of emitting one
call at a time, the model writes a _program_: a snippet of ordinary code in
which the tools show up as functions it can compose, loop over, branch on, and
assign to variables. The runtime runs the whole snippet and returns only what
the program chose to surface. The model stops being the thing that dispatches
each call and becomes the thing that _writes the logic_ around them.

That shift is the entire premise of this project, so it's worth being concrete
about why it's such an improvement.

<svg class="ptc-diagram" viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="Traditional agent loop versus programmatic tool calling">
  <style>
    svg.ptc-diagram { color: var(--fg); }
    .s{ stroke:currentColor; stroke-width:1.6; }
    .box{ stroke:currentColor; stroke-width:1.6; fill:none; }
    .ll{ stroke:currentColor; stroke-width:1.2; stroke-dasharray:3 4; opacity:.5; }
    .t{ fill:currentColor; font-family:'JetBrains Mono','JetBrainsMono Nerd Font',ui-monospace,'Cascadia Code','Source Code Pro',Menlo,Consolas,'DejaVu Sans Mono',monospace; }
    .lbl{ font-size:13px; }
    .ttl{ font-size:15px; font-weight:600; }
    .cap{ font-size:12px; opacity:.72; }
    .mono{ font-size:12px; fill:currentColor; }
    .dim{ opacity:.6; }
  </style>
  <defs>
    <marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="currentColor"/>
    </marker>
  </defs>
  <line x1="380" y1="18" x2="380" y2="388" class="ll"/>
  <!-- LEFT: traditional agent loop -->
  <text x="200" y="32" text-anchor="middle" class="t ttl">Traditional agent loop</text>
  <rect class="box" x="70" y="58" width="90" height="44" rx="7"/>
  <text x="115" y="85" text-anchor="middle" class="t lbl">Model</text>
  <rect class="box" x="250" y="58" width="90" height="44" rx="7"/>
  <text x="295" y="85" text-anchor="middle" class="t lbl">MCP server</text>
  <line x1="115" y1="102" x2="115" y2="322" class="ll"/>
  <line x1="295" y1="102" x2="295" y2="322" class="ll"/>
  <line class="s" x1="117" y1="140" x2="293" y2="140" marker-end="url(#ah)"/>
  <text x="205" y="134" text-anchor="middle" class="t mono">tool call &#9312;</text>
  <line class="s" x1="293" y1="172" x2="117" y2="172" marker-end="url(#ah)"/>
  <text x="205" y="166" text-anchor="middle" class="t mono">result &#9312;</text>
  <line class="s" x1="117" y1="214" x2="293" y2="214" marker-end="url(#ah)"/>
  <text x="205" y="208" text-anchor="middle" class="t mono">tool call &#9313;</text>
  <line class="s" x1="293" y1="246" x2="117" y2="246" marker-end="url(#ah)"/>
  <text x="205" y="240" text-anchor="middle" class="t mono">result &#9313;</text>
  <text x="205" y="288" text-anchor="middle" class="t lbl dim">&#8942;</text>
  <text x="205" y="352" text-anchor="middle" class="t cap">N round trips; every value</text>
  <text x="205" y="368" text-anchor="middle" class="t cap">re-enters the model's context</text>
  <!-- RIGHT: programmatic tool calling -->
  <text x="570" y="32" text-anchor="middle" class="t ttl">Programmatic tool calling</text>
  <rect class="box" x="430" y="58" width="96" height="44" rx="7"/>
  <text x="478" y="85" text-anchor="middle" class="t lbl">Model</text>
  <line class="s" x1="478" y1="102" x2="478" y2="140" marker-end="url(#ah)"/>
  <text x="514" y="126" class="t cap">writes</text>
  <rect class="box" x="418" y="142" width="152" height="98" rx="7"/>
  <text x="430" y="162" class="t cap dim">one program</text>
  <line class="s dim" x1="430" y1="178" x2="540" y2="178"/>
  <line class="s dim" x1="430" y1="192" x2="558" y2="192"/>
  <line class="s dim" x1="446" y1="206" x2="540" y2="206"/>
  <line class="s dim" x1="446" y1="220" x2="522" y2="220"/>
  <rect class="box" x="612" y="150" width="96" height="82" rx="7"/>
  <text x="660" y="184" text-anchor="middle" class="t lbl">Runtime</text>
  <text x="660" y="204" text-anchor="middle" class="t mono dim">fn&#183;fn&#183;fn</text>
  <line class="s" x1="570" y1="191" x2="612" y2="191" marker-end="url(#ah)"/>
  <text x="591" y="183" text-anchor="middle" class="t cap">run</text>
  <path class="s" d="M660 150 C 655 112 596 92 530 88" marker-end="url(#ah)"/>
  <text x="602" y="108" text-anchor="middle" class="t cap">result only</text>
  <text x="565" y="292" text-anchor="middle" class="t cap">one round trip; intermediate data</text>
  <text x="565" y="308" text-anchor="middle" class="t cap">stays in the runtime</text>
</svg>

For those who are unfamiliar with this subject, here is a video that explains PTC in more detail:

<div style="position: relative; aspect-ratio: 16 / 9; margin: 1.5rem 0; background: #000 url('https://i.ytimg.com/vi/2MJDdzSXL74/hqdefault.jpg') center / cover no-repeat;">
  <iframe
    src="https://www.youtube-nocookie.com/embed/2MJDdzSXL74"
    title="What is programmatic tool calling?"
    style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
  ></iframe>
</div>

## Why programmatic tool calling wins

The advantages compound quickly. There's no JSON-schema boilerplate wrapping
every call, and no giant system prompt describing every tool up front. You get
real control flow: call a tool inside a `for` loop instead of relying on the
model to fire off N separate calls by hand. Intermediate data lives in
variables and gets passed around without ever loading it back into the
model's context. And the agent can pull from the huge ecosystems of libraries
and SDKs already out there, not just the tools you hand it.

The only serious downside I can think of is security. The code the agent
executes can be malicious in plenty of ways: the user might _want_ it to be, a
prompt injection might slip in, or the agent might just write code that never
stops eating host resources.

## The untrusted-code rabbit hole

That's the well-known problem of untrusted code execution, and it drops you
straight into a rabbit hole of decades of work on sandboxing and isolation. It's
still a standing problem, only ever _mitigated_, never solved, and every current
solution piles a lot of complexity onto your stack.

The root difficulty is this: trying to limit the power and access of a
_general-purpose_ programming language is a hard task, and there is always a
workaround. This is what [Cloudflare](https://developers.cloudflare.com/agents/tools/sandbox/), [e2b](https://e2b.dev/), and [exe.dev](https://exe.dev/) try to provide.

But there's another way to get exactly what you want. Instead of fighting to
strip capabilities _out_ of an existing language, you build a language from the
ground up that never had the access you didn't want in the first place.

When Vercel [announced zerolang](https://github.com/vercel-labs/zerolang), a
language destined for AI agents, I was excited. I hoped they'd optimized for
prompt usage, designed the whole thing around zero-trust permissions, and baked
in memory and MCP support. Instead it was a flop: a side project the marketing
team made a big deal of.

Nobody I knew of had built what I needed, so I stepped out of my comfort zone and
started reading about interpreters and programming-language design. And waiting
for me at the entrance was the perfect language for the job. Lisp!

## Enter Lisp

First developed in 1958 for AI research, its ideas went on to influence most of
today's programming languages. The questions John McCarthy (creator, or maybe discoverer of Lisp)
was wrestling with back then, when the whole point was symbolic reasoning for
machines, map almost perfectly onto what an agent language needs now:

- What if a program were written in the very same form as the data it operates
  on, so that code and data became interchangeable?
- What is the smallest handful of irreducible primitives from which every other
  operation can be built?
- Could a language be simple enough to describe its own evaluation, to act as
  its own interpreter?
- And what if you threw out elaborate syntax altogether, so that a program was
  just a list?

Sixty-odd years later, each answer earns its keep here. Code-as-data means a
program is an ordinary structure the agent can build, read back, and reshape, and
that reaches the language itself: a pattern it keeps spelling out by hand becomes
a single form, so the same task costs fewer tokens every time it comes up again.
Macros are the obvious payoff, but the deeper one is that the agent can bend the
language to fit the job instead of the other way around. A handful of
primitives keeps the language small enough to reason about completely and to pin
down with a compact grammar. A self-describing core made the interpreter, LSP,
and formatter almost embarrassingly simple to build. And when a program is just a
parenthesized list, there's very little syntax for the model to fumble and very
little to constrain. The REPL workflow that grew out of all of it is the final
fit: an interactive, feedback-driven loop the model was already trained on.

I found [Make a Lisp](https://github.com/kanaka/mal) (mal), an open-source
project for building Lisp interpreters across languages: C, JS, Python, Go, you
name it. The C implementation was around 500 lines. I was in awe. I realized I
could fit the _entire interpreter_ into a system prompt, so the agent could
learn the language inside out.

So that's what I did. I cloned a TypeScript implementation and, with Claude Code,
went on modifying it into an in-memory REPL that I hooked up to a
[PI agent](https://github.com/parallel-ai). The result is **lisptc**: a Lisp
dialect and interpreter, plus an LSP, a formatter, and a REPL, all aimed at
agents. Scripts carry the `.ptc` extension. You can find it [here](https://github.com/1hachem/lisptc).

It's real Lisp underneath: closures, macros, exact bigint arithmetic, the lot.

```lisp
(defun classify (n)
  (cond ((< n 0) 'negative) ((= n 0) 'zero) (t 'positive)))
(mapcar classify '(-3 0 7))   ; => (negative zero positive)
```

Macros are where homoiconicity stops being a fancy theoretical property and
starts paying rent. A program is a list, so the agent can write code that writes
code, and it does it in the session it's already working in. Say it keeps
repeating the same navigate-then-look-at-the-page dance a dozen times over.
Instead of repeating itself, it can teach the language the pattern:

```lisp
(defmacro visit (url &rest body)
  `(progn
     (playwright/browser_navigate :url ,url)
     (let ((page (playwright/browser_snapshot)))
       ,@body)))

(visit "https://hyko.ai" (grep page "pricing"))
```

From then on `visit` is a form like any other, with the same LSP support as
everything else in scope. No AST library, no parser, no build step, just a list
that describes another list. The agent isn't calling an extension API here, it's
using the language the way the language was always meant to be used.

This is also, I think, the right way to write agent memory. Today memory usually
means a pile of markdown files the agent greps through and reads back into its
context. That's a filing cabinet. It stores facts and nothing else, and every use
of it costs context.

A macro is a memory too, and a far better kind. It persists, it evaluates, it can
reach for other memories, it can have side effects. The agent can write code that
runs over its memories, which are themselves code, to produce a new memory, which
is also code. Declarative memory, the things it knows, and procedural memory, the
things it knows how to do, stop being two separate systems stapled onto a model and
become the same thing: lists the interpreter can already read, store, and run.

Along the way I needed a language server, which turned out to be fairly easy with
[vscode-languageserver](https://github.com/microsoft/vscode-languageserver-node)
(despite the name, it works with any modern editor), and a formatter, where
[Topiary](https://topiary.tweag.io/) had my back with a spec-driven one.
Everything got packaged into a Nix flake, and I was genuinely impressed by how
easy it all was, all thanks to the genius minimalism of Lisp's design.

## But why not just use TypeScript?

Fair question, and one I asked myself for a while before writing a single line.
TypeScript is right there. Every model writes it fluently, npm has a package for
everything, and the sandboxing story, while unsolved, is at least well trodden.
Inventing a language is the kind of thing you should have to justify.

Here is the comparison as I see it, running an agent's programs in a sandboxed
TypeScript runtime versus running them in lisptc:

<div class="table-wrap">
<table>
<colgroup>
<col style="width: 12%">
<col style="width: 50%">
<col style="width: 38%">
</colgroup>
<thead>
<tr><th></th><th>ts in sandbox</th><th>lisptc</th></tr>
</thead>
<tbody>
<tr><td><strong>Security model</strong></td><td>Deny-list. You start from a language that can do anything and take capabilities away, hoping you found them all.</td><td>Allow-list. Nothing exists in the runtime unless I put it there, so there is nothing to strip out.</td></tr>
<tr><td><strong>Cost of isolation</strong></td><td>V8 isolates, containers, or a microVM per run, plus the ops burden that comes with them.</td><td>The interpreter is the boundary. No extra infrastructure.</td></tr>
<tr><td><strong>Size of the language</strong></td><td>Hundreds of pages of spec and decades of accumulated edge cases.</td><td>Around 500 lines. The whole interpreter fits in a system prompt.</td></tr>
<tr><td><strong>How the model learns it</strong></td><td>It relies on whatever it absorbed during training, and on you describing your API in prose.</td><td>It reads the actual interpreter, so it knows the language exactly, not approximately.</td></tr>
<tr><td><strong>Constrained decoding</strong></td><td>A grammar for TypeScript is enormous and unusable in practice.</td><td>A full GBNF grammar in a few dozen rules, so an open model physically cannot emit invalid syntax.</td></tr>
<tr><td><strong>Code as data</strong></td><td>Extending the language means an AST library, a parser, and a lot of ceremony.</td><td>A program is a list, so the language extends itself. The agent defines a macro mid-session to collapse a pattern it keeps repeating, and the new form is indistinguishable from a builtin.</td></tr>
<tr><td><strong>Tool calls</strong></td><td>An SDK, a client, and glue code per server.</td><td>Tools are ordinary globals: <code>(playwright/browser_navigate :url "...")</code></td></tr>
<tr><td><strong>Execution model</strong></td><td>Run a script, get output, run another script. State dies with the process unless you rebuild it every time.</td><td>A live REPL. Bindings persist across turns, the agent tests a line before committing to it, and the whole loop matches the notebooks it was trained on.</td></tr>
<tr><td><strong>Ecosystem</strong></td><td>npm. Nothing I build competes with this.</td><td>What I wrote, plus whatever MCP servers expose.</td></tr>
<tr><td><strong>Model fluency</strong></td><td>Native. This is what the training data is made of.</td><td>Rusty, and the parentheses genuinely worried me.</td></tr>
<tr><td><strong>Who owns the runtime</strong></td><td>You rent it. Compression, disclosure, and tooling are things you add around a runtime someone else defined.</td><td>I own it, so the tricks land inside the language. Reads are grep-able and paginated by construction, and loading an MCP server teaches the LSP about it, so tools arrive with completion and documentation on the spot.</td></tr>
</tbody>
</table>
</div>

The two rows before the last are real losses and I am not going to pretend
otherwise. The ecosystem gap stings least, because MCP absorbs most of what an
agent actually reaches for, and a server is easier to wrap than a library is to
sandbox. The fluency gap is the one I lost sleep over, and I'll come back to it
further down.

## What owning the whole stack buys you

Here's the part I didn't fully expect. Because I owned the interpreter _and_ the
REPL end to end, capabilities that are expensive add-ons everywhere else came
almost for free. Each one below is less a feature I built than a property that
fell out of the design.

<svg class="repl-diagram" viewBox="0 0 760 400" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="The agent reasons and sends grammar-constrained Lisp to a persistent REPL, which returns clipped results while bindings stay in the session">
  <style>
    svg.repl-diagram { color: var(--fg); }
    svg.repl-diagram .s{ stroke:currentColor; stroke-width:1.6; }
    svg.repl-diagram .box{ stroke:currentColor; stroke-width:1.6; fill:none; }
    svg.repl-diagram .dash{ stroke:currentColor; stroke-width:1.2; fill:none; stroke-dasharray:4 4; opacity:.6; }
    svg.repl-diagram .ll{ stroke:currentColor; stroke-width:1.2; stroke-dasharray:3 4; opacity:.5; }
    svg.repl-diagram .t{ fill:currentColor; font-family:'JetBrains Mono','JetBrainsMono Nerd Font',ui-monospace,'Cascadia Code','Source Code Pro',Menlo,Consolas,'DejaVu Sans Mono',monospace; }
    svg.repl-diagram .lbl{ font-size:13px; }
    svg.repl-diagram .cap{ font-size:12px; opacity:.72; }
    svg.repl-diagram .mono{ font-size:12px; }
    svg.repl-diagram .dim{ opacity:.55; }
  </style>
  <defs>
    <marker id="ah2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0 0L10 5L0 10z" fill="currentColor"/>
    </marker>
  </defs>
  <text x="165" y="34" text-anchor="middle" class="t lbl">Agent</text>
  <text x="369" y="34" text-anchor="middle" class="t cap">grammar-constrained lisp</text>
  <rect class="box" x="90" y="110" width="150" height="56" rx="8"/>
  <text x="165" y="134" text-anchor="middle" class="t lbl">reasons</text>
  <text x="165" y="153" text-anchor="middle" class="t cap dim">turn &#9312;</text>
  <line x1="165" y1="166" x2="165" y2="250" class="ll"/>
  <rect class="box" x="90" y="250" width="150" height="56" rx="8"/>
  <text x="165" y="274" text-anchor="middle" class="t lbl">reasons</text>
  <text x="165" y="293" text-anchor="middle" class="t cap dim">turn &#9313;</text>
  <line x1="165" y1="306" x2="165" y2="330" class="ll"/>
  <text x="165" y="344" text-anchor="middle" class="t lbl dim">&#8942;</text>
  <rect class="box" x="500" y="48" width="218" height="300" rx="10"/>
  <text x="609" y="76" text-anchor="middle" class="t lbl">REPL</text>
  <text x="609" y="94" text-anchor="middle" class="t cap dim">persistent</text>
  <rect class="dash" x="512" y="108" width="194" height="102" rx="6"/>
  <text x="524" y="127" class="t cap">prelude</text>
  <text x="524" y="149" class="t mono dim">(defun visit (url) &#8230;)</text>
  <text x="524" y="167" class="t mono dim">(defvar *goal* &#8230;)</text>
  <text x="524" y="185" class="t mono dim">(defvar *plan* &#8230;)</text>
  <text x="524" y="203" class="t cap dim">procedural + declarative</text>
  <text x="524" y="238" class="t cap">env</text>
  <text x="524" y="260" class="t mono dim">page &#8592; &#9312;</text>
  <text x="524" y="280" class="t mono dim">hits &#8592; &#9313;</text>
  <text x="528" y="300" class="t lbl dim">&#8942;</text>
  <text x="609" y="332" text-anchor="middle" class="t cap">nothing is rebuilt</text>
  <text x="369" y="118" text-anchor="middle" class="t mono">(visit "https://hyko.ai")</text>
  <line class="s" x1="242" y1="130" x2="496" y2="130" marker-end="url(#ah2)"/>
  <line class="s" x1="496" y1="158" x2="242" y2="158" marker-end="url(#ah2)"/>
  <text x="369" y="176" text-anchor="middle" class="t mono">#&lt;page 812 lines&gt;</text>
  <text x="369" y="258" text-anchor="middle" class="t mono">(grep page "price")</text>
  <line class="s" x1="242" y1="270" x2="496" y2="270" marker-end="url(#ah2)"/>
  <line class="s" x1="496" y1="298" x2="242" y2="298" marker-end="url(#ah2)"/>
  <text x="369" y="316" text-anchor="middle" class="t mono">("Pro $29/mo" &#8230;) [3 of 812]</text>
  <text x="380" y="382" text-anchor="middle" class="t cap">only lisp crosses, in both directions</text>
</svg>

The prelude is the file the REPL starts from: procedures the agent can reuse
without writing them again, plus the goal it's working toward and the plan it
came up with. Everything below is a consequence of that picture.

### Grammar-constrained output

The best part is that I can _force_ the model's output to conform to the Lisp
syntax. `llama.cpp` uses the [GBNF](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)
format: you describe the language's grammar and generation rules, pass it in with
your API call, and the model can only emit a token that satisfies the grammar.
Not every provider exposes this passthrough, and I can only name a few that do;
[Fireworks AI](https://docs.fireworks.ai/structured-responses/structured-output-grammar-based)
is one. Maybe at some point I'll have to self-host these models.

### The REPL loop

I hadn't touched a Jupyter notebook since I switched careers from AI engineer to
software engineer, and I'd forgotten how amazing the REPL model is. You debug and
test code _as you write it_; the REPL keeps the context and gives you feedback.

For an AI agent this is fantastic. The agent gets instant feedback, and it was
_trained_ on exactly this kind of execution, with every notebook in its training
data working this way. The minimal-by-default, easily-extendable nature of the PI
agent framework meant I had a chat TUI wired to my REPL from the get-go, with the
custom formatter and LSP alongside it: an adequate workbench for tearing these
scripts apart and reassembling them.

### MCP as a native primitive

Another feature that was really easy to implement is native MCP integration. You
load an MCP server, stdio or online, and every tool it exposes becomes a plain
function. You get discoverability without asking for it: search predefined
servers, or look for a tool inside one already loaded.

```lisp
;; discover a server in the bundled toolkit, load it, and call its tools
;; (no JSON schema, no glue code)
(search-mcps "browser")             ; => ranked matches, best first
(await (load-mcp "playwright"))     ; async: returns a job; await installs the bindings

;; every tool is now an ordinary global binding named <server>/<tool>,
;; called with native keyword syntax
(playwright/browser_navigate :url "https://hyko.ai")
(princ (playwright/browser_snapshot))   ; accessibility tree, paginated by default
```

Notice the `await`: because jobs can be scheduled or awaited, a server can load
in the background while the agent keeps working.

Because the REPL and the editor share one environment, loading a server changes
what the editor knows. The moment `(await (load-mcp "playwright"))` returns, the
LSP has the new bindings: completion on `playwright/`, signatures on every tool,
documentation on hover. The agent doesn't need a manual for a server it just
loaded, it can ask the language itself. That's **progressive disclosure as a
native primitive** rather than an afterthought bolted on later, because the tools
become visible at exactly the moment they become available.

The same shared environment is what makes the REPL more than a convenience. State
survives between turns, so the agent can load a server once, poke at a tool to see
what it actually returns, keep the useful result in a variable, and build on it
later without paying for any of it twice.

### Context compression by construction

Another perk of owning the interpreter _and_ the REPL is that you can build in
context compression from the get-go. Each variable can only be read with
grep-like commands, and the results come paginated by default, so the LLM reads
exactly what it needs and nothing more.

This is especially helpful with browser automation over the Playwright MCP. Most
of the time a page snapshot arrives bloated with styling, JavaScript, and HTML,
which pollutes the context and drags you into the 30% "dumb zone" within a few
turns, if not one. Paginated, grep-able reads keep that bloat out.

There's also a read-only variable holding the entire conversation history that
the agent can pull input from. Think of a long number an open-source model would
surely hallucinate halfway through if it had to retype it.

## The fear: parentheses

One of the biggest fears I had with this whole approach was, drum roll... the
parentheses. I was afraid open models would always mess up Lisp's syntax, given
that a big portion of their training data is JS and Python.

It turned out fine. I was impressed by how well the proprietary models did with
the whole interpreter sitting in the system prompt, and by how well the open
models did when their output was constrained by the grammar. At first Claude made
at least one mistake before fixing its calls to the Lisp REPL, but with the
interpreter in the system prompt, things were smooth. I built the whole project
with coding agents, and the tests turned out to be straightforward: you
write Lisp code and expect it to do what it says.

## The LLM is not the agent

Which brings me back to the claim I opened with. The last missing piece is a
cognitive architecture that combines the power of LLMs with the symbolic nature
of the language: a separate memory module that extends the interpreter.

The LLM is _not_ the agent. It's part of a system where
every module does one job toward a shared goal. The best move is to leave the
imaginative, flexible parts to the LLM, and the rest to the symbolic
system, the Lisp. Just like the brain has two hemispheres.

I deliberately prefer "cognitive architecture" over "harness." _Harness_ is the
new kid on the block; _cognitive architecture_ goes back decades, a term backed
by real research.

## Still a work in progress

None of this is finished. The immediate next step is to benchmark the
neuro-symbolic architecture against its harness-style counterparts, but the
roadmap runs a lot further than that. Macros are the shallow end of code-as-data,
and I want to see how deep it goes: an agent that reads back its own programs as
data, spots the shape it keeps rewriting, and folds it into a form it can reuse,
building a vocabulary for a task as it works through it. Generative UI is another
thread worth pulling on: the agent renders its own interfaces and visualizes the
prelude and a run as they happen. Declarative agents are the bigger one, described
by what they should achieve, all in Lisp (just like how NixOS built the Nix language for OS configuration, you can think of lisptc as the declaration of orchestration of agents).

The whole thing should also grow in a cloud-native setup, a distributed file system the
agents can share, and Git woven in so that every change an agent makes is
versioned, reviewable, and reversible.

But honestly, this is just the tip of the iceberg. At this point, anything you can
imagine needing to build an agent around an LLM can be implemented neatly in this
system, and the LLM finally gets to do only the part it's actually good at.
