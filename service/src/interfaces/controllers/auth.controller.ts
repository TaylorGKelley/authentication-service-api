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
import Email, { EmailAddress } from '@/domain/types/mail/Email';
import { sendMail } from '@/app/useCases/mailing/sendMail';
import { isValidPasswordResetToken } from '@/app/useCases/user/passwordResetToken/isValid';
import updatePassword from '@/app/useCases/user/updatePassword';
import { createPasswordResetToken } from '@/app/useCases/user/passwordResetToken/create';
import getUserProfileInfo from '@/app/useCases/profile/getUserProfileInfo';
import extractRefreshToken from '@/app/utils/extractRefreshToken';

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

      const profile = await getUserProfileInfo(user.id!);

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        message: 'Login successful',
        accessToken: newAccessToken,
        user: profile,
      });
    } catch (error) {
      next(error);
    }
  }) as AuthenticateCallback)(req, res, next);
};

export const register: RequestHandler<
  any,
  any,
  {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }
> = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, passwordConfirm } = req.body;

    if (!email || !password) {
      throw new AppError(`Missing ${!email ? 'email' : 'password'}`, 400);
    }

    if (!firstName || !lastName) {
      throw new AppError('Please include a first and last name');
    }

    if (password !== passwordConfirm) {
      throw new AppError('Passwords do not match', 400);
    }

    const user = await findUser({ email });

    if (user?.id) {
      throw new AppError('User already exists', 403);
    }

    const newUser = await createUser({ firstName, lastName, email, password });

    await deletePreviousTokens(req);

    // Generate tokens
    const newAccessToken = await generateAccessToken(newUser);
    const newRefreshToken = await generateRefreshToken(newUser);
    if (!newAccessToken || !newRefreshToken)
      throw new AppError('Failed to generate tokens', 500);

    const { oldRefreshToken } = req.cookies;
    if (oldRefreshToken) await deleteRefreshTokenEntry(oldRefreshToken);

    const profile = await getUserProfileInfo(newUser.id!);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken: newAccessToken, user: profile });
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new AppError('Refresh token not found', 401);

    const verifiedRefreshToken = await verifyRefreshToken(refreshToken);

    const user = await findUser({ id: verifiedRefreshToken.id });

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

export const checkAuthentication: RequestHandler = async (req, res, next) => {
  try {
    const profile = await getUserProfileInfo((req.user as User).id!);

    res.status(200).json({
      isAuthenticated: true,
      user: profile,
    });
  } catch (error) {
    next(error);
  }
};

export const csrfToken: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).json({
      csrfToken: req.csrfToken(),
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    const accessToken = extractBearerToken(req);
    const rid = extractRefreshToken(req);
    if (!rid) throw new AppError('Refresh token not found', 401);

    await deleteAccessTokenEntry(accessToken!);
    await deleteRefreshTokenEntry(rid);

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

export const resetPasswordSender: RequestHandler<
  any,
  any,
  any,
  {
    email: EmailAddress;
  }
> = async (req, res, next) => {
  try {
    const { email } = req.query;

    const resetToken = await createPasswordResetToken(email);

    const message = {
      to: email,
      subject: 'Password Reset',
      text: 'Password Reset',
      html: `
        <p>Forgot Password</p>
        <br />
        <a href="${process.env.CLIENT_URL}/reset-password?resetToken=${resetToken}">Reset Password</a>
              `,
    } as Email;

    await sendMail(message);

    res.status(200).json({
      message: 'Email sent',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword: RequestHandler<
  any,
  any,
  { resetToken: string; newPassword: string; newPasswordConfirm: string }
> = async (req, res, next) => {
  try {
    const { resetToken, newPassword, newPasswordConfirm } = req.body;

    const token = await isValidPasswordResetToken(resetToken);

    if (token.isValid) {
      throw new AppError('Invalid or expired password reset token', 400);
    }

    if (newPassword !== newPasswordConfirm) {
      throw new AppError('Passwords do not match', 400);
    }

    await updatePassword(token.userId!, newPassword);

    res.status(200).json({
      message: 'Password reset',
    });
  } catch (error) {
    next(error);
  }
};
