import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const permissionTable = pgTable('permission', {
	id: serial('id').primaryKey(),
	name: varchar('description', { length: 128 }).notNull(),
});
