import { permissionSyncWorker } from '@/app/workers/PermissionSyncWorker';
import { db } from '@/infrastructure/database';
import { userRoleTable } from '@/infrastructure/database/schema';

const addUserToRole = async (roleId: number, userId: number) => {
	const result = (
		await db
			.insert(userRoleTable)
			.values({ userId, roleId })
			.onConflictDoNothing()
			.returning()
	).at(0);

	if (result) {
		permissionSyncWorker.emit('user-role-updated', userId);
	}

	return result;
};

export default addUserToRole;
