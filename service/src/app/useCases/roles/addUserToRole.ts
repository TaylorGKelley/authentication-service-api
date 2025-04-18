import { db } from '@/infrastructure/database';
import { userRoleTable } from '@/infrastructure/database/schema';

const addUserToRole = async (userId: number, roleId: number) => {
	return await db
		.insert(userRoleTable)
		.values({ userId, roleId })
		.onConflictDoNothing()
		.returning();
};

export default addUserToRole;
