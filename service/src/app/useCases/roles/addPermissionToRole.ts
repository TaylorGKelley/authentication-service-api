import { permissionSyncWorker } from '@/app/workers/PermissionSyncWorker';
import { db } from '@/infrastructure/database';
import { rolePermissionTable } from '@/infrastructure/database/schema';

const addPermissionToRole = async (roleId: number, permissionId: number) => {
	const result = (
		await db
			.insert(rolePermissionTable)
			.values({ roleId, permissionId })
			.onConflictDoNothing()
			.returning()
	).at(0);

	if (result) {
		permissionSyncWorker.emit('role-permission-updated', roleId);
	}

	return result;
};

export default addPermissionToRole;
