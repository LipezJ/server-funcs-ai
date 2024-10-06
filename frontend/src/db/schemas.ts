import {
	sqliteTable,
	text,
	integer
} from 'drizzle-orm/sqlite-core';

const userTable = sqliteTable("user", {
	id: text("id").primaryKey()
});

const sessionTable = sqliteTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer("expires_at").notNull()
});

const functionTable = sqliteTable('functions', {
	func_id: text('func_id').notNull().primaryKey(),
	user_id: text('user_id')
		.notNull()
		.references(() => userTable.id),
	code: text('code')
		.notNull()
		.default('async function handler() {return "Hello"};handler;'),
	type: text('type').notNull().default('json'),
});

export { userTable, sessionTable, functionTable };
