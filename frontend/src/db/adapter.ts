import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@db/db";
import { sessionTable, userTable } from "@db/schemas";

export const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable);