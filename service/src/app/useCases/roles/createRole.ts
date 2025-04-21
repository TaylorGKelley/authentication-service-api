import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { roleTable } from '@/infrastructure/database/schema';

const createRole = async (
	linkedServiceId: LinkedService['id'],
	role: Omit<typeof roleTable.$inferInsert, 'id' | 'linkedServiceId'>
) => {
	return (
		await db
			.insert(roleTable)
			.values({ ...role, linkedServiceId })
			.onConflictDoNothing()
			.returning()
	).at(0);
};

export default createRole;
