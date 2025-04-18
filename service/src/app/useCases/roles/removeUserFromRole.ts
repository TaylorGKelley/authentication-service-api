import { permissionSyncWorker } from '@/app/workers/PermissionSyncWorker';
import { db } from '@/infrastructure/database';
import { userRoleTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const removeUserFromRole = async (roleId: number, userId: number) => {
	const result = await db
		.delete(userRoleTable)
		.where(
			and(eq(userRoleTable.userId, userId), eq(userRoleTable.roleId, roleId))
		);

	if (result.rowCount != null && result.rowCount > 0) {
		permissionSyncWorker.emit('user-role-updated', userId);
	}

	return result.rowCount != null && result.rowCount > 0;
};

export default removeUserFromRole;
