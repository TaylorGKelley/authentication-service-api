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
import {
	loginLimiter,
	refreshTokenLimiter,
	registerLimiter,
} from '../middleware/rateLimiters';
import authorize from '../middleware/authorize';

const authRouter = Router();

authRouter.post('/login', loginLimiter, login);
authRouter.post('/register', registerLimiter, register);

authRouter.get('/check-auth', authorize(['public']), checkAuthentication);
authRouter.get('/csrf-token', csrfToken);

authRouter.post('/refresh-token', refreshTokenLimiter, refreshToken);

authRouter.delete('/logout', authorize(['public']), logout);
authRouter.delete('/logout/all', logoutAllDevices);

authRouter.get('/send-reset-password', resetPasswordSender);
authRouter.post('/reset-password', resetPassword);

export default authRouter;
