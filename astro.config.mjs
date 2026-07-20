// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap(), pagefind()],
  devToolbar: { enabled: false },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },
});
