import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const getPermission = async (
	linkedServiceId: LinkedService['id'],
	permissionId: number
) => {
	return (
		await db
			.select()
			.from(permissionTable)
			.where(
				and(
					eq(permissionTable.linkedServiceId, linkedServiceId),
					eq(permissionTable.id, permissionId)
				)
			)
			.limit(1)
	).at(0);
};

export default getPermission;
