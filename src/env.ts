import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

const options = {
	clientPrefix: 'PUBLIC_',
	client: {
		// Base URL of the Cloudflare R2 bucket that serves the graph photos.
		PUBLIC_R2_URL: z.string().url(),
	},
	server: {},
	emptyStringAsUndefined: true,
} as const;

// Build + validate the env against a specific source. Called once at startup
// from astro.config.mjs (see the env-validation integration) so a missing or
// malformed var fails the dev server / build immediately, not on first render.
export function validateEnv(runtimeEnv: Record<string, string | undefined>) {
	return createEnv({ ...options, runtimeEnv });
}

// App-facing, typed accessor. Lazily validated on first property access so
// that importing this module (e.g. from the Astro config) doesn't eagerly read
// the wrong env source — the startup integration is what validates on boot.
let cached: ReturnType<typeof validateEnv> | undefined;
export const env = new Proxy({} as ReturnType<typeof validateEnv>, {
	get(_target, prop: string) {
		cached ??= validateEnv(import.meta.env);
		return cached[prop as keyof typeof cached];
	},
});
