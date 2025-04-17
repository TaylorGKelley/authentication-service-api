import hashPassword from '@/app/utils/hashPassword';
import { UserWithPassword, UserWithProfile } from '@/domain/entities/User';
import { db } from '@/infrastructure/database';
import { profileInfoTable, userTable } from '@/infrastructure/database/schema';
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
	).at(0) as UserWithProfile;

	const createdUser = new UserWithProfile(newUser, {
		firstName: profileInfo.firstName,
		lastName: profileInfo.lastName,
	});

	// const defaultRoleId = (
	//   await db
	//     .select()
	//     .from(roleTable)
	//     .where(eq(roleTable.isDefault, true))
	//     .limit(1)
	// ).at(0)?.id;

	// const userRole = await db
	//   .insert(userRoleTable)
	//   .values({ userId: createdUser.id, roleId: defaultRoleId || 1 })
	//   .returning();
	// const role = await db
	//   .select()
	//   .from(roleTable)
	//   .where(eq(roleTable.id, defaultRoleId || 0));

	// createdUser.roles = [
	//   { ...userRole.at(0), permissionLevel: role.at(0)?.permissionLevel },
	// ] as Role[];

	return createdUser;
};

export default createUser;
