import { Router } from 'express';
import {
	createPermission,
	deletePermission,
	getAllPermissions,
	getPermission,
	importPermissions,
	updatePermission,
} from '../controllers/permission.controller';
import authorize from '../middleware/authorize';

const permissionRouter = Router({ mergeParams: true });

permissionRouter.get(
	'/',
	authorize(['permission:read:all']),
	getAllPermissions
);
permissionRouter.get(
	'/:permissionId',
	authorize(['permission:read']),
	getPermission
);
permissionRouter.post('/', authorize(['permission:create']), createPermission);
permissionRouter.post(
	'/import',
	authorize(['permission:create']),
	importPermissions
);
permissionRouter.put(
	'/:permissionId',
	authorize(['permission:update']),
	updatePermission
);
permissionRouter.delete(
	'/:permissionId',
	authorize(['permission:delete']),
	deletePermission
);

export default permissionRouter;
