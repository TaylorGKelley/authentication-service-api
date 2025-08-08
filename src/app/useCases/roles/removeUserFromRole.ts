import permissionSyncWorker from '@/app/workers/PermissionSyncWorker';
import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { userRoleTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';
import { UUID } from 'node:crypto';

const removeUserFromRole = async (
  linkedServiceId: LinkedService['id'],
  roleId: number,
  userId: UUID
) => {
  // ! Check if linked service id is valid

  const result = await db
    .delete(userRoleTable)
    .where(
      and(eq(userRoleTable.userId, userId), eq(userRoleTable.roleId, roleId))
    );

  if (result.rowCount != null && result.rowCount > 0) {
    permissionSyncWorker.emit('user-role-updated', userId);
  }

  return result.rowCount != null && result.rowCount > 0;
};

export default removeUserFromRole;
