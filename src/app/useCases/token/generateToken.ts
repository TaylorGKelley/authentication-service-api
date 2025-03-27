import { randomUUID } from 'crypto';
import { User } from '@/domain/entities/User';
import jwt from 'jsonwebtoken';
import {
  createAccessTokenEntry,
  createRefreshTokenEntry,
} from '../redis/actions';
import AccessTokenPayload from '@/domain/types/token/AccessTokenPayload';

export const generateAccessToken = async (user: Partial<User>) => {
  try {
    const accessToken = jwt.sign(
      {
        id: user.id,
        roles: user.roles,
      } as AccessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '15m' }
    );

    await createAccessTokenEntry(accessToken, 15 * 60 * 1000);

    return accessToken;
  } catch (error) {
    return null;
  }
};

export const generateRefreshToken = async (user: User) => {
  try {
    const rid = randomUUID();
    const experationTimeSec = 7 * 24 * 60 * 60;

    await createRefreshTokenEntry(rid, user.id!, experationTimeSec);

    const token = jwt.sign(
      { rid, id: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: '7d',
      }
    );

    return token;
  } catch (error) {
    return null;
  }
};
