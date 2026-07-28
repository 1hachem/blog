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
		items: [{ title: 'Add a book', note: 'author — why it stuck' }],
	},
	{
		slug: 'movies',
		heading: 'movies',
		blurb: 'films I keep recommending',
		items: [{ title: 'Add a movie', note: 'director — one line' }],
	},
	{
		slug: 'camping-spots',
		heading: 'camping spots',
		blurb: 'places worth pitching a tent',
		items: [{ title: 'Add a spot', note: 'where — what makes it good' }],
	},
	{
		slug: 'tools',
		heading: 'tools',
		blurb: 'software and gear I reach for daily',
		items: [{ title: 'Add a tool', note: 'what — why it earns its place' }],
	},
];

export function getList(slug: string): List | undefined {
	return lists.find((list) => list.slug === slug);
}

/** Number of items shown per list on the /lists index preview. */
export const PREVIEW_COUNT = 3;
