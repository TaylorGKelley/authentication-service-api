import Role from '@/domain/types/authorization/Role';
import { UserWithPassword, UserWithProfile } from '@/domain/entities/User';
import { db } from '@/infrastructure/database';
import { profileInfoTable, userTable } from '@/infrastructure/database/schema';

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
        profileImage: user.photo,
      })
      .returning()
  ).at(0) as Partial<UserWithProfile>;

  // Insert default role
  // const defaultRoleId = (
  //   await db
  //     .select()
  //     .from(roleTable)
  //     .where(eq(roleTable.isDefault, true))
  //     .limit(1)
  // ).at(0)?.id;
  // const userRole = await db
  //   .insert(userRoleTable)
  //   .values({ userId: newUser.id, roleId: defaultRoleId || 1 })
  //   .returning();
  // const role = await db
  //   .select()
  //   .from(roleTable)
  //   .where(eq(roleTable.id, defaultRoleId || 0));

  // newUser.roles = [
  //   { ...userRole.at(0), permissionLevel: role.at(0)?.permissionLevel },
  // ] as Role[];

  const userWithProfile = new UserWithProfile(newUser, newProfile);

  return userWithProfile;
};

export default createGoogleUser;
