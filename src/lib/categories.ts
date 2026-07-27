export const CATEGORIES = {
	general: {
		label: 'general',
		description: "General thoughts, life updates, and things that don't fit elsewhere.",
		quotes: [
			'I have no idea what I\'m doing, but I\'m doing it with confidence.',
			'Life is short. So is this quote.',
			'I\'m not procrastinating, I\'m marinating ideas.',
			'Adulthood is just googling how to do things.',
		],
	},
	tech: {
		label: 'tech',
		description: 'Software engineering, tools, and technical deep-dives.',
		quotes: [
			'It works on my machine, which is technically a place.',
			'I don\'t always test my code, but when I do, I do it in production.',
			'99 little bugs in the code... take one down, patch it around, 127 little bugs in the code.',
			'My code doesn\'t have bugs, it develops random unexpected features.',
		],
	},
} as const;

/** Quotes shown on the "all" view (no category active). */
export const ALL_QUOTES = [
	'Welcome to my corner of the internet. Mind the typos.',
	'A blog nobody asked for, delivered anyway.',
	'Half of these posts are excuses to avoid real work.',
	'Thoughts assembled with more caffeine than caution.',
];

/** Quotes for a category slug, or the "all" set when no category is active. */
export function getQuotes(activeSlug?: string): string[] {
	if (!activeSlug) return [...ALL_QUOTES];
	const cats = Object.values(CATEGORIES);
	const match = cats.find((c) => c.label.toLowerCase().replace(/\s+/g, '-') === activeSlug);
	return match ? [...match.quotes] : [...ALL_QUOTES];
}

export type CategoryKey = keyof typeof CATEGORIES;

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];
