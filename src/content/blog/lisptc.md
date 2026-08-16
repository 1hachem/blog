---
title: 'lisptc — a Lisp built for AI agents'
description: 'Anthropic''s post on programmatic tool calling sent me down a rabbit hole: instead of calling tools in a loop, the agent becomes a programmer. So I built a Lisp from the ground up to be the language it writes in.'
pubDate: 2026-08-16
category: 'tech'
tags: ['ai', 'agents', 'lisp', 'interpreters', 'neuro-symbolic', 'mcp']
---

Anthropic's blog post about programmatic tool calling shed light on a better
way to use AI agents. Instead of calling tools in a loop, the agent becomes a
programmer: it writes function calls and logic in a language of its choice, and
the runtime executes them.

Once you sit with that idea, it's hard to unsee. This is the story of how it
sent me down a rabbit hole — through sandboxing, interpreter design, and a
language from 1958 — and out the other side with a Lisp I built specifically
for AI agents.

## Why programmatic tool calling wins

The advantages compound quickly:

- **Fewer tokens.** No JSON-schema boilerplate wrapping every call. No giant
  system prompt describing every tool up front.
- **Real control flow.** You can call a tool inside a `for` loop instead of
  relying on the model to fire off N separate calls by hand.
- **Variables.** Intermediate data can be stored and passed around without
  ever loading it back into the model's context.

The only serious downside I can think of is security. The code the agent
executes can be malicious in many ways — the user might *want* it to be, a
prompt injection might slip in, or the agent might simply write code that never
stops eating host resources.

## The untrusted-code rabbit hole

That's the well-known problem of untrusted code execution, and it leads you
straight down a rabbit hole of decades of work on sandboxing and isolation.
It's still a standing problem — only ever *mitigated*, never solved — and every
current solution adds a considerable amount of complexity to your stack.

The root difficulty is this: trying to limit the power and access of a
*general-purpose* programming language is a hard task, and there is always a
workaround.

But there's another way to get exactly what you want. Instead of fighting to
strip capabilities *out* of an existing language, you build a language from the
ground up that never had the access you didn't want in the first place.

When Vercel (FU vercel) announced they'd built a language destined for AI agents, I got
geniunly excited for the tech. I hoped they'd optimized for prompt usage, designed around
zero-trust permissions, and baked in memory and MCP support. Instead it was a
flop — a side project the marketing team made a big deal of.

Nobody I knew of had built the thing I needed. So I stepped out of my comfort
zone and started reading about interpreters and programming-language design.
And waiting for me at the entrance was the perfect language for the job.

## Enter Lisp

Lisp. First developed in 1958 for AI research, its ideas went on to influence
most of today's programming languages — and it's famously good at making better
programmers. The design questions behind it map almost perfectly onto what an
agent language needs:

- What is the simplest way to build a syntax-less language?
- What is the minimum number of irreducible primitives?
- And the REPL workflow — that's a perfect fit for AI agents.

