import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  outDir: '../backend/ui',
  output: "server",
  integrations: [tailwind(), react()]
});