import { uuid, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import { relations } from 'drizzle-orm';

export const passwordResetTable = pgTable('password_reset', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => userTable.id, {
    onDelete: 'cascade',
  }),
  token: varchar('token', { length: 128 }).notNull(),
  expirationTime: timestamp('expiration_time').default(
    new Date(Date.now() + 15 * 60 * 1000)
  ),
});

export const passwordResetRelations = relations(
  passwordResetTable,
  ({ one }) => {
    return {
      user: one(userTable),
    };
  }
);
