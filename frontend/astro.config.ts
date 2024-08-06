import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import auth from "auth-astro";
import node from "@astrojs/node";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  outDir: '../backend/ui',
  output: "server",
  integrations: [tailwind(), react(), auth()],
  adapter: vercel(),
  experimental: {
    serverIslands: true
  }
});