import { db } from '@/infrastructure/database';
import { rolePermissionTable } from '@/infrastructure/database/schema';

const addPermissionToRole = async (roleId: number, permissionId: number) => {
	return (
		await db
			.insert(rolePermissionTable)
			.values({ roleId, permissionId })
			.onConflictDoNothing()
			.returning()
	).at(0);
};

export default addPermissionToRole;
