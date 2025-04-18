import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const deletePermission = async (permissionId: number) => {
  await db.delete(permissionTable).where(eq(permissionTable.id, permissionId));
};

export default deletePermission;
