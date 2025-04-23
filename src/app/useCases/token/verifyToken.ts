import { AppError } from '@/domain/entities/AppError';
import jwt from 'jsonwebtoken';
import RefreshTokenPayload from '@/domain/types/token/RefreshTokenPayload';
import AccessTokenPayload from '@/domain/types/token/AccessTokenPayload';
import {
  validateAccessTokenEntry,
  validateRefreshTokenEntry,
} from '../redis/actions';

export const verifyAccessToken = async (
  accessToken: string
): Promise<AccessTokenPayload> => {
  try {
    const token = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as AccessTokenPayload;

    if (!(await validateAccessTokenEntry(accessToken)))
      throw new AppError('Invalid access token', 401);

    return token;
  } catch (error) {
    if (error instanceof AppError) throw error;
    else throw new AppError('Invalid access token', 401);
  }
};

export const verifyRefreshToken = async (
  refreshToken: string
): Promise<RefreshTokenPayload> => {
  try {
    const token = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshTokenPayload;

    if (!validateRefreshTokenEntry(token.rid, token.id))
      throw new AppError('Invalid or expired refresh token', 401);

    return token;
  } catch (error) {
    if (error instanceof AppError) throw error;
    else throw new AppError('Invalid refresh token', 401);
  }
};
