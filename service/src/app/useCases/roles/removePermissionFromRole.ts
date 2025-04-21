import { permissionSyncWorker } from '@/app/workers/PermissionSyncWorker';
import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { rolePermissionTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const removePermissionFromRole = async (
	linkedServiceId: LinkedService['id'],
	roleId: number,
	permissionId: number
) => {
	// ! Check if linked service id is valid

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
