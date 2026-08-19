// Shared favicon URL logic for external links, used by the rehype-link-favicons
// plugin (prose body links), GitGraph.astro, and BlogPost.astro (the primary link).
export function faviconUrl(href: string): string | undefined {
	let url: URL;
	try {
		url = new URL(href);
	} catch {
		return undefined;
	}
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
	return `https://icons.duckduckgo.com/ip3/${url.hostname}.ico`;
}
