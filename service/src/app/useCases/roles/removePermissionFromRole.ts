import { db } from '@/infrastructure/database';
import { rolePermissionTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const removePermissionFromRole = async (
	permissionId: number,
	roleId: number
) => {
	const result = await db
		.delete(rolePermissionTable)
		.where(
			and(
				eq(rolePermissionTable.permissionId, permissionId),
				eq(rolePermissionTable.roleId, roleId)
			)
		);

	return result.rowCount != null && result.rowCount > 0;
};

export default removePermissionFromRole;
