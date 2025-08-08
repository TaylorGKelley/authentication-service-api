import permissionSyncWorker from '@/app/workers/PermissionSyncWorker';
import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { rolePermissionTable } from '@/infrastructure/database/schema';

const addPermissionToRole = async (
  linkedServiceId: LinkedService['id'],
  roleId: number,
  permissionId: number
) => {
  // ! Check if linked service id is valid

  const result = (
    await db
      .insert(rolePermissionTable)
      .values({ roleId, permissionId })
      .onConflictDoNothing()
      .returning()
  ).at(0);

  if (result) {
    permissionSyncWorker.emit('role-permission-updated', roleId);
  }

  return result;
};

export default addPermissionToRole;
