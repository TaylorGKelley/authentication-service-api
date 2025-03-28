import { AppError } from '@/domain/entities/AppError';
import AccessTokenPayload from '@/domain/types/token/AccessTokenPayload';
import { type roleType } from '@/domain/static/roleTypes';
import { RequestHandler } from 'express';

const requireRole: (allowedPermissionLevels: roleType) => RequestHandler =
  (allowedPermissionLevels) => (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError(
          'Please call requireAuth middleware before requireRole middleware',
          500
        );
      }

      const currentRoles = (req.user as AccessTokenPayload).roles;

      if (
        !currentRoles.some((currentRole) =>
          allowedPermissionLevels.includes(currentRole.permissionLevel)
        )
      ) {
        // Unauthorized
        throw new AppError('User is not authorized to make this request', 403);
      } else {
        // Authorized
        next();
      }
    } catch (error) {
      next(error);
    }
  };

export default requireRole;
