import { getCollection } from 'astro:content';

export async function getAllPosts() {
	return (await getCollection('blog')).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
}

export function getCategories(posts: Awaited<ReturnType<typeof getAllPosts>>) {
	const seen = new Set<string>();
	for (const post of posts) {
		if (post.data.category) seen.add(post.data.category);
	}
	return [...seen].sort();
}
