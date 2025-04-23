import { db } from '@/infrastructure/database';
import { eq, getTableColumns } from 'drizzle-orm';
import { profileInfoTable, userTable } from '@/infrastructure/database/schema';
import { User, UserWithProfile } from '@/domain/entities/User';

const getUserProfileInfo = async (userId: number) => {
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
    result.profileInfo as UserWithProfile
  );
};

export default getUserProfileInfo;
