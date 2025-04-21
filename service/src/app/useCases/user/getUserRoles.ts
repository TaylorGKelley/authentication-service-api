import { db } from '@/infrastructure/database';
import { userRoleTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const getUserRoles = async (userId: number) => {
  return await db
    .select()
    .from(userRoleTable)
    .where(eq(userRoleTable.userId, userId));
};

export default getUserRoles;
