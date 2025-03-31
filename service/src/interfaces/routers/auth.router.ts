import { Router } from 'express';
import {
	login,
	register,
	logout,
	refreshToken,
	logoutAllDevices,
	checkAuthentication,
	resetPassword,
} from '@/interfaces/controllers/auth.controller';
import requireAuth from '../middleware/requireAuth';
import {
	loginLimiter,
	refreshTokenLimiter,
	registerLimiter,
} from '../middleware/rateLimiters';
import { logRequest } from '../middleware/logRequest';

const authRouter = Router();

authRouter.use(logRequest);

authRouter.post('/login', loginLimiter, login);
authRouter.post('/register', registerLimiter, register);

authRouter.get('/isauthenticated', requireAuth, checkAuthentication);
authRouter.get('/refresh-token', refreshTokenLimiter, refreshToken);

authRouter.delete('/logout', requireAuth, logout);
authRouter.delete('/logout/all', requireAuth, logoutAllDevices);

authRouter.post('/reset-password', resetPassword);

export default authRouter;
