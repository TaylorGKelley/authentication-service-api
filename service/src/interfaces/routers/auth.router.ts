import { Router } from 'express';
import {
  login,
  register,
  logout,
  refreshToken,
  logoutAllDevices,
  checkAuthentication,
  resetPasswordSender,
  resetPassword,
  csrfToken,
} from '@/interfaces/controllers/auth.controller';
import requireAuth from '../middleware/requireAuth';
import {
  loginLimiter,
  refreshTokenLimiter,
  registerLimiter,
} from '../middleware/rateLimiters';

const authRouter = Router();

authRouter.post('/login', loginLimiter, login);
authRouter.post('/register', registerLimiter, register);

authRouter.get('/check-auth', requireAuth, checkAuthentication);
authRouter.get('/csrf-token', csrfToken);

authRouter.post('/refresh-token', refreshTokenLimiter, refreshToken);

authRouter.delete('/logout', requireAuth, logout);
authRouter.delete('/logout/all', requireAuth, logoutAllDevices);

authRouter.get('/send-reset-password', resetPasswordSender);
authRouter.post('/reset-password', resetPassword);

export default authRouter;
