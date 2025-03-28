import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000 * 1000, // 15 minutes
  max: 20, // Limit each IP to 10 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
});

export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000 * 1000, // 15 minutes
  max: 10, // Limit each IP to 5 login attempts per windowMs
  message: 'Too many attempts to register, please try again later.',
});

export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000 * 1000,
  max: 2, // Limit each IP to 2 refresh token requests per 15 minutes
  message: 'Too many attempts to refresh token, please try again later.',
});
