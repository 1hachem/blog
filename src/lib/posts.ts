import { getCollection } from 'astro:content';
import { CATEGORIES, type CategoryKey } from './categories';

export async function getAllPosts() {
	return (await getCollection('blog')).sort(
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
