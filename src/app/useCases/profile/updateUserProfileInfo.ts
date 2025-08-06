import { db } from '@/infrastructure/database';
import { profileInfoTable } from '@/infrastructure/database/schema';
import { eq, SelectedFields } from 'drizzle-orm';
import { UUID } from 'node:crypto';

const updateUserProfileInfo = async (
  userId: UUID,
  values: Omit<Partial<typeof profileInfoTable.$inferInsert>, 'id'>
) => {
  const info = await db
    .select()
    .from(profileInfoTable)
    .where(eq(profileInfoTable.userId, userId))
    .limit(1);

  if (info.length < 1) {
    return await db
      .insert(profileInfoTable)
      .values({
        userId,
        firstName: values.firstName || '',
        lastName: values.lastName || '',
        phoneNumber: values.phoneNumber,
        profileImage: values.profileImage,
      })
      .returning();
  } else {
    await db
      .update(profileInfoTable)
      .set(values)
      .where(eq(profileInfoTable.userId, userId))
      .returning();
  }
};

export default updateUserProfileInfo;
