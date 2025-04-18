import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';

const importPermissions = async (
  permissions: (typeof permissionTable.$inferInsert)[]
) => {
  return await db
    .insert(permissionTable)
    .values(permissions)
    .onConflictDoNothing()
    .returning();
};

export default importPermissions;
