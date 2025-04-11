import { db } from '@/infrastructure/database';
import { activityLogTable } from '@/infrastructure/database/schema';

type LogEventParams = typeof activityLogTable.$inferInsert;

export const logRequest = async (event: LogEventParams) => {
	return await db.insert(activityLogTable).values(event);
};
