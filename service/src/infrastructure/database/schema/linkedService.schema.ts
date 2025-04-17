import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

export const linkedServiceTable = pgTable('linked_service', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
});
