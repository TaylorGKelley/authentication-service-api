import { db } from '@/infrastructure/database';
import { roleTable } from '@/infrastructure/database/schema';

const createRole = async (role: typeof roleTable.$inferInsert) => {
	return (
		await db
			.insert(roleTable)
			.values({ ...role, id: undefined })
			.onConflictDoNothing()
			.returning()
	).at(0);
};

export default createRole;
