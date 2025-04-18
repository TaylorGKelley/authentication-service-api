import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const deletePermission = async (permissionId: number) => {
	const result = await db
		.delete(permissionTable)
		.where(eq(permissionTable.id, permissionId));

	return result.rowCount != null && result.rowCount > 0;
};

export default deletePermission;
