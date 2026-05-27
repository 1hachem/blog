import { describe, it, expect } from 'vitest';
import { getCategories } from './posts';

type MockPost = Parameters<typeof getCategories>[0][number];

function makePost(overrides: Partial<MockPost['data']> = {}): MockPost {
	return {
		id: 'test',
		body: async () => '',
		collection: 'blog',
		render: async () => ({ Content: {} as any, headings: [], remarkPluginFrontmatter: {} }),
		data: {
			title: 'Test',
			description: 'desc',
			pubDate: new Date('2024-01-01'),
			...overrides,
		},
	};
}

describe('getCategories', () => {
	it('returns sorted unique categories', () => {
		const posts = [
			makePost({ category: 'zebra' }),
			makePost({ category: 'apple' }),
			makePost({ category: 'zebra' }),
		];
		expect(getCategories(posts)).toEqual(['apple', 'zebra']);
	});

	it('omits posts with no category', () => {
		const posts = [makePost({ category: 'tech' }), makePost()];
		expect(getCategories(posts)).toEqual(['tech']);
	});

	it('returns empty array for no posts', () => {
		expect(getCategories([])).toEqual([]);
	});

	it('returns empty array when no posts have a category', () => {
		expect(getCategories([makePost(), makePost()])).toEqual([]);
	});
});

describe('post sorting', () => {
	it('sorts posts newest first', () => {
		const posts = [
			makePost({ pubDate: new Date('2023-01-01') }),
			makePost({ pubDate: new Date('2025-06-01') }),
			makePost({ pubDate: new Date('2024-03-15') }),
		];
		const sorted = [...posts].sort(
			(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
		);
		expect(sorted[0].data.pubDate.getFullYear()).toBe(2025);
		expect(sorted[1].data.pubDate.getFullYear()).toBe(2024);
		expect(sorted[2].data.pubDate.getFullYear()).toBe(2023);
	});
});
