import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000 * 1000, // 15 minutes
	max: 20, // Limit each IP to 10 requests per windowMs
	message: 'Too many requests from this IP, please try again after 15 minutes.',
});

export const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000 * 1000, // 15 minutes
	max: 5, // Limit each IP to 5 login attempts per windowMs
	message: 'Too many login attempts, please try again after 15 minutes.',
});

export const registerLimiter = rateLimit({
	windowMs: 15 * 60 * 1000 * 1000, // 15 minutes
	max: 10, // Limit each IP to 5 login attempts per windowMs
	message: 'Too many attempts to register, please try again after 15 minutes.',
});

export const refreshTokenLimiter = rateLimit({
	max: 2,
	windowMs: 15 * 60 * 1000 * 1000,
	message:
		'Too many attempts to refresh token, please try again after 15 minutes.',
});
