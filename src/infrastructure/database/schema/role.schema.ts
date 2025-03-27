import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  varchar,
} from 'drizzle-orm/pg-core';

export const permissionLevelEnum = pgEnum('permissionLevel', [
  'Owner',
  'Admin',
  'Report User',
  'User',
]);

export const roleTable = pgTable('role', {
  id: integer('id').primaryKey(),
  role: varchar('role', { length: 256 }).notNull(),
  isDefault: boolean('isDefault').default(false),
  permissionLevel: permissionLevelEnum('permissionLevel').notNull(),
});
