import { db } from '@/infrastructure/database';
import { userRoleTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const removeUserFromRole = async (userId: number, roleId: number) => {
	const result = await db
		.delete(userRoleTable)
		.where(
			and(eq(userRoleTable.userId, userId), eq(userRoleTable.roleId, roleId))
		);

	return result.rowCount != null && result.rowCount > 0;
};

export default removeUserFromRole;
