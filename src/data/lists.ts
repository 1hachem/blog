export interface ListItem {
	title: string;
	note?: string;
}

export interface List {
	slug: string;
	heading: string;
	blurb?: string;
	items: ListItem[];
}

export const lists: List[] = [
	{
		slug: 'books',
		heading: 'books',
		blurb: 'things worth reading twice',
		items: [
			{ title: 'Gödel, Escher, Bach', note: 'Douglas Hofstadter — strange loops all the way down' },
			{
				title: 'The Brothers Karamazov',
				note: 'Dostoevsky — faith, doubt, and everything between',
			},
			{ title: 'Thinking in Systems', note: 'Donella Meadows — rewired how I see feedback' },
			{ title: 'The Left Hand of Darkness', note: 'Ursula K. Le Guin — winter and gender' },
			{ title: 'Meditations', note: 'Marcus Aurelius — a Stoic talking to himself' },
			{ title: 'The Pragmatic Programmer', note: 'Hunt & Thomas — still the baseline' },
			{ title: 'Blood Meridian', note: 'Cormac McCarthy — beautiful and merciless' },
		],
	},
	{
		slug: 'movies',
		heading: 'movies',
		blurb: 'films I keep recommending',
		items: [
			{ title: 'Blade Runner 2049', note: 'Denis Villeneuve — loneliness in neon' },
			{ title: 'Whiplash', note: 'Damien Chazelle — obsession as a drum solo' },
			{ title: 'Spirited Away', note: 'Hayao Miyazaki — the one I rewatch most' },
			{ title: 'No Country for Old Men', note: 'Coen Brothers — dread with a coin flip' },
			{ title: 'Arrival', note: 'Denis Villeneuve — grief told out of order' },
			{ title: 'Parasite', note: 'Bong Joon-ho — the basement and the stairs' },
			{ title: 'The Social Network', note: 'David Fincher — ambition at 24fps' },
		],
	},
	{
		slug: 'camping-spots',
		heading: 'camping spots',
		blurb: 'places worth pitching a tent',
		items: [
			{ title: 'Tikjda', note: 'Djurdjura, Algeria — cedar forest and cold nights' },
			{ title: 'Lac Noir', note: 'Kabylie — glassy water at sunrise' },
			{ title: 'Chréa plateau', note: 'Blida — pines and a sea of fog below' },
			{ title: 'Gouraya cliffs', note: 'Béjaïa — wake up over the Mediterranean' },
			{ title: 'Tassili dunes', note: 'Djanet — silence and an ocean of stars' },
			{ title: 'Theniet El Had', note: 'Tissemsilt — the deodar cedar national park' },
		],
	},
	{
		slug: 'tools',
		heading: 'tools',
		blurb: 'software and gear I reach for daily',
		items: [
			{ title: 'Neovim', note: 'editor — muscle memory I can’t undo' },
			{ title: 'tmux', note: 'terminal — every project is a session' },
			{ title: 'Claude Code', note: 'pair programmer that actually ships' },
			{ title: 'Obsidian', note: 'notes — my second brain, in markdown' },
			{ title: 'Nix', note: 'reproducible everything, eventually' },
			{ title: 'Raycast', note: 'launcher — the command palette for my life' },
			{ title: 'Fujifilm X100V', note: 'the camera I actually carry' },
		],
	},
];

export function getList(slug: string): List | undefined {
	return lists.find((list) => list.slug === slug);
}

/** Number of items shown per list on the /lists index preview. */
export const PREVIEW_COUNT = 3;
