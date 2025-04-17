import { RegisteredPermission } from '@/domain/data/permissions';
import { RequestHandler } from 'express';

const authorize: (permissions: RegisteredPermission[]) => RequestHandler =
  (permissions) => async (req, res, next) => {
    try {
      // ! Make authorize middleware

      next();
    } catch (error) {
      next(error);
    }
  };

export default authorize;
