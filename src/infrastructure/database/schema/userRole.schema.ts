import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userTable, roleTable } from '.';

export const userRoleTable = pgTable('userRole', {
	id: serial('id').primaryKey(),
	userId: serial('user_id').references(() => userTable.id),
	roleId: integer('role').references(() => roleTable.id),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userRoleRelations = relations(userRoleTable, ({ one }) => {
	return {
		role: one(roleTable),
	};
});
