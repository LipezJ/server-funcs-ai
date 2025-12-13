/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace NodeJS {
	interface ProcessEnv {
		BACKEND_URL?: string;
		ASSISTANT_ID?: string;
		GITHUB_CLIENT_ID?: string;
		GITHUB_CLIENT_SECRET?: string;
		LIBSQL_URL?: string;
		LIBSQL_AUTH_TOKEN?: string;
	}
}

declare namespace App {
	interface Locals {
		session: import("lucia").Session | null;
		user: import("lucia").User | null;
	}
}
