import { type RequestHandler } from 'express';
import { type User } from '@/domain/entities/User';
import { type UUID } from 'node:crypto';
import { getPermissionsForUser as getPermissionsForUserUseCase } from '@/app/useCases/permissionSync';
import { AppError } from '@/domain/entities/AppError';

const clientId = process.env.CLIENT_ID! as UUID;

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
				permissions[clientId].includes(allowedPermission)
			);

			if (!isAllowed && !allowedPermissions.includes('public')) {
				throw new AppError('Forbidden', 403);
			}

			next();
		} catch (error) {
			next(error);
		}
	};

export default authorize;
