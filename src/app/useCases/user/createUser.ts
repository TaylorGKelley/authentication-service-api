import hashPassword from '@/app/utils/hashPassword';
import { UserWithPassword } from '@/domain/entities/User';
import { db } from '@/infrastructure/database';
import { userTable } from '@/infrastructure/database/schema';

const createUser = async (user: { email: string; password: string }) => {
	const hashedPassword = await hashPassword(user.password);

	return (
		await db
			.insert(userTable)
			.values({
				email: user.email,
				password: hashedPassword,
			})
			.returning()
	).at(0) as UserWithPassword;
};

export default createUser;
