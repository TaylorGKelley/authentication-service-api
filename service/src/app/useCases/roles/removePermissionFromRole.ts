import { permissionSyncWorker } from '@/app/workers/PermissionSyncWorker';
import { db } from '@/infrastructure/database';
import { rolePermissionTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const removePermissionFromRole = async (
	roleId: number,
	permissionId: number
) => {
	const result = await db
		.delete(rolePermissionTable)
		.where(
			and(
				eq(rolePermissionTable.permissionId, permissionId),
				eq(rolePermissionTable.roleId, roleId)
			)
		);

	if (result.rowCount != null && result.rowCount > 0) {
		permissionSyncWorker.emit('role-permission-updated', roleId);
	}

	return result.rowCount != null && result.rowCount > 0;
};

export default removePermissionFromRole;
