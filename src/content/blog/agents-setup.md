---
title: 'A gay AI agents setup'
description: 'since absoloutly no body asked me how I use my agent for coding tasks, here I am writing a blog in details about it.'
pubDate: 2026-09-27
category: 'tech'
tags: ['agents', 'dev']
tldr: 'agents are forbidden from writing docs and comments, scripts run in ci checking that dependency flow is respected, jit docs with artifacts, vibe feature -> test feature -> like feature -> write tests -> refactor but keep tests working'
draft: true
---

since absoloutly no body asked me how I use my agent for coding tasks, here I am writing a blog in details about it.

lately while developing lisptc a language for AI agents I decided to fully agentically engineer the soloution, no handwritten code, that doesn't mean that I am going to follow the vibe-coded app path where I let agents do whatever they want,
its going to be I design, you code.
I do the thinking and outsource the work to agents.

giving up code completly to agents meant that I have to make sure to setup the right harness and develop the right tools that would keep things under control, I dont want to end up 2 months down the line with a mess that no one can debug even the agents that built it.

the thing is that one bad practice in your code is the context for the next agent, which is going to follow the same bad practice +1, this is the failure mode that most vibe coded code bases usually fall into, thinking that agents are immune of technical debt, nothing is immune of technical debt.

## forbid comments and dev docs they are obsolete

code is the only source of truth, this meant less context the agent read, AGENTS.md only contain pointers toward where things are in the code base, no implmentation details, if the agent need certain details about the implmentation it has to read the code (since the code doesnt have comments) its less.

agents instead of actually adding the functionality would stick a comment on top pretending that it already work, missguiding any other agent that actually read the context,

comments are made for human since thay cant hold enough in working memory, agents dont need comments

how I enforce this in the codebase:

- check comments script that strips all comments and fail ci in case there was an added comment

- rule in AGENTS.md that forbids comments

- a whole codebase with no comments, agents tend to follow the convention of the code read

## no implmentation details in `AGENTS.md`

this one is a bit tricky to enforce since llms love wasting tokens rambeling about implmentation details, this becomes a technical burden and a place of confusion, I never read the docs the agent write, instead I ask agent to go and produce an interactive artifact about how somthing works, data flow, dependency, pros, cons and tradeoffs

dev docs now become just in time, from the code directly, interactive and scopped, ask exactly what you need to know, and in five minutes you have it, this is supporior big time than having to maintain seperate docs that keep growing, drifting and missguiding your agents.

in ci I make sure that any change to `Agents.md` is only pointer toward what is there not how it works and implmentation details by running jev classification on each hunk of change.

another script goes through all the `AGENTS.md` files in the repo and check that any file path, class name, or function name actually exist in the repo and that it didnt get renamed or removed, in case of failure that agent is instructed to fix the file.

## boundaries and dependencies

for lisptc I sat up a monorepo with turbo repo, you have `apps/` and `packages/`, a feature that I discovered lately on turbo is called `boundaries`

which allows you to define rules of how your apps and packages can depend from one another, this mean you can setup groups, deny and allow dependency between these groups.

I run `turbo boundries` in ci checks as well as in pre-push hook to make sure that everything is following my rules.

for rules that turbo boundaries cannot enforce I have a seperate script `check-arch`
which checks that they are enforced

## test driven refactors

as I develop the product, I ask an agent to add a new functionality I describe how it has to work, the agent goes and addes the functionality, I dont care how, we iterate, I test the feature, modify it, once I like it, I commit to it by asking to generate tests that the feature passes, tests are written and they pass, now I turn my eye to the implmentation, I read the code, ask the agent to breife me about its changes and how it works and all the workarounds it used, I then propose a better design, a architecture choice, a technology choice, the right abstraction and the refactor work starts, we have the tests as guidelines that the refactor didnt change the feature.

## closing the loop with traces

since my application is based on natural language interaction, I collect these conversations using posthog,
which allows me to run a bunch of scouting agents that look for signal to enhance the product,
somtimes I would just pull a list of traces and their users reports and try to extract new functionality that I can add to my product to avoid repeating the mistake, since the product is also a programming language, I can directly go from traced into new builtins in the language, better errors reports, better built in context compaction and sometimes completly new features.

## Dashicodes a dashboard to visualize technical debt

## less technical debt means better agent code

if your codebase has a clear architecture, good design pattrens, good news that is going to be
a good signal that your agents are going to follow in order to generate simlair code, followin good pattrens.

same can be said about bad pattrens, allow for a cyclic import once, solve it with a lazy load one time, come back 2 days later and your codebase is full of this pattren.

## check for code duplication

using tools like [fallow](https://fallow.tools/) you can detect code duplication, dead code these can be your signals for better abstractions and shared logic

agents are nutourisly good for creating whole functions to do the same thing with some extra spice or changes
making your codebase a headache to change, you need to keep track of every occurance of that piece of logic, always push for healthy abtractions and reusable logic whenever you spot an opportunity.

having scouting agents that occusianly kick off and look for these opportunities is a wise approach that will help you automate this task, however it stays important to keep an eye on the code and try to find these yourself.
