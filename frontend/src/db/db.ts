import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const turso = createClient({
  url: import.meta.env.LIBSQL_URL,
  authToken: import.meta.env.LIBSQL_AUTH_TOKEN,
});

export const db = drizzle(turso);
