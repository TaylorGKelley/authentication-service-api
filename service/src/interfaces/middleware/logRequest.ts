import { RequestHandler } from 'express';
import { logRequest as logRequestUseCase } from '@/app/useCases/logging/logRequest';
import { User } from '@/domain/entities/User';

export const logRequest: RequestHandler = async (req, res, next) => {
	let hasLogged = false;
	const requestTime = Date.now();

	res.on('finish', async () => {
		// prevents running twice when res.status().json() is called
		if (hasLogged) return;
		hasLogged = true;

		const reqDuration = Date.now() - requestTime;
		console.log(req.user);
		const ip =
			req.ip ||
			req.headers['x-forwarded-for']?.toString() ||
			req.socket.remoteAddress ||
			'unknown';
		const userAgent = req.headers['user-agent'] || 'unknown';

		await logRequestUseCase(
			{
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
			},
			req.user as User
		);
	});

	next();
};
