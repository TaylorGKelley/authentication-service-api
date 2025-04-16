import { integer, pgTable, serial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userTable, roleTable } from '.';

export const userRoleTable = pgTable('user_role', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .references(() => userTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  roleId: integer('role')
    .references(() => roleTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export const userRoleRelations = relations(userRoleTable, ({ one }) => {
  return {
    user: one(userTable),
    role: one(roleTable),
  };
});
