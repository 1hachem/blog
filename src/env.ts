import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

// Validated, typed environment variables. Import `env` from here instead of
// reaching for `import.meta.env` directly — a missing or malformed var fails
// the build with a clear message rather than surfacing as a broken URL.
export const env = createEnv({
	clientPrefix: 'PUBLIC_',
	client: {
		// Base URL of the Cloudflare R2 bucket that serves the graph photos.
		PUBLIC_R2_URL: z.string().url(),
	},
	server: {},
	runtimeEnv: import.meta.env,
	emptyStringAsUndefined: true,
});
