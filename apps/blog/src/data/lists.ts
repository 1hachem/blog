export interface ListItem {
	title: string;
	note?: string;
	href?: string;
	retired?: boolean;
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
					{
						title: "Good luck, have fun, don't die",
						note: 'A AI doomer movie about a time travler who goes back in time and try to prevent ASI from happening, ASI fights back from the future',
					},
				],
			},
			{
				name: 'drama',
				items: [{ title: 'A Silent Voice: The Movie', note: 'Anime that will make you cry' }],
			},
			{
				name: 'thriller',
				items: [
					{
						title: 'The game (1997)',
						note: 'An arrogant, isolated investment banker is targeted by an enigmatic entertainment company',
					},
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
					{ title: 'kitty', note: 'terminal emulator — fast and unfussy' },
					{ title: 'Nix', note: 'reproducible everything, eventually' },
					{ title: 'Vicinae', note: 'launcher — the command palette for my life' },
					{ title: 'niri', note: 'compositor — scrollable tiling, my daily driver' },
					{ title: 'Brave', note: 'browser — chromium without the Google' },
					{ title: 'eww', note: "desktop widgets — Elkowar's Wacky Widgets" },
					{ title: 'NixOS', note: 'distro — declarative, reproducible, never breaks twice' },
					{ title: 'tmux', note: 'terminal — every project is a session', retired: true },
					{
						title: 'Obsidian',
						note: 'notes — my second brain, in markdown',
						retired: true,
					},
					{ title: 'Rofi', note: 'launcher — the command palette for my life', retired: true },
					{ title: 'Arch Linux', note: 'distro — btw', retired: true },
					{ title: 'Hyprland', note: 'compositor — pretty, but I moved on', retired: true },
					{
						title: 'Conky',
						note: 'desktop widgets — system stats on the wallpaper',
						retired: true,
					},
				],
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