I found [Make a Lisp](https://github.com/kanaka/mal) (mal), an open-source
project for building Lisp interpreters across languages: C, JS, Python, Go, you
name it. The C implementation was around 500 lines. I was in awe. I realized I
could fit the *entire interpreter* into a system prompt — the agent could learn
the language inside out.

So I did exactly that. I cloned a TypeScript implementation, and with Claude
Code started modifying it into an in-memory REPL that I hooked up to a
[PI agent](https://github.com/parallel-ai). Along the way I needed a language
server — surprisingly easy with [vscode-languageserver](https://github.com/microsoft/vscode-languageserver-node) which unlike the name suggests can be used with any modern code editors — and a formatter, where
[Topiary](https://topiary.tweag.io/) gave me a spec-driven one. Everything got
packaged into a Nix flake.

I was genuinely impressed by how easy it was to build a language, a formatter,
and an interpreter — all thanks to the genius minimalism of Lisp's design.

## Constraining the model to valid syntax

The best part: I can *force* the model's output to conform to the Lisp syntax.
`llama.cpp` supports [GBNF](https://github.com/ggml-org/llama.cpp/blob/master/grammars/README.md)
grammars — you describe the language's grammar and generation rules, pass it in
with your API call, and the model can only emit a token that satisfies the
grammar.

Not all model provider supports this passthrough — only a handful of open models providers. 
[Fireworks AI](https://docs.fireworks.ai/structured-responses/structured-output-grammar-based) is one of the few I can name. At some
point I may have to self-host these models myself.

## Rediscovering the REPL

I hadn't touched a Jupyter notebook since I switched careers from AI engineer to
software engineer, and I'd forgotten how good the REPL model is. You debug and
test code *as you write it*; the REPL keeps context and gives you feedback.

For an AI agent this is fantastic. The agent gets instant feedback, and it was
*trained* on exactly this kind of execution — every notebook in its training
data works this way. Setting up my editor with the custom formatter, LSP, and
REPL was just as easy, giving me an adequate workbench to tear these scripts
apart and reassemble them. The minimal-by-default, easily-extendable nature of
the PI agent framework meant I had a chat TUI wired to my REPL from the get-go.

## Native MCP, the way it should be

Another feature that fell out almost for free: native MCP integration. You load
an MCP server — stdio or online — by calling `(await load-mcp ...)`. (Note the
async support, so tasks can be scheduled or awaited.) Once it loads, every MCP
tool is available as a plain function, with LSP support too, since the REPL is
shared with the editor.

Discovery functions come along for the ride: search for predefined MCP servers,
or find tools inside a loaded one. This is **progressive disclosure as a native
primitive**, instead of an afterthought bolted on later.

## Context compression by construction

Owning the interpreter *and* the REPL means you can build in context
compression from day one. Each variable is read with grep-like commands, and
results are paginated by default — so the LLM reads exactly what it needs and
nothing more.

This matters enormously with browser automation over the Playwright MCP. Most
of the time a page snapshot arrives bloated with styling, JavaScript, and HTML,
polluting the context and dragging you into the 30% "dumb zone" within a few
turns — sometimes just one.

There's also a read-only variable holding the entire conversation history, which
the agent can extract input from — think of a long number an open-source model
would surely hallucinate halfway through if it had to retype it.

## The fear: parentheses

My biggest fear with this whole approach was — drum roll — the parentheses. I
worried open models would forever fumble Lisp's syntax, given how much of their
training data is JS and Python.

It turned out fine. The proprietary models did remarkably well with the whole
interpreter sitting in the system prompt, and the open models did well when
their output was constrained by the grammar. Claude made at most one mistake
before correcting its calls to the Lisp REPL; with the interpreter in the
system prompt, it was smooth.

The whole project was generated with coding agents, and the tests turned out to
be straightforward: you write Lisp code and expect it to do what it says.

## The LLM is not the agent

The last missing piece is a cognitive architecture that fuses the power of LLMs
with the symbolic nature of the language — a separate memory module that extends
the interpreter.

That's the real thesis here. The LLM is *not* the agent. It's one module in a
system where every part plays a role toward an objective. The right move is to
leave the imaginative, creative, flexible work to the LLM, and the rest to the
symbolic system — the Lisp. Like the two hemispheres of a brain.

I deliberately prefer "cognitive architecture" over "harness." *Harness* is the
new kid on the block; *cognitive architecture* is a term rooted in decades of
research you can actually draw from.

This is still a work in progress. My objective is to benchmark this
neuro-symbolic architecture against its "harness" counterparts. The next step is
a cloud-native, declarative, neuro-symbolic AI agent platform that I'll use to
automate client use cases across two niches — Odoo and CAD software.

The platform stays generalist; the agents I build on top of it stay
specialized, one use case at a time. Each use case becomes its own funnel, its
own landing page, capturing its own clients — and each client unlocks a new use
case that folds back into the offer.

This is just the tip of the iceberg. At this point, anything you can imagine
needing to build an AI agent around an LLM can be implemented neatly in this
system.
