import { verifyAccessToken } from '@/app/useCases/token/verifyToken';
import extractBearerToken from '@/app/utils/extractBearerToken';
import { AppError } from '@/domain/entities/AppError';
import { RequestHandler } from 'express';

const requireAuth: RequestHandler = async (req, res, next) => {
	try {
		// Get Access token from Auth header
		const accessToken = req.headers.authorization?.split(' ')[1]; // 'Bearer <token>'
		if (!accessToken) throw new AppError('Authentication token not found', 401);

		const userId = await verifyAccessToken(accessToken);
		if (!userId) throw new AppError('Invalid access token', 401);

		req.user = { id: userId };

		next();
	} catch (error) {
		next(error);
	}
};

export default requireAuth;
