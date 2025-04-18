import { RequestHandler } from 'express';
import { User } from '@/domain/entities/User';
import { getPermissionsForUser as getPermissionsForUserUseCase } from '@/app/useCases/permissionSync';
import { AppError } from '@/domain/entities/AppError';

const authorize: (
	allowedPermissions: string[]
) => RequestHandler<any, any, any, any> =
	(allowedPermissions) => async (req, res, next) => {
		try {
			if (!req.user) {
				throw new AppError('Unauthorized', 401);
			}

			const permissions = await getPermissionsForUserUseCase(
				(req.user as User).id!
			);

			const isAllowed = allowedPermissions.some((allowedPermission) =>
				permissions.includes(allowedPermission)
			);

			if (!isAllowed) {
				throw new AppError('Forbidden', 403);
			}

			next();
		} catch (error) {
			next(error);
		}
	};

export default authorize;
