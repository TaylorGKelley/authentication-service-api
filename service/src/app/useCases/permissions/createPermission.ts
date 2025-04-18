import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';

const createPermission = async (
  permission: typeof permissionTable.$inferInsert
) => {
  return (
    await db
      .insert(permissionTable)
      .values({ ...permission, id: undefined })
      .onConflictDoNothing()
      .returning()
  ).at(0);
};

export default createPermission;
