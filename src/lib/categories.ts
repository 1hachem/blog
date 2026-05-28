export const CATEGORIES = {
	general: {
		label: 'general',
		description: 'General thoughts, life updates, and things that don\'t fit elsewhere.',
	},
	tech: {
		label: 'tech',
		description: 'Software engineering, tools, and technical deep-dives.',
	},
} as const;

export type CategoryKey = keyof typeof CATEGORIES;

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];
