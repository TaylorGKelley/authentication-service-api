import { integer, uuid, pgTable, serial, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userTable, roleTable } from '.';

export const userRoleTable = pgTable(
  'user_role',
  {
    id: serial('id').primaryKey(),
    userId: uuid('user_id')
      .references(() => userTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    roleId: integer('role_id')
      .references(() => roleTable.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (userRole) => [
    unique('userRoleConstraint').on(userRole.userId, userRole.roleId),
  ]
);

export const userRoleRelations = relations(userRoleTable, ({ one }) => {
  return {
    user: one(userTable),
    role: one(roleTable),
  };
});
