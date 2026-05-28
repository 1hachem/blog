import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_KEYS } from './lib/categories';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			category: z.enum(CATEGORY_KEYS as [string, ...string[]]).optional(),
			// SEO extras
			keywords: z.array(z.string()).optional(),
			canonicalURL: z.string().url().optional(),
			noindex: z.boolean().optional(),
			ogTitle: z.string().optional(),
			ogDescription: z.string().optional(),
			ogImage: z.string().optional(),
			author: z.string().optional(),
		}),
});

export const collections = { blog };
