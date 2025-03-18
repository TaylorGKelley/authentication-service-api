import { db } from '@/infrastructure/database';
import { Column, eq, SelectedFields } from 'drizzle-orm';
import { profileInfoTable, userTable } from '@/infrastructure/database/schema';
import { UserWithPassword, UserWithProfile } from '@/domain/entities/User';

const getUserProfileInfo = async (userId: number) => {
	const result = (
		await db
			.select()
			.from(userTable)
			.where(eq(userTable.id, userId))
			.leftJoin(profileInfoTable, eq(userTable.id, profileInfoTable.userId))
			.limit(1)
	).at(0);

	if (!result) return null;

	return new UserWithProfile(
		result.user as UserWithPassword,
		result.profileInfo as UserWithProfile
	);
};

export default getUserProfileInfo;
