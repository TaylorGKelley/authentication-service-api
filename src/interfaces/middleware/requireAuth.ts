import { verifyAccessToken } from '@/app/useCases/token/verifyToken';
import extractBearerToken from '@/app/utils/extractBearerToken';
import { AppError } from '@/domain/entities/AppError';
import { RequestHandler } from 'express';

const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    // Get Access token from Auth header
    const accessToken = extractBearerToken(req);
    if (!accessToken) throw new AppError('Authentication token not found', 401);

    const verifiedToken = await verifyAccessToken(accessToken);
    if (!verifiedToken?.id) throw new AppError('Invalid access token', 401);

    req.user = verifiedToken;

    next();
  } catch (error) {
    next(error);
  }
};

export default requireAuth;
