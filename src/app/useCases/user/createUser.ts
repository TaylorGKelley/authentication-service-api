import hashPassword from '@/app/utils/hashPassword';
import { UserWithPassword, UserWithProfile } from '@/domain/entities/User';
import { db } from '@/infrastructure/database';
import {
  profileInfoTable,
  roleTable,
  userRoleTable,
  userTable,
} from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const createUser = async (user: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  const hashedPassword = await hashPassword(user.password);

  const newUser = (
    await db
      .insert(userTable)
      .values({
        email: user.email,
        password: hashedPassword,
      })
      .returning()
  ).at(0) as UserWithPassword;
  const profileInfo = (
    await db
      .insert(profileInfoTable)
      .values({
        userId: newUser.id,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .returning()
  ).at(0) as { firstName: string; lastName: string };

  const createdUser = new UserWithProfile(newUser, {
    firstName: profileInfo.firstName,
    lastName: profileInfo.lastName,
  });

  // Insert default roles
  const defaultRoles = await db
    .select()
    .from(roleTable)
    .where(eq(roleTable.assignToNewUser, true))
    .limit(1);
  await db
    .insert(userRoleTable)
    .values(
      defaultRoles.map((role) => ({ userId: createdUser.id!, roleId: role.id }))
    )
    .returning();

  return createdUser;
};

export default createUser;
