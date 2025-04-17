import {
  serial,
  pgTable,
  varchar,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';
import { linkedServiceTable } from './linkedService.schema';

export const roleTable = pgTable('role', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 128 }).notNull(),
  assignToNewUser: boolean('assign_to_new_user').default(false),
  linkedServiceId: integer('linked_service_id')
    .references(() => linkedServiceTable.id, { onDelete: 'cascade' })
    .notNull(),
});
