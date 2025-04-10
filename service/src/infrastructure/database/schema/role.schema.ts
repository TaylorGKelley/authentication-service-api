import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  varchar,
} from 'drizzle-orm/pg-core';

export const permissionLevelEnum = pgEnum('permission_level', [
  'Owner',
  'Admin',
  'Report User',
  'User',
]);

export const roleTable = pgTable('role', {
  id: integer('id').primaryKey(),
  role: varchar('role', { length: 256 }).notNull(),
  isDefault: boolean('is_default').default(false),
  permissionLevel: permissionLevelEnum('permission_level').notNull(),
});
