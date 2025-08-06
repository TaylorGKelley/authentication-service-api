import { db } from '@/infrastructure/database';
import { eq, getTableColumns } from 'drizzle-orm';
import { profileInfoTable, userTable } from '@/infrastructure/database/schema';
import {
  User,
  UserWithPassword,
  UserWithProfile,
} from '@/domain/entities/User';
import { UUID } from 'node:crypto';

const getUserProfileInfo = async (userId: UUID) => {
  const { password, ...columnsToSelect } = getTableColumns(userTable);

  const result = (
    await db
      .select({
        user: { ...columnsToSelect },
        profileInfo: { ...getTableColumns(profileInfoTable) },
      })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .leftJoin(profileInfoTable, eq(userTable.id, profileInfoTable.userId))
      .limit(1)
  ).at(0);

  if (!result) return null;

  return new UserWithProfile(
    result.user as User,
    result.profileInfo as UserWithPassword
  );
};

export default getUserProfileInfo;
