import { User } from '@/domain/entities/User';
import { db } from '@/infrastructure/database';
import {
  activityLogTable,
  userActivityLogTable,
} from '@/infrastructure/database/schema';

type LogEventParams = typeof activityLogTable.$inferInsert;

export const logRequest = async (event: LogEventParams, user: User) => {
  const logs = await db.insert(activityLogTable).values(event).returning();

  if (user) {
    await db.insert(userActivityLogTable).values({
      userId: user.id,
      activityId: logs[0].id,
    });
  }
};
