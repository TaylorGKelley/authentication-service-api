import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';

const createPermission = async (
	linkedServiceId: LinkedService['id'],
	permission: Omit<typeof permissionTable.$inferInsert, 'linkedServiceId'>
) => {
	return (
		await db
			.insert(permissionTable)
			.values({ ...permission, id: undefined, linkedServiceId })
			.onConflictDoNothing()
			.returning()
	).at(0);
};

export default createPermission;
