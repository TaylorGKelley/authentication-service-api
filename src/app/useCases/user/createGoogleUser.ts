import { eq } from 'drizzle-orm';
import { UserWithPassword, UserWithProfile } from '@/domain/entities/User';
import { db } from '@/infrastructure/database';
import {
  profileInfoTable,
  roleTable,
  userRoleTable,
  userTable,
} from '@/infrastructure/database/schema';
import imageUrlToBase64 from '@/app/utils/imageUrlToBase64';
import { userEvent } from '@/app/workers/UserEventWorker';

const createGoogleUser = async (user: {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
}) => {
  const newUser = (
    await db
      .insert(userTable)
      .values({
        googleId: user.googleId,
        email: user.email,
      })
      .returning()
  ).at(0) as UserWithPassword;

  const newProfile = (
    await db
      .insert(profileInfoTable)
      .values({
        userId: newUser.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: await imageUrlToBase64(user.photo),
      })
      .returning()
  ).at(0) as Partial<UserWithProfile>;

  // Insert default roles
  const defaultRoles = await db
    .select()
    .from(roleTable)
    .where(eq(roleTable.assignToNewUser, true))
    .limit(1);
  await db
    .insert(userRoleTable)
    .values(
      defaultRoles.map((role) => ({ userId: newUser.id!, roleId: role.id }))
    )
    .returning();

  const userWithProfile = new UserWithProfile(newUser, {
    ...newProfile,
    id: newUser.id,
  });

  // Notify external services
  userEvent.emit('user-created', newUser.id);

  return userWithProfile;
};

export default createGoogleUser;
