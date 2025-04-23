import { AppError } from '@/domain/entities/AppError';
import { UserWithPassword } from '@/domain/entities/User';
import { db } from '@/infrastructure/database';
import { userTable, userRoleTable } from '@/infrastructure/database/schema';
import { and, eq, SQL } from 'drizzle-orm';

const findUser = async (params: {
  id?: number;
  email?: string;
  googleId?: string;
  githubId?: string;
}) => {
  try {
    const conditions: SQL[] = [];

    (
      Object.keys(params) as (keyof {
        id?: number;
        email: string;
        googleId?: string;
        githubId?: string;
      })[]
    ).forEach((key) => {
      const value = params[key];
      if (value !== undefined) {
        conditions.push(eq(userTable[key], value));
      }
    });

    // If no conditions were passed in, throw an error
    if (conditions.length === 0)
      throw new AppError('No search parameters provided.', 400);

    const results = await db
      .select()
      .from(userTable)
      .where(and(...conditions));

    const userResult = new UserWithPassword(results.at(0) as UserWithPassword);

    return userResult;
  } catch (error) {
    if (error instanceof Error) throw new AppError(error.message, 500);
    else throw new AppError('An unknown error has occurred.', 500);
  }
};

export default findUser;
