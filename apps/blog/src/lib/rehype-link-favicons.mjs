import { faviconUrl } from './favicon.ts';

/**
 * Rehype plugin: for every external link (`http(s)://…`) in the rendered
 * markdown, prepend a small favicon of the destination site so the link reads
 * as `🔖 Title`. The favicon is served by DuckDuckGo's public favicon endpoint
 * (which, unlike Google's, preserves the icon's transparent background) and
 * loaded lazily by the browser — nothing is fetched at build time. Broken or
 * missing icons render as nothing (empty `alt`).
 */
export default function rehypeLinkFavicons() {
	return (tree) => {
		walk(tree);
	};
}

function walk(node) {
	if (node.type === 'element' && node.tagName === 'a') {
		decorate(node);
	}
	if (Array.isArray(node.children)) {
		for (const child of node.children) walk(child);
	}
}

function decorate(node) {
	const href = node.properties?.href;
	if (typeof href !== 'string') return;

	const src = faviconUrl(href);
	if (!src) return; // relative / internal links have no distinct favicon

	// Skip if we've already decorated this link.
	if (node.properties.dataFavicon != null) return;
	node.properties.dataFavicon = '';

	const img = {
		type: 'element',
		tagName: 'img',
		properties: {
			className: ['link-favicon'],
			src,
			alt: '',
			'aria-hidden': 'true',
			loading: 'lazy',
			width: 16,
			height: 16,
		},
		children: [],
	};

	node.children.unshift(img);
}
