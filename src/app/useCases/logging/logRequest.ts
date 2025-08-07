import { User } from '@/domain/entities/User';
import { db } from '@/infrastructure/database';
import {
  activityLogTable,
  userActivityLogTable,
} from '@/infrastructure/database/schema';

type LogEventParams = typeof activityLogTable.$inferInsert;

export const logRequest = async (event: LogEventParams, user: User) => {
  try {
    const log = (
      await db.insert(activityLogTable).values(event).returning()
    ).at(0);

    if (user?.id && log) {
      await db.insert(userActivityLogTable).values({
        userId: user.id,
        activityId: log.id,
      });
    }
  } catch (error) {
    console.log((error as Error).message);
  }
};
