import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';

const importPermissions = async (
	linkedServiceId: LinkedService['id'],
	permissions: Omit<typeof permissionTable.$inferInsert, 'linkedServiceId'>[]
) => {
	return await db
		.insert(permissionTable)
		.values(
			permissions.map((permission) => ({ ...permission, linkedServiceId }))
		)
		.onConflictDoNothing()
		.returning();
};

export default importPermissions;
