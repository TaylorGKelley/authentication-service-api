import { db } from '@/infrastructure/database';
import { permissionTable } from '@/infrastructure/database/schema';

const getAllPermissions = async () => {
  return await db.select().from(permissionTable);
};

export default getAllPermissions;
