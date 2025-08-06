import { integer, uuid, pgTable, serial } from 'drizzle-orm/pg-core';
import { activityLogTable } from './activityLog.schema';
import { userTable } from './user.schema';
import { relations } from 'drizzle-orm';

export const userActivityLogTable = pgTable('user_activity_log', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').references(() => userTable.id, {
    onDelete: 'cascade',
  }),
  activityId: integer('activity_id').references(() => activityLogTable.id, {
    onDelete: 'cascade',
  }),
});

export const userActivityLogRelations = relations(
  userActivityLogTable,
  ({ one }) => {
    return {
      user: one(userTable),
      activity: one(activityLogTable),
    };
  }
);
