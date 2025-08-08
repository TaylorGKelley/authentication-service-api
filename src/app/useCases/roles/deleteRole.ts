import permissionSyncWorker from '@/app/workers/PermissionSyncWorker';
import LinkedService from '@/domain/types/authorization/LinkedService';
import { db } from '@/infrastructure/database';
import { roleTable } from '@/infrastructure/database/schema';
import { and, eq } from 'drizzle-orm';

const deleteRole = async (
  linkedServiceId: LinkedService['id'],
  roleId: number
) => {
  const result = await db
    .delete(roleTable)
    .where(
      and(
        eq(roleTable.linkedServiceId, linkedServiceId),
        eq(roleTable.id, roleId)
      )
    );

  if (result.rowCount != null && result.rowCount > 0) {
    permissionSyncWorker.emit('role-permission-updated', roleId);
  }

  return result.rowCount != null && result.rowCount > 0;
};

export default deleteRole;
