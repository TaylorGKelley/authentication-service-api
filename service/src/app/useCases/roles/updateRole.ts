import { db } from '@/infrastructure/database';
import { roleTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const updateRole = async (
	roleId: number,
	role: Partial<typeof roleTable.$inferInsert>
) => {
	return (
		await db
			.update(roleTable)
			.set(role)
			.where(eq(roleTable.id, roleId))
			.returning()
	).at(0);
};

export default updateRole;
