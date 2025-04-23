import { db } from '@/infrastructure/database';
import { passwordResetTable } from '@/infrastructure/database/schema/passwordReset.schema';
import { eq } from 'drizzle-orm';

export const deletePasswordResetToken = async (token: string) => {
	await db
		.delete(passwordResetTable)
		.where(eq(passwordResetTable.token, token));
};
