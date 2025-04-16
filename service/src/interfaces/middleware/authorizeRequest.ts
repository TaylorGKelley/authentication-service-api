import { AppError } from '@/domain/entities/AppError';
import { RequestHandler } from 'express';

const authorizeRequest: RequestHandler = async (req, res, next) => {
  const method = req.method.toUpperCase();
  const path = req.path;

  try {
    const permissions = await getAllPermissionsFromCacheOrDB(); // [{ routePattern, method, roles }]
    const matchingPermission = permissions.find((perm) => {
      const isMethodMatch = perm.method.toUpperCase() === method;
      const isPathMatch = match(perm.routePattern)(path);
      return isMethodMatch && isPathMatch;
    });
    if (!matchingPermission) {
      // Public route
      return next();
    }
    const user = req.user;
    if (!user)
      return res.status(401).json({ message: 'Authentication required' });
    // const userRoles = await getUserRolesFromCacheOrDB(user.id);
    const hasAccess = userRoles.some((role) =>
      matchingPermission.roles.includes(role)
    );
    if (!hasAccess) return res.status(403).json({ message: 'Forbidden' });
    next();
  } catch (error) {
    next(error);
  }
};

export default authorizeRequest;
