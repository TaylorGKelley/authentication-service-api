import hashPassword from '@/app/utils/hashPassword';
import { Role } from '@/domain/entities/Role';
import { UserWithPassword } from '@/domain/entities/User';
import { db } from '@/infrastructure/database';
import {
  roleTable,
  userRoleTable,
  userTable,
} from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

const createUser = async (user: { email: string; password: string }) => {
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
  const defaultRoleId = (
    await db
      .select()
      .from(roleTable)
      .where(eq(roleTable.isDefault, true))
      .limit(1)
  ).at(0)?.id;

  const userRole = await db
    .insert(userRoleTable)
    .values({ userId: newUser.id, roleId: defaultRoleId || 1 })
    .returning();
  const role = await db
    .select()
    .from(roleTable)
    .where(eq(roleTable.id, defaultRoleId || 0));

  newUser.roles = [
    { ...userRole.at(0), permissionLevel: role.at(0)?.permissionLevel },
  ] as Role[];

  return newUser;
};

export default createUser;
