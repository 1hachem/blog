---
title: 'lisptc — a Lisp built for AI agents'
description: "Anthropic's post on programmatic tool calling sent me down a rabbit hole: instead of calling tools in a loop, the agent becomes a programmer. So I built a Lisp from the ground up to be the language it writes in, and to make the case that the LLM is not the agent."
pubDate: 2026-08-16
category: 'tech'
tags: ['ai', 'agents', 'lisp', 'interpreters', 'neuro-symbolic', 'mcp']
ogImage: 'og2'
---

Anthropic's [blog post](https://www.anthropic.com/engineering/advanced-tool-use) about programmatic tool calling shed light on a better
way to use AI agents. Instead of calling tools in a loop, the agent becomes a
programmer: it writes the function calls and the logic in a language of its
choice, and the runtime executes them.

This is the story of how I went down a rabbit hole of sandboxing, interpreter
design, and Lisp (a programming language from 1958), and came out the other side
with **lisptc**, a small Lisp built specifically for AI agents: interpreter,
LSP, formatter, and REPL.

But the tooling is only half the story. The real claim underneath all of it is
this: the LLM is _not_ the agent. It's one module in a larger system, and the
Lisp is what lets the other modules exist. Hold onto that; I'll come back to it.

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

## Why programmatic tool calling wins

The advantages compound quickly:

- **Fewer tokens.** No JSON-schema boilerplate wrapping every call. No giant
  system prompt describing every tool up front.
- **Real control flow.** You can call a tool inside a `for` loop instead of
  relying on the model to fire off N separate calls by hand.
- **Variables.** Intermediate data can be stored and passed around without
  ever loading it back into the model's context.
- **Integration.** Huge ecosystems of libraries and SDKs the agent can reach
  for.

The only serious downside I can think of is security. The code the agent
executes can be malicious in plenty of ways: the user might _want_ it to be, a
prompt injection might slip in, or the agent might just write code that never
stops eating host resources.

## The untrusted-code rabbit hole

That's the well-known problem of untrusted code execution, and it drops you
straight into a rabbit hole of decades of work on sandboxing and isolation. It's
still a standing problem, only ever _mitigated_, never solved, and every current
solution piles a considerable amount of complexity onto your stack.

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
today's programming languages, and it's notoriously known for making better
programmers. And the questions John McCarthy was
wrestling with back then, when the whole point was symbolic reasoning for
machines, map almost perfectly onto what an agent language needs now:

- What if a program were written in the very same form as the data it operates
  on, so that code and data became interchangeable?
- What is the smallest handful of irreducible primitives from which every other
  operation can be built?
- Could a language be simple enough to describe its own evaluation, to act as
  its own interpreter?
- And what if you threw out elaborate syntax altogether, so that a program was
  just a list?

Sixty-odd years later, each answer earns its keep here. Code-as-data lets the
agent generate, inspect, and rewrite its own programs as ordinary structures,
which is exactly what makes macros and context compression so cheap. A handful of
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

Along the way I needed a language server, which turned out to be fairly easy with
[vscode-languageserver](https://github.com/microsoft/vscode-languageserver-node)
(despite the name, it works with any modern editor), and a formatter, where
[Topiary](https://topiary.tweag.io/) had my back with a spec-driven one.
Everything got packaged into a Nix flake, and I was genuinely impressed by how
easy it all was, all thanks to the genius minimalism of Lisp's design.

## What owning the whole stack buys you

Here's the part I didn't fully expect. Because I owned the interpreter _and_ the
REPL end to end, capabilities that are expensive bolt-ons everywhere else came
almost for free. Each one below is less a feature I built than a property that
fell out of the design.

### Grammar-constrained output

The best part is that I can _force_ the model's output to conform to the Lisp
syntax. `llama.cpp` uses the [GBNF](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)
format: you describe the language's grammar and generation rules, pass it in with
your API call, and the model can only emit a token that satisfies the grammar.
Not every provider exposes this passthrough, and I can only name a few that do;
[Fireworks AI](https://docs.fireworks.ai/structured-responses/structured-output-grammar-based)
is one. Maybe at some point I'll have to self-host these models myself.

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
function, with LSP support too, since the REPL is shared with the editor.
Discoverability comes along for the ride: search predefined servers, or find
tools inside a loaded one. This is **progressive disclosure as a native
primitive**, instead of an afterthought bolted on later.

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
interpreter in the system prompt, things were smooth. The whole project was
generated with coding agents, and the tests turned out to be straightforward: you
write Lisp code and expect it to do what it says.

## The LLM is not the agent

Which brings me back to the claim I opened with. The last missing piece is a
cognitive architecture that combines the power of LLMs with the symbolic nature
of the language: a separate memory module that extends the interpreter.

That's the real thesis. The LLM is _not_ the agent. It's part of a system where
every module plays a role toward an objective. The best move is to leave the
imaginative, creative, flexible parts to the LLM, and the rest to the symbolic
system, the Lisp. Just like the brain has two hemispheres.

I deliberately prefer "cognitive architecture" over "harness." _Harness_ is the
new kid on the block; _cognitive architecture_ is deeply rooted, a term you can
draw decades of research from.

## Still a work in progress

None of this is finished. The immediate next step is to benchmark the
neuro-symbolic architecture against its harness-style counterparts, but the
roadmap runs a lot further than that. I want to experiment with generative UI, so
the agent can render its own interfaces and visualize the prelude and a run as
they happen. I want declarative agents, described by what they should achieve
rather than wired together by hand. And I want the whole thing to grow into its
environment: a cloud-native setup, a distributed file system the agents can
share, and Git woven in so that every change an agent makes is versioned,
reviewable, and reversible.

But honestly, this is just the tip of the iceberg. At this point, anything you can
imagine needing to build an agent around an LLM can be implemented neatly in this
system, and the LLM finally gets to do only the part it's actually good at.
