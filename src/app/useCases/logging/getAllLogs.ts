import { db } from '@/infrastructure/database';
import {
	activityLogTable,
	userActivityLogTable,
	userTable,
} from '@/infrastructure/database/schema';
import { eq, desc } from 'drizzle-orm';

export const getAllLogs = async () => {
	const logs = await db
		.select()
		.from(activityLogTable)
		.leftJoin(
			userActivityLogTable,
			eq(userActivityLogTable.activityId, activityLogTable.id)
		)
		.leftJoin(userTable, eq(userActivityLogTable.userId, userTable.id))
		.orderBy(desc(activityLogTable.createdAt));

	return logs.map((log) => ({
		...log.activity_log,
		user: log?.user,
	}));
};
