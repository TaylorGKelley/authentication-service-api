import { db } from '@/infrastructure/database';
import { passwordResetTable } from '@/infrastructure/database/schema/passwordReset.schema';
import { eq, lt } from 'drizzle-orm';

export const isValidPasswordResetToken = async (token: string) => {
	const tokenRecord = (
		await db
			.select()
			.from(passwordResetTable)
			.where(eq(passwordResetTable.token, token))
			.limit(1)
	).at(0);

	if (!tokenRecord) {
		return { userId: null, isValid: false };
	} else if (tokenRecord.expirationTime! < new Date(Date.now())) {
		// clear all expired tokens out of db
		await db
			.delete(passwordResetTable)
			.where(lt(passwordResetTable.expirationTime, new Date(Date.now())));

		return { userId: null, isValid: false };
	} else {
		return { userId: tokenRecord.userId, isValid: true };
	}
};
