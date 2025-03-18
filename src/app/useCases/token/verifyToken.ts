import { AppError } from '@/domain/entities/AppError';
import jwt from 'jsonwebtoken';
import RefreshTokenPayload from '@/domain/entities/token/RefreshTokenPayload';
import AccessTokenPayload from '@/domain/entities/token/AccessTokenPayload';
import {
	validateAccessTokenEntry,
	validateRefreshTokenEntry,
} from '../redis/actions';

export const verifyAccessToken = async (
	accessToken: string
): Promise<number> => {
	try {
		const { id: userId } = jwt.verify(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET!
		) as AccessTokenPayload;

		if (!(await validateAccessTokenEntry(accessToken)))
			throw new AppError('Invalid access token', 401);

		return userId;
	} catch (error) {
		if (error instanceof AppError) throw error;
		else throw new AppError('Invalid access token', 401);
	}
};

export const verifyRefreshToken = async (
	refreshToken: string
): Promise<number> => {
	try {
		const { rid, id: userId } = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET!
		) as RefreshTokenPayload;

		if (!validateRefreshTokenEntry(rid, userId))
			throw new AppError('Invalid or expired refresh token', 401);

		return userId;
	} catch (error) {
		if (error instanceof AppError) throw error;
		else throw new AppError('Invalid refresh token', 401);
	}
};
