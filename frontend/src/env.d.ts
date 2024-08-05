/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly ASSISTANT_ID: string;
	readonly GITHUB_CLIENT_ID: string;
	readonly GITHUB_CLIENT_SECRET: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare namespace App {
	interface Locals {
		user_id: string;
	}
}
