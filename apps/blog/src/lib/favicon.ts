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
