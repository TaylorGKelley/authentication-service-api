import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const roleTable = pgTable('role', {
	id: integer('id').primaryKey(),
	role: varchar('role', { length: 256 }).notNull(),
});
