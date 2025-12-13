import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const { LIBSQL_URL, LIBSQL_AUTH_TOKEN } = process.env;

if (!LIBSQL_URL) {
	throw new Error('LIBSQL_URL is not set');
}

const turso = createClient({
	url: LIBSQL_URL,
	authToken: LIBSQL_AUTH_TOKEN,
});

export const db = drizzle(turso);
