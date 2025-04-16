import { RequestHandler } from 'express';
import { AppError } from '@/domain/entities/AppError';
import { User } from '@/domain/entities/User';

const requireAuth: RequestHandler = (req, _res, next) => {
  try {
    if (!(req.user as User)?.id) {
      throw new AppError('Not Authorized to make this request', 401);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

export default requireAuth;
