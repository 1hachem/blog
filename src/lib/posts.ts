import { getCollection } from 'astro:content';
import { CATEGORIES, type CategoryKey } from './categories';

export async function getAllPosts() {
	return (await getCollection('blog', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}

export function getCategories(posts: Awaited<ReturnType<typeof getAllPosts>>) {
	const seen = new Set<CategoryKey>();
	for (const post of posts) {
		if (post.data.category) seen.add(post.data.category as CategoryKey);
	}
	return [...seen].sort().map((key) => CATEGORIES[key]);
}

export function getTags(posts: Awaited<ReturnType<typeof getAllPosts>>) {
	const seen = new Set<string>();
	for (const post of posts) {
		for (const tag of post.data.tags ?? []) seen.add(tag);
	}
	return [...seen].sort();
}

export function readingTime(body: string): string {
	const words = body.trim().split(/\s+/).length;
	const mins = Math.max(1, Math.round(words / 200));
	return `${mins} min read`;
}
