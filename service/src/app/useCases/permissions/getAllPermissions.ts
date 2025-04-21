import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const getAllPermissions = async (linkedServiceId: LinkedService['id']) => {
	const result = await db
		.select()
		.from(permissionTable)
		.where(eq(permissionTable.linkedServiceId, linkedServiceId));

	return result;
};

export default getAllPermissions;
