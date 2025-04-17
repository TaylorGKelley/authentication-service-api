import { RequestHandler } from 'express';
// import getAllPermissions from '@/app/useCases/permissions/getAllPermissions';
// import getUserRoles from '@/app/useCases/user/getUserRoles';
// import { AppError } from '@/domain/entities/AppError';
// import { User } from '@/domain/entities/User';
// import { match } from 'path-to-regexp';

const authorizeRequest: RequestHandler = async (req, res, next) => {
	const { method, originalUrl: route } = req;

	try {
		// const permissions = await getAllPermissions();
		// const matchingPermissions = permissions.filter((permission) => {
		//   const isMethodMatch =
		//     permission.method.toUpperCase() === method.toUpperCase();
		//   const isPathMatch = match(permission.route)(route);
		//   return isMethodMatch && isPathMatch;
		// });

		// if (matchingPermissions?.length === 0) {
		//   // Public route
		//   return next();
		// }

		// const user = req.user as User;
		// if (!user?.id) throw new AppError('Authentication required', 401);

		// const userRoles = await getUserRoles(user.id!);
		// const hasAccess = userRoles.some((role) =>
		//   matchingPermissions.map((role) => role.roleId).includes(role.roleId!)
		// );
		// if (!hasAccess) throw new AppError('Forbidden', 403);

		next();
	} catch (error) {
		next(error);
	}
};

export default authorizeRequest;
