import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts'],
		alias: {
			'astro:content': '/home/hachem/blog/src/__mocks__/astro-content.ts',
		},
	},
});
