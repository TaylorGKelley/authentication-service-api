import generateResetToken from '@/app/utils/generateResetToken';
import { passwordResetTable } from '@/infrastructure/database/schema/passwordReset.schema';
import { db } from '@/infrastructure/database';
import { AppError } from '@/domain/entities/AppError';
import { User } from '@/domain/entities/User';


export const createPasswordResetToken = async (user: User) => {
	if (user?.id === undefined) {
		throw new AppError('A user with that email was not found');
	} else if (user.googleId || user.githubId) {
		throw new AppError(
			'Password reset is not available for Google or GitHub users',
			400
		);
	}

	const token = generateResetToken();

	await db.insert(passwordResetTable).values({
		userId: user.id,
		token,
		expirationTime: new Date(Date.now() + 15 * 60 * 1000),
	});

	return token;
};
