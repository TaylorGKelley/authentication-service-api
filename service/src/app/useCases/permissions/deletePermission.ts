import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const deletePermission = async (
	linkedServiceId: LinkedService['id'],
	permissionId: number
) => {
	const result = await db
		.delete(permissionTable)
		.where(
			and(
				eq(permissionTable.linkedServiceId, linkedServiceId),
				eq(permissionTable.id, permissionId)
			)
		);

	return result.rowCount != null && result.rowCount > 0;
};

export default deletePermission;
