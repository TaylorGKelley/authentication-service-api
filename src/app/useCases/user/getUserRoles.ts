import { db } from '@/infrastructure/database';
import { userRoleTable } from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';
import { UUID } from 'node:crypto';

const getUserRoles = async (userId: UUID) => {
  return await db
    .select()
    .from(userRoleTable)
    .where(eq(userRoleTable.userId, userId));
};

export default getUserRoles;
