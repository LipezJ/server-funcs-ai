/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly BACKEND_URL: string;
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
		avatar: string | undefined | null;
	}
}
