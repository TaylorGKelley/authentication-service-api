import { db } from '@/infrastructure/database';
import { userRoleTable } from '@/infrastructure/database/schema';

const addUserToRole = async (roleId: number, userId: number) => {
	return (
		await db
			.insert(userRoleTable)
			.values({ userId, roleId })
			.onConflictDoNothing()
			.returning()
	).at(0);
};

export default addUserToRole;
