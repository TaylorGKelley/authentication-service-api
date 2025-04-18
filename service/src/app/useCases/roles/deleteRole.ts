import { db } from '@/infrastructure/database';
import { roleTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const deleteRole = async (roleId: number) => {
	const result = await db.delete(roleTable).where(eq(roleTable.id, roleId));

	return result.rowCount != null && result.rowCount > 0;
};

export default deleteRole;
