import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const updatePermission = async (
  permissionId: number,
  permission: Partial<typeof permissionTable.$inferInsert>
) => {
  return (
    await db
      .update(permissionTable)
      .set(permission)
      .where(eq(permissionTable.id, permissionId))
      .returning()
  ).at(0);
};

export default updatePermission;
