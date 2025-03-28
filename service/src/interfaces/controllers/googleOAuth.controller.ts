import { deleteRefreshTokenEntry } from '@/app/useCases/redis/actions';
import {
  generateAccessToken,
  generateRefreshToken,
} from '@/app/useCases/token/generateToken';
import deletePreviousTokens from '@/app/utils/deletePreviousTokens';
import { AppError } from '@/domain/entities/AppError';
import { UserWithPassword } from '@/domain/entities/User';
import { RequestHandler } from 'express';

export const processSignIn: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as UserWithPassword;

    await deletePreviousTokens(req);

    // Generate new tokens
    const newAccessToken = await generateAccessToken(user);
    if (!newAccessToken)
      throw new AppError('Failed to generate access token', 500);

    const { refreshToken: oldRefreshToken } = req.cookies;
    if (oldRefreshToken) await deleteRefreshTokenEntry(oldRefreshToken);

    const newRefreshToken = await generateRefreshToken(user);
    if (!newRefreshToken)
      throw new AppError('Failed to generate refresh token', 500);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.redirect(`http://localhost:5173/?at=${newAccessToken}`);
  } catch (error) {
    next(error);
  }
};
