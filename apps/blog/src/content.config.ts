import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_KEYS } from './lib/categories';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			draft: z.boolean().default(false),
			title: z.string(),
			description: z.string(),
			tldr: z.string().optional(),
			link: z.url().optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			category: z.enum(CATEGORY_KEYS as [string, ...string[]]).optional(),
			tags: z.array(z.string()).optional(),
			// SEO extras
			keywords: z.array(z.string()).optional(),
			canonicalURL: z.url().optional(),
			noindex: z.boolean().optional(),
			ogTitle: z.string().optional(),
			ogDescription: z.string().optional(),
			ogImage: z.string().optional(),
			author: z.string().optional(),
		}),
});

export const collections = { blog };
