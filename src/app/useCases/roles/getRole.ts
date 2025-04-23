import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { roleTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const getRole = async (
	linkedServiceId: LinkedService['id'],
	roleId: number
) => {
	return (
		await db
			.select()
			.from(roleTable)
			.where(
				and(
					eq(roleTable.linkedServiceId, linkedServiceId),
					eq(roleTable.id, roleId)
				)
			)
			.limit(1)
	).at(0);
};

export default getRole;
