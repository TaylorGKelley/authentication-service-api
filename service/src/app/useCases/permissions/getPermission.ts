import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const getPermission = async (permissionId: number) => {
  return (
    await db
      .select()
      .from(permissionTable)
      .where(eq(permissionTable.id, permissionId))
      .limit(1)
  ).at(0);
};

export default getPermission;
