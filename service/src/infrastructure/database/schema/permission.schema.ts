import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import { roleTable } from './role.schema';

export const permissionTable = pgTable('permission', {
  id: serial('id').primaryKey(),
  route: varchar('route', { length: 128 }).notNull(),
  method: varchar('method', { length: 8 }).notNull(),
  name: varchar('description', { length: 256 }).notNull(),
  allowedRole: integer('role_id')
    .references(() => roleTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});
