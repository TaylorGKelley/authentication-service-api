import { UUID } from 'crypto';
import redisClient from '@/infrastructure/configurations/redis/client';
import { AppError } from '@/domain/entities/AppError';

export const createRefreshTokenEntry = async (
	rid: UUID,
	userId: number,
	expirationTimeSeconds: number
) => {
	// Store token details in hash set
	await redisClient.hset(`refreshToken:${rid}`, {
		userId,
		expiresAt: expirationTimeSeconds * 1000,
	});

	await redisClient.sadd(`userTokens:${userId}`, rid);
};

export const deleteRefreshTokenEntry = async (rid: UUID) => {
	// Retrieve token details
	const tokenDetails = await redisClient.hgetall(`refreshToken:${rid}`);

	if (tokenDetails?.userId) {
		// Remove the token ID from the user's set
		await redisClient.srem(`userTokens:${tokenDetails.userId}`, rid);
	}

	// Delete the token hash
	await redisClient.del(`refreshToken:${rid}`);
};

export const deleteAllUserRefreshTokenEntries = async (userId: number) => {
	// Retrieve all token IDs for the user
	const tokenIds = await redisClient.smembers(`userTokens:${userId}`);

	if (tokenIds.length > 0) {
		// Delete all token hashes
		const tokenKeys = tokenIds.map((rid) => `refreshToken:${rid}`);
		await redisClient.del(...tokenKeys);

		// Clear the user's token set
		await redisClient.del(`userTokens:${userId}`);
	}
};

export const validateRefreshTokenEntry = async (rid: UUID, userId: number) => {
	const tokenDetails = await redisClient.hgetall(`refreshToken:${rid}`);

	if (!tokenDetails || !tokenDetails.userId) {
		return undefined;
	}

	if (parseInt(tokenDetails.expiresAt, 10) < Date.now()) {
		await deleteRefreshTokenEntry(rid);
		return undefined;
	}

	return tokenDetails.userId;
};

export const createAccessTokenEntry = async (
	accessToken: string,
	expirationTimeSeconds: number
) => {
	return await redisClient.set(
		`accessToken:${accessToken}`,
		'1',
		'EX',
		expirationTimeSeconds
	);
};

export const deleteAccessTokenEntry = async (accessToken: string) => {
	return await redisClient.del(`accessToken:${accessToken}`);
};

export const validateAccessTokenEntry = async (accessToken: string) => {
	const result = await redisClient.exists(`accessToken:${accessToken}`);

	return result === 1; // Record found: 1, Record not found: 0
};
