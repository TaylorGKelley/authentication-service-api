import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const updatePermission = async (
	linkedServiceId: LinkedService['id'],
	permissionId: number,
	permission: Omit<
		Partial<typeof permissionTable.$inferInsert>,
		'id' | 'linkedServiceId'
	>
) => {
	return (
		await db
			.update(permissionTable)
			.set(permission)
			.where(
				and(
					eq(permissionTable.linkedServiceId, linkedServiceId),
					eq(permissionTable.id, permissionId)
				)
			)
			.returning()
	).at(0);
};

export default updatePermission;
