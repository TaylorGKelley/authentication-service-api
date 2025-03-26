import { RequestHandler } from 'express';
import passport from '@/infrastructure/configurations/passport';
import { AuthenticateCallback } from 'passport';
import { User, UserWithPassword } from '@/domain/entities/User';
import {
  generateAccessToken,
  generateRefreshToken,
} from '@/app/useCases/token/generateToken';
import { verifyRefreshToken } from '@/app/useCases/token/verifyToken';
import findUser from '@/app/useCases/user/findUser';
import { AppError } from '@/domain/entities/AppError';
import createUser from '@/app/useCases/user/createUser';
import {
  deleteAccessTokenEntry,
  deleteAllUserRefreshTokenEntries,
  deleteRefreshTokenEntry,
} from '@/app/useCases/redis/actions';
import extractBearerToken from '@/app/utils/extractBearerToken';
import deletePreviousTokens from '@/app/utils/deletePreviousTokens';

export const login: RequestHandler<
  any,
  any,
  { username: string; password: string }
> = async (req, res, next) => {
  await passport.authenticate('local', { session: false }, (async (
    err: AppError,
    user: UserWithPassword
  ) => {
    try {
      if (err) throw new AppError(err.message, err?.statusCode || 500);
      if (!user) throw new AppError('Invalid credentials', 401);

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

      res
        .status(200)
        .json({ message: 'Login successful', accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  }) as AuthenticateCallback)(req, res, next);
};

export const register: RequestHandler<
  any,
  any,
  { email: string; password: string; passwordConfirm: string }
> = async (req, res, next) => {
  try {
    const { email, password, passwordConfirm } = req.body;

    if (!email || !password) {
      throw new AppError(`Missing ${!email ? 'email' : 'password'}`, 400);
    }

    if (password !== passwordConfirm) {
      throw new AppError('Passwords do not match', 400);
    }

    const user = await findUser({ email });

    if (user?.id) {
      throw new AppError('User already exists', 403);
    }

    const newUser = await createUser({ email, password });

    await deletePreviousTokens(req);

    // Generate tokens
    const newAccessToken = await generateAccessToken(newUser);
    const newRefreshToken = await generateRefreshToken(newUser);
    if (!newAccessToken || !newRefreshToken)
      throw new AppError('Failed to generate tokens', 500);

    const { oldRefreshToken } = req.cookies;
    if (oldRefreshToken) await deleteRefreshTokenEntry(oldRefreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken, user: newUser });
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new AppError('Refresh token not found', 401);

    const userId = await verifyRefreshToken(refreshToken);

    const user = await findUser({ id: userId });

    // delete the current tokens
    await deletePreviousTokens(req);

    const newAccessToken = await generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const checkAuthentication: RequestHandler<
  any,
  any,
  any,
  { includeCSRFToken?: string }
> = async (req, res, next) => {
  try {
    const includeCSRFToken = req.query.includeCSRFToken === 'true';

    res.status(200).json({
      isAuthenticated: true,
      csrfToken: includeCSRFToken ? req.csrfToken() : undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = extractBearerToken(req);
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new AppError('Refresh token not found', 401);

    await deleteAccessTokenEntry(accessToken!);
    await deleteRefreshTokenEntry(refreshToken?.rid);

    res.clearCookie('refreshToken');

    res.status(200).json({
      message: 'User logged out',
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAllDevices: RequestHandler = async (req, res, next) => {
  try {
    const { id: userId } = req.user as User;
    const accessToken = extractBearerToken(req);
    await deleteAccessTokenEntry(accessToken!);

    await deleteAllUserRefreshTokenEntries(userId!);

    res.clearCookie('refreshToken');

    res.status(200).json({
      message: 'All Devices have been logged out',
    });
  } catch (error) {
    next(error);
  }
};
