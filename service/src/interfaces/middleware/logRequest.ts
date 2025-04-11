import { RequestHandler } from 'express';
import { logRequest as logRequestUseCase } from '@/app/useCases/logging/logRequest';
import { User } from '@/domain/entities/User';

export const logRequest: RequestHandler = async (req, res, next) => {
	const requestTime = Date.now();

	res.on('finish', async () => {
		const reqDuration = Date.now() - requestTime;

		const ip =
			req.ip ||
			req.headers['x-forwarded-for']?.toString() ||
			req.socket.remoteAddress ||
			'unknown';
		const userAgent = req.headers['user-agent'] || 'unknown';

		await logRequestUseCase({
			userId: (req.user as User | undefined)?.id,
			ip,
			userAgent,
			eventType: 'request',
			eventStatus: res.statusCode < 400 ? 'success' : 'failure',
			requestPath: req.originalUrl,
			additionalMetadata: {
				method: req.method,
				statusCode: res.statusCode,
				durationMs: reqDuration,
			},
		});
	});

	next();
};
