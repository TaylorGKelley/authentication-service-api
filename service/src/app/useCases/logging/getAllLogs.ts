import { db } from '@/infrastructure/database';
import { activityLogTable } from '@/infrastructure/database/schema';

export const getAllLogs = async () => {
	const logs = await db.select().from(activityLogTable);

	return logs;
};
