---
title: 'Why I left BigMama'
description: 'Three years, two pivots, one CTO title I had no idea how to hold, and the slow realization that a software product was never going to fix the thing I actually wanted to fix.'
pubDate: 2026-08-16
category: 'startup'
tags: ['startups', 'career', 'ai', 'algeria', 'founders']
---

For the last three years my mission was a single idea: build an all-in-one
AI automation platform that non-technical experts — people with deep domain
knowledge in wildly different industries — could use to embed their
expertise and their way of working into AI automations. Hybrid AI. Human
judgment on top, machine execution underneath.

This is the story of how I chased that idea through two products and two
pivots, ended up as a CTO who didn't know what a CTO was, and eventually
walked away. It's long, because it was long.

## Act I — YourScrib: teaching a machine to make people cry

It started with YourScrib.ai.

I had a series of extended meetings with the novelist
[Alexandre Jardin](https://fr.wikipedia.org/wiki/Alexandre_Jardin), who
walked me through his entire methodology for coming up with ideas for his
books. How to find universal subjects and emotions you can share with an
audience. How what really matters isn't plot but *subjects, emotions, and
opinions* — and how those opinions have to be contrarian, controversial,
and deeply yours. Your secrets. Your desires. He described doing a kind of
psychoanalysis on yourself to surface those emotions, and then treating the
plot as just a veil you throw over the real story. Show, don't tell. Any
plot can work once you've found what you actually feel about something you
care about.

I took all of that and iterated it into an AI product with three stages:

1. **Chat.** A chatbot playing the role of a psychiatrist, asking questions
   designed to extract those buried emotions. The system prompt worked
   almost too well — we got messages from users saying a chat session had
   left them in tears.
2. **Scenario building.** A graph-based editor where the writer could
   generate descriptions for scenes and chapters and experiment with
   different paths through the story. This is where we leaned on the
   "maximum shitload" technique Netflix uses so heavily: at every fork, ask
   *what would make my character's life hardest?* — and take that path.
   Keep the audience on the edge of their seats. (Used with care.)
3. **Editing.** The actual writing, with tools to generate content, shift
   tone and style, and get feedback from an editor-like chatbot.

The product found a warm, unexpected audience: middle-aged French amateur
writers who wanted to write their autobiographies and connect to the world
through their stories.

With my colleague [Ouassim](https://www.ouassim.tech/), we took the thing
from ink-on-paper conversations to a product that generated thousands of
dollars in revenue. It was, by any honest measure, nowhere near
production-ready. With no seniors around, we made do and learned as we went.

But it worked. And it taught us the lesson that started everything else: we
had a little traction, and no technical moat — it was really just system
prompts on top of GPT-4 and React Flow. So we decided to try something more
ambitious and more general. An app that would let non-technical users build
*any* kind of automation, not just writing.

## Act II — Hyko: the overbuilt years

This is where I started building **Hyko workflows**: drag-and-drop
automation à la Zapier and Make, with typed, multi-connection nodes —
string, integer, list, and so on — each type color-coded. AI nodes for
video transcription, text generation, summarization. Utility nodes to
concat strings or split them. We wanted to be the AI-native alternative to
Zapier and n8n.

The first implementation was a spectacular overkill. Every node ran in its
own Docker container. Users had to run a privileged local script that
installed Docker and connected its socket to our web app so we could spin
up containers on their machine — pulling images that ran Hugging Face depth
estimation models on the user's own GPU (or, you know, concatenated two
strings). We did all of this because we didn't know how to scale it, and we
didn't yet realize that what we were building was a *worker queue* — a
well-known, long-solved architecture.

We implemented our own DAG execution in a deeply unorthodox way, using
Python asyncio futures and async generators. It was the wild west. The
workflows genuinely worked and we could do amazing things with them, but
execution was painfully slow under all that Docker lifting. We wrote a
custom script to walk every node definition and build images for them;
later that evolved into wrangling Pydantic JSON schemas and — God forgive
us — the Python AST. The wild west, again.

That pain was also the education. Slowly we understood what we were actually
building, and moved to Redis queue workers (arq — async Redis queue,
because we were still attached to our beloved async-generator executors).

### Becoming a "CTO"

Around this time I graduated as an AI engineer. With no seniors above us, I
became "CTO" the moment I finished my studies. I had no idea what a CTO
does. No role models. I made every mistake in the textbook, and then some.

The business plan rested on an assumption: talent is cheap in Algeria. But
that was only true for *junior* talent. Intermediates and seniors knew
better and were landing remote jobs paying 10x more. I got the same kind of
offers myself the moment I hit one year of experience. Roughly 90% of the
juniors I helped recruit and managed got poached the moment they crossed
one or two years. We were bleeding talent, tacit knowledge, and technical
know-how — and it wasn't just us. The whole tech market in the country was
churning like this. Building anything durable was almost impossible.

I stayed anyway, because I was learning like nowhere else. The CTO role
forced me to take on responsibilities and switch career tracks — from AI to
full-stack — and to learn design patterns, team management, reviews,
sprints, documentation, CI/CD, cloud, customer support, investor pitches,
and business plans. I was constantly outside my comfort zone.

I was also given a laughable 0.5% stock option grant with a two-year cliff,
which at the time I thought was something.

### The product was "friendly" — to us

Even with the worker queue in place and no more local scripts, we were
nowhere near production-ready. Worse, our paying clients found the app too
complicated. What's loop mode? What's a fractal (nested flow)? Why won't
this node connect to that one (type mismatch)? Lists, strings — confusing.
Concat was *magic*.

What looked friendly and elegant to us was bewildering to the non-technical
users we'd built it for. That's a hard thing to see when you're inside it.

And then we lost all our key hires. Suddenly it was just me: a frontend
that stored server state in a Zustand store, a toolkit marshaled with the
AST, and a deployment running on Docker Compose via Coolify.

Heads down. Build, build, build. (On a 0.5% grant that only vested after two
years, with hideous clawbacks that let the company buy my shares back at a
90% discount in case of *faute grave*.)

### Digging out

I tried to work around the complexity problem by building a copilot chatbot
that would build the workflow *for* the user, validating changes against a
virtual blueprint — inspired by React's virtual DOM. Around this time
[revoltez](https://github.com/revoltez) joined and helped immensely,
including moving us to Kubernetes, which would matter enormously in the
pivot that came next.

Technically, things started looking better. Sales, though, never did — if
anything they got worse. The few clients we had churned relentlessly, and
new prospects got harder and harder to find.

## Act III — The pivot that finally paid

The CEO, who was also the sales manager, kept trying to force sales early
with "financial power moves" and "feedback loops," always leaning on "trust
my 20 years of experience." I trusted it, but something always felt off.

Sales were, in fact, upside down. Every textbook error. I only understood
how wrong the approach was later, listening to YC's *Startup School* —
Dalton and Michael — and to Naval and others. It became clear the sales
strategy was fundamentally mistaken.

So I did the opposite: I listened to customer feedback and complaints, and
decided it was time to pivot from a drag-and-drop workflow builder to a
chat-based approach. MCP was four months old at the time. Kubernetes came
in handy — we used its Node SDK to deploy MCP servers on demand, spin up
browser containers that an agent controlled via the Playwright MCP, and
stream what the agent did over VNC. We'd learned from our mistakes: one
monorepo, everything in TypeScript, one language.

And it worked. The pivot brought new clients and new possibilities. We hit
our first **4k MRR**, which turned into **32k in gross volume**. After more
than two years of trying, Hyko finally started paying its own bills.

## Act IV — Raising my head above the lane

Buoyed by that, I started reading about startups — the mistakes, the
finances. I taught myself to build financial models in code with PyExcel (I
don't know how to use Excel, and honestly, neither should you — that's a
[separate post](/blog/excel)). I needed a convincing business plan for an
investor meeting and I knew nothing, so I did what programmers do: I googled
and read the docs. I used Claude to generate the sheets and make them
modular and easy to customize — more adaptable, in the end, than the plan
the bankers had made for us before. (Full credit to them; their artifact
laid the groundwork I built on.)

This is where the trouble started. The moment I raised my head above my own
lane.

At first it was fine, because it was helpful. But once I understood that
sales was upside down, that the tech team was getting quietly screwed on
their stock options, and that our equity split, sales process, business
plan, and mindset together formed a recipe for disaster — I couldn't
un-see it.

By this point we'd built a **radical honesty** culture. It was wonderful,
and it worked everywhere except the two places it most needed to: sales, and
founder equity. I've written about how [that culture ended up destroying the
company](/blog/radical-honesty), so I won't repeat the whole thing here. The
short version: as long as honesty was pointed at code and process, everyone
loved it. The moment it was pointed at the equity split, it became a weapon.

By then I was fully convinced there was no trick, no financial power move,
no magic partnership with a consulting group or a telco or a training center
that would substitute for building a product people need and pay for. It was
exactly what Paul Graham says: *do things that don't scale.* The twenty
years of experience and the financial shenanigans no longer had any hold on
me, and I ended up in open conflict with the status quo of the sales team.

## Act V — The unraveling

Equity was the core issue. And the moment we tried to address it — despite
all the surface-level openness — nothing worked. No amount of good
incentives, effort, and focus on the product. No amount of group
conversations about trust and inherited traumas. The incentives didn't
align, and the friendly discussions turned into psychological games, guilt
trips, sunk-cost appeals, silent treatment, exclusion, slander,
stage-setting, and lectures about what a product *really* is — in which I,
the CTO who led the team of three that had actually built the thing, somehow
came out as the person least qualified to understand it.

All of a sudden the founder decided that the *technical execution* was the
real problem with sales — that 90% of what we'd sold was thanks to his
network, his methodology, and his time, and that so little of it was the
actual product. I took that for exactly what it was: a direct attempt to
diminish the tech team's contribution, arriving precisely the moment we
asked to revisit the equity split.

The next thing I knew, the CEO had organized a technical audit with a
"senior" developer from France — someone I never imagined we could afford —
without interviewing him to check whether he was even qualified. Me, the
CTO, was the last to hear about it.

The whole mission that hooked me in the first place was this:
state-of-the-art technology and genuinely fine products were never built
from a place like Algeria — not because we *couldn't*, but because everyone,
ourselves included, believed we couldn't. We wanted to challenge that belief. To make
talent come together and investors invest.

It turned out the problem was much bigger than that. And it's now clear to
me that building a software product will not solve it.

## Leaving

Which left me with: a resentful boss, 0.5% equity, a third-world country,
a permanent knot of stress in my gut, a two-year-old who thinks I come with
a laptop attached to my hand, zero savings, and a mission I no longer
believed in.

Yeah — no thanks. Time for the next thing.

Was it worth it? Minus the stress, most of which I brought on myself: yes.
Every interaction, every genuine connection. I learned to love my craft and
to love the people I worked with. I learned more about people and what
drives them, about clients and what they want, about investors and what
they look at. I walk away with an arsenal of tips and tricks for the next
adventure, and a bag full of good, happy memories.

To everyone I worked with (except the one pathological liar): I love you.
To the CEO, who taught me more with his right doings than with his mistakes:
I love you. To my wife, whom this work stole me from, and whose support was
unparalleled: I love you. And to Allah, who made this journey for me: I love
you.

Time for the next thing.
