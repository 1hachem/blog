My mission for the last 3 year was to build an all in one ai automation soloution that non technical experts (in different industries) can use in order to embed thier exeprtise and they way they work into ai automations, hybrid-ai.

it started with yourscrib.ai where I had extensive meetings with [Alexandre Jardin](https://fr.wikipedia.org/wiki/Alexandre_Jardin) where he explained to use his methodlogy of coming up with ideas for his books, how to find universel subjects and emotions that you can share with your audiance, how what matters is that subjects, emotions and opinions, the opinions have to be contrarian conterversial and deeply yours, it should be your deepest secrets and desires, how to do a psyche analysis to find these emotions and opinions, how then the plot is just a veil that you throw on top to hide the story, show not tell, how any plot can work once you find your true feelings and opinions regarding a subject of intereset for you.

I took all these desicussion and iterated on a ai product that finally ended up with three steps, chat which plays a psychiatrist role asking questions with the objective of extracting these emotions from you (system prompt was too good we got messages from users saying that the chat session left them in tears).

after that comes the scinario building, a graph based editor where the writer can generate descriptions for different scenes and chapter, and experiment with different paths of the story, here comes the maximum shit load method (which is used extensivly by netflix), and that of asking what is the thing that will make the life of my charcter harder, and you chose that path, keeping the audiance at the edge of thier seats (used cautiously as it)

then finaly the editing phase where the actual writing happens, and you get tools to generate content, change tone and style and get reviews from an editor like chatbot.

the product found a very welcoming user base of mid aged french amateur writers who wanted to write thier autobiographies and connect to the world with thier stories.

with the help of my coleague [ouassim](https://www.ouassim.tech/) we went from ink on paper, meet discussions into a product that generated thouseds of dollars in revenue, but that was in no regard proudction ready, with no seniors around we had to make-do, and learn along the way.

with this little success and traction in our hands but that had no technical moat (it was system prompts on top of gpt-4 and react flow) we knew that we had to try somthing more ambetious and generalist, an app that would allow non technical users build any kind of automations not just with writing.

this is where I started working on hyko workflows, drag and drop a la zapier and make, with typed multi connection nodes (string, intergere, list ...) each type color coded, you have ai nodes, we wanted to be the ai native alternative to zapier and 8n8, ai tasks such as video transcription,text generation, summarization as well as utility nodes to concat strigs or to split

the initial implmentation was a huge over-kill, each node runs in its own docker container, and users need to run a pirviliged local script that would install docker, and connect its socket to our web app in order to spin docker containers, pull images that would run hugging face depth estimation models on the user's gpus (or just concat), all becuase we didnt know how to scale it, and we had little knowledge that what we were trying to build is a worker queue architecture that is well known and solved for.

we implementated our own DAG execution in an unorthodox fashion using python asyncio futures and async generators, it was the wild west, the product workflows worked we could do amazing things with them but the execution was taking too long with all the heavy docker lifting.

we had to write a custom script that would walk all the nodes defintions and build images for them, later one this evoloved and had to mess with pydantic json schema and god forbids python AST ..... it was the wild west.

this is where we started understanding what we are actually trying to build and transitioned to using redis queue workers (arq, async redis queue more precisly since we were still fans of our DAG async generators executors)

by this time I was graduating as an AI engineer, with no seniors above us I became the "CTO" as soon as I finished my studies, at that time I didnt have any idea what a CTO does, no role models, I did all the text books mistakes.

the bussiness plan was that talent is cheap in algeria, but only junior talent, sinors and intermediant knew better, and were landing remote jobs that got them 10x more financial outcomes, I myself got simlair offers as soon as I marked a 1 year experience, 90% of the juniors I helped in recruiting and that I managed as soon as they mark a 1-2 years of experience they get easily poached, we were bleeding talent, tacit knowledge and technical know how, and not just us but the whole tech marekt in the country was faced with this churn, building was practicly impossible.

I chose to stick since I was learning like nowhere else, the CTO position pushed me to take over responsbilities, switch carear paths from (AI to full stack), learn about design patterns, tech team management, reviews, sprints, documentation, ci/cd, cloud, customer support, investors and pitchs, bussiness plans I was always pushed out of my comfort zone.

not to mention that I got (a laughable) 0.5 stock options offer with a 2 years cliff, that I thought at the time was somthing

at this stage still with no need to run a custom script, with a worker queue in place, we were nowhere near producntion ready and worse our paying clients were finding the app too complicated, what is loop mode, what is a fractal (nested flows), why is this node not connecting to this one (type missmatch), lists, strings where confusing, concat was magic.

what appeared to be user friendly to us was too complicated for the non technical user.

and here we lost all the key hires, now am left alone, with a frontend that saves server state in a zustand store, a toolkit that is marshled with AST, and a deployment that runs with docker compose on coolify.

heads down time to focus and only care about building, build build build (with a 0.5% stock that only unlocks after 2 years, and that has hedious clawbacks to buy my shares with 90% discount in case of "faute grave")

by this time I tried to workaround this issue by building a copilot chatbot that build the workflow instead of the user, it has a virtual blueprint that we validate the changes against (inspired by reacts virtual dom), by this time we also introduced (https://github.com/revoltez) who helped imensily in transitioning us to kubernetes which in came in very handy later on (in the pivote I am about to talk about).

things started looking better technically but sales never did worse, the few clients we had were chruning like crazy, and it was getting harder and harder to find new prospects

The CEO and sales manager at the time was always trying scales sales early with sort of "financial power moves", "feedback loops" I trusted his "trust my 20 years of experience" but always felt like somthing is off.

sales was upside down, they were also commiting every text book error, only later when I started listening to YC school episoded, dalton and michael, NAVAL, and others that it became clear that sales were absoloution wrong about thier approach.

I instead chose to listen to customer feedback and compliant and decided it was time to pivot from a workflow drag and drop to a chatbased approach, MCP was 4 months old at the time, kuberentes came in helpful as we used its node sdk to deploy mcps on demand, deploy browser containers that agent controlled using the playwright mcp, stream what the agent did using VNC protocol, we learned from our mistake, it was one monorepo, everything in typescript one language.

with this pivot we got more clients new possibilities and we generated our first 4k MRR that turned into a 32k gross volume, hyko finally started paying for it bills after more than 2 years trying.

this time I started reading more about startup mistakes, finances, I started finding ways to build financial bussiness plans with code (pyexcel) (I dont know how to use excel and you should too) (checkout ./execel.md which is going to be another blog that you will link it here).

the goal was that I had to prepare a "convienscing" bussiness plan for an investor meeting, I knew nothing so I did what programmers do, I googled, and read the docs

used claude in order to generated the sheets and make them easily customizable (which produced modular and more adaptable sheets than the bankers who made the prvious bussiness plan, all credits due to them thier artifact really helped lay that work ground for me)

this is when troubles beginn, when I raised my head outside of my lane, at first it was ok because it was helpfule but when I understood that the sales is upside down, and that the tech team was secrewed all over with thier stock options, that we our equity split, sales process, bussiness plan, mindset is a recipie for disaster

by this time we had developed a "radical honesty" cluture at the company, we were in the bussiness of transforiming organizations with AI, we knew that we had to transform oursleves first all the time, and transformating can only start with an honest disscussion between each one of us of that shortcomings of the other (technically, communcation wise, hygines, you name it) only by being the miror of one another can we transform, only by transforming can our bussiness sccuessded

everying loved practicing this it made things more clearer, manifestors where drafted left and right to align the processes, reviews where drama-free, and working became much more fun ... excpet for sales team, and for found equity.

for them radical honesty and I quote was "evil" and a "devil making", sales was and is always trying to convience someone to buy something no matter how, you need a little bit of flexibility.

we wanted to creep this radical honesty to the sales process, no more trying shove the soloution at the clients mouth, if it doesn fit thier need we redirect them to an alternative, no more sugar coating, this is founder led growth and it should relay on genuine connection and obsession of solving the clients problem no matter whether we end up with "self-host" or a reroute to an alternative solution.

at this point I was 100% convienced that there is no major tricks or financial powermoves, no major collaboration with consulting group, a telco compay, or a trainning center that would build a product that people need and pay for, it was actually as PG puts it "do things that dont scale"

the 20 years of experience and financial shenigens and factors no longer had an effect on me and I entered in a clash with the status quo of the sales team.

equity split was a major issue, and as soon as we tried to address it (despite the appearence of openess) no amount of talk, and of show of good incentives and of effort and focus on the product, no amount of group talks about trust and inhireted traumas (@claude link to blog about this create the entery) were enough to reach an agreement, the incentives didnt align, and all of sudden and friendly discussions became charged, sychological games, guilt tripping, sunk cost, silent treatments, exclusion, calomny, stage setting, and leactures about what is actually a product where I get the lowst point (it turns out I am the leaset person to understand what a product is)

all of suddent the "founder" thinks that the technical execution of the product is the issue with sales, and that 90% of what we sold is actually thanks to his network, mtholdology, time and so little is the actual product

I took that as a direct attempt to diminish our (tech team) contribtions the moment we asked to reconsider the equity split

the next thing I knew was that the CEO organized a technical audiot with a "senior" developer from france (that I never thought we could afford), without even interviewing him to check if he is really qualified me the CTO was the last to hear.

the whole mission pitch that hooked me in the first place was the state of the art technology or fine tech products were never built from a place like algeria not becuase we couldnt it was becuase everyone else (includeing us) thought we couldnt and we wanted to challenge that belief, for talent to come together and for investors to invest

it turned out the problem is much bigger than that and now its clear for me that building a fotware product will not solve it,

which leaves me with a resentful boss, a 0.5% quity, a third world country, stress in my guts, a 2 years old that thinks I come with a laptop attached to my hand and 0 savings, and a mission that I no longer believe in ... eeeeh no thanks, time for the next thing

was it worth it, minus the stress that was not necessary from my part, yes, every interaction, geninune connection, I learned to love my craft and to love the people I work with, I learned more about people and what drives them, about clients and what they want, investors and what they look at, and I have an arsenal of tips and tricks that I will take with me for the next adventure as well as a a bag full of job and happy moments and memories I had.

to all the people I worked with (except for 1 how is a pathological liar) I love you
to the CEO who taught me more with his right doings than his mistakes I love you

to my wife whome work stole me from her and whome support was unparalel I love you

to allah who made this journey for me I love you
