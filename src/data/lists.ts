export interface ListItem {
	title: string;
	note?: string;
	href?: string;
}

export interface Category {
	name: string;
	items: ListItem[];
}

export interface List {
	slug: string;
	heading: string;
	blurb?: string;
	categories: Category[];
}

export const lists: List[] = [
	{
		slug: 'books',
		heading: 'books',
		blurb: 'things worth reading twice',
		categories: [
			{
				name: 'fiction',
				items: [
					{
						title: 'The Brothers Karamazov',
						note: 'Dostoevsky — faith, doubt, and everything between',
					},
					{ title: 'The Left Hand of Darkness', note: 'Ursula K. Le Guin — winter and gender' },
					{ title: 'Blood Meridian', note: 'Cormac McCarthy — beautiful and merciless' },
				],
			},
			{
				name: 'ideas',
				items: [
					{
						title: 'Gödel, Escher, Bach',
						note: 'Douglas Hofstadter — strange loops all the way down',
					},
					{ title: 'Thinking in Systems', note: 'Donella Meadows — rewired how I see feedback' },
					{ title: 'Meditations', note: 'Marcus Aurelius — a Stoic talking to himself' },
				],
			},
			{
				name: 'craft',
				items: [{ title: 'The Pragmatic Programmer', note: 'Hunt & Thomas — still the baseline' }],
			},
		],
	},
	{
		slug: 'movies',
		heading: 'movies',
		blurb: 'films I keep recommending',
		categories: [
			{
				name: 'sci-fi',
				items: [
					{ title: 'Blade Runner 2049', note: 'Denis Villeneuve — loneliness in neon' },
					{ title: 'Arrival', note: 'Denis Villeneuve — grief told out of order' },
				],
			},
			{
				name: 'drama',
				items: [
					{ title: 'Whiplash', note: 'Damien Chazelle — obsession as a drum solo' },
					{ title: 'The Social Network', note: 'David Fincher — ambition at 24fps' },
					{ title: 'Spirited Away', note: 'Hayao Miyazaki — the one I rewatch most' },
				],
			},
			{
				name: 'thriller',
				items: [
					{ title: 'No Country for Old Men', note: 'Coen Brothers — dread with a coin flip' },
					{ title: 'Parasite', note: 'Bong Joon-ho — the basement and the stairs' },
				],
			},
		],
	},
	{
		slug: 'camping-spots',
		heading: 'camping spots',
		blurb: 'places worth pitching a tent',
		categories: [
			{
				name: 'mountains',
				items: [
					{ title: 'Tikjda', note: 'Djurdjura, Algeria — cedar forest and cold nights' },
					{ title: 'Lac Noir', note: 'Kabylie — glassy water at sunrise' },
					{ title: 'Chréa plateau', note: 'Blida — pines and a sea of fog below' },
					{ title: 'Theniet El Had', note: 'Tissemsilt — the deodar cedar national park' },
				],
			},
			{
				name: 'coast',
				items: [{ title: 'Gouraya cliffs', note: 'Béjaïa — wake up over the Mediterranean' }],
			},
			{
				name: 'desert',
				items: [{ title: 'Tassili dunes', note: 'Djanet — silence and an ocean of stars' }],
			},
		],
	},
	{
		slug: 'series',
		heading: 'series',
		blurb: 'shows on my radar',
		categories: [
			{
				name: 'excited for',
				items: [
					{
						title: 'Neuromancer',
						note: 'Apple TV — Gibson’s cyberpunk classic, finally on screen',
						href: 'https://www.youtube.com/watch?v=g79GPZSQHBk',
					},
				],
			},
		],
	},
	{
		slug: 'tools',
		heading: 'tools',
		blurb: 'software and gear I reach for daily',
		categories: [
			{
				name: 'software',
				items: [
					{ title: 'Neovim', note: 'editor — muscle memory I can’t undo' },
					{ title: 'tmux', note: 'terminal — every project is a session' },
					{ title: 'Claude Code', note: 'pair programmer that actually ships' },
					{ title: 'Obsidian', note: 'notes — my second brain, in markdown' },
					{ title: 'Nix', note: 'reproducible everything, eventually' },
					{ title: 'Raycast', note: 'launcher — the command palette for my life' },
				],
			},
			{
				name: 'gear',
				items: [{ title: 'Fujifilm X100V', note: 'the camera I actually carry' }],
			},
		],
	},
];

export function getList(slug: string): List | undefined {
	return lists.find((list) => list.slug === slug);
}

/** Flattened item titles across all categories, in order. */
export function previewTitles(list: List): string[] {
	return list.categories.flatMap((category) => category.items.map((item) => item.title));
}

/** Number of items shown per list on the /lists index preview. */
export const PREVIEW_COUNT = 3;
