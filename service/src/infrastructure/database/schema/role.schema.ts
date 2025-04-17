import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const roleTable = pgTable('role', {
	id: integer('id').primaryKey(),
	name: varchar('name', { length: 128 }).notNull(),
});
