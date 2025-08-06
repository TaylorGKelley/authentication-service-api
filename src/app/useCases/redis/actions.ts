import { UUID } from 'crypto';
import redisClient from '@/infrastructure/configurations/redis/client';
import hashToken from '@/app/utils/hashToken';

export const createRefreshTokenEntry = async (
  rid: UUID,
  userId: UUID,
  expirationTimeSeconds: number
) => {
  const token = await hashToken(rid);

  // Store token details in hash set
  await redisClient.hset(`refreshToken:${token}`, {
    userId,
    expiresAt: expirationTimeSeconds * 1000,
  });

  await redisClient.sadd(`userTokens:${userId}`, token);
};

export const deleteRefreshTokenEntry = async (rid: UUID | string) => {
  const token = await hashToken(rid);

  // Retrieve token details
  const tokenDetails = await redisClient.hgetall(`refreshToken:${token}`);

  if (tokenDetails?.userId) {
    // Remove the token ID from the user's set
    await redisClient.srem(`userTokens:${tokenDetails.userId}`, token);
  }

  // Delete the token hash
  await redisClient.del(`refreshToken:${token}`);
};

export const deleteAllUserRefreshTokenEntries = async (userId: UUID) => {
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

export const validateRefreshTokenEntry = async (rid: UUID, userId: UUID) => {
  const token = await hashToken(rid);

  const tokenDetails = await redisClient.hgetall(`refreshToken:${token}`);

  if (!tokenDetails || !tokenDetails.userId) {
    return false;
  }

  if (parseInt(tokenDetails.expiresAt, 10) < Date.now()) {
    await deleteRefreshTokenEntry(token);
    return false;
  }

  return tokenDetails.userId === userId;
};

export const createAccessTokenEntry = async (
  accessToken: string,
  expirationTimeSeconds: number
) => {
  const token = await hashToken(accessToken);

  return await redisClient.set(
    `accessToken:${token}`,
    '1',
    'EX',
    expirationTimeSeconds
  );
};

export const deleteAccessTokenEntry = async (accessToken: string) => {
  const token = await hashToken(accessToken);
  return await redisClient.del(`accessToken:${token}`);
};

export const validateAccessTokenEntry = async (accessToken: string) => {
  const token = await hashToken(accessToken);

  const result = await redisClient.exists(`accessToken:${token}`);

  return result === 1; // Record found: 1, Record not found: 0
};
