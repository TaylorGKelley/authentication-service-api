import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

export const linkedServiceTable = pgTable('linked_service', {
	id: uuid('id').primaryKey(),
	name: varchar('name').notNull(),
});
