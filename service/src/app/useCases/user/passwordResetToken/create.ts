import generateResetToken from '@/app/utils/generateResetToken';
import { passwordResetTable } from '@/infrastructure/database/schema/passwordReset.schema';
import { db } from '@/infrastructure/database';
import findUser from '../findUser';
import { EmailAddress } from '@/domain/types/mail/Email';
import { AppError } from '@/domain/entities/AppError';

export const createPasswordResetToken = async (email: EmailAddress) => {
  const user = await findUser({ email });

  if (!user.id) {
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
