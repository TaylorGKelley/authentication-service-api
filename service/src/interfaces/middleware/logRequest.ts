import { RequestHandler } from 'express';
import { logRequest as logRequestUseCase } from '@/app/useCases/logging/logRequest';
import { User } from '@/domain/entities/User';

export const logRequest: RequestHandler = async (req, res, next) => {
  let hasLogged = false;
  const requestTime = Date.now();

  const handleLog = async () => {
    if (hasLogged) return;
    hasLogged = true;

    const reqDuration = Date.now() - requestTime;

    const ip =
      req.ip ||
      req.headers['x-forwarded-for']?.toString() ||
      req.socket.remoteAddress ||
      'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    await logRequestUseCase(
      {
        ip: ip === '::1' ? '127.0.0.1' : ip,
        userAgent,
        eventType: 'request',
        eventStatus: res.statusCode < 400 ? 'success' : 'failure',
        requestPath: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        additionalMetadata: {
          durationMs: reqDuration,
        },
      },
      req.user as User
    );
  };

  res.on('finish', handleLog);

  next();
};
