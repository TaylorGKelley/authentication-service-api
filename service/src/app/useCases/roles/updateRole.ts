import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { roleTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const updateRole = async (
	linkedServiceId: LinkedService['id'],
	roleId: number,
	role: Partial<typeof roleTable.$inferInsert>
) => {
	return (
		await db
			.update(roleTable)
			.set(role)
			.where(
				and(
					eq(roleTable.linkedServiceId, linkedServiceId),
					eq(roleTable.id, roleId)
				)
			)
			.returning()
	).at(0);
};

export default updateRole;
