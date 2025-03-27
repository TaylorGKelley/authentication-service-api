import { RequestHandler } from 'express';
import { User } from '@/domain/entities/User';
import getUserProfileInfo from '@/app/useCases/profile/getUserProfileInfo';
import { AppError } from '@/domain/entities/AppError';
import { profileInfoTable } from '@/infrastructure/database/schema';
import updateUserProfileInfo from '@/app/useCases/profile/updateUserProfileInfo';

export const getMyInfo: RequestHandler = async (req, res, next) => {
  try {
    const userId = (req.user as User).id!;
    const user = await getUserProfileInfo(userId);

    if (!user) throw new AppError('User not found', 404);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const updateMyInfo: RequestHandler<
  any,
  any,
  Omit<Partial<typeof profileInfoTable.$inferInsert>, 'id'>
> = async (req, res, next) => {
  try {
    const userId = (req.user as User).id!;
    const profileInfo = req.body;

    if (
      (profileInfo.firstName && !profileInfo.lastName) ||
      (!profileInfo.firstName && profileInfo.lastName)
    ) {
      throw new AppError(
        'First name and last name must be provided together',
        400
      );
    }

    const insertedInfo = await updateUserProfileInfo(userId, profileInfo);

    res.status(200).json({ user: insertedInfo });
  } catch (error) {
    next(error);
  }
};
