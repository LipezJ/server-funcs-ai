/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly ASSISTANT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}