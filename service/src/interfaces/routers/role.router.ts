import { Router } from 'express';
import {
	addPermissionToRole,
	addUserToRole,
	createRole,
	deleteRole,
	getAllRoles,
	getRole,
	removePermissionFromRole,
	removeUserFromRole,
	updateRole,
} from '../controllers/role.controller';
import authorize from '../middleware/authorize';

const roleRouter = Router({ mergeParams: true });

roleRouter.get('/', authorize(['role:read:all']), getAllRoles);
roleRouter.get('/:roleId', authorize(['role:read']), getRole);
roleRouter.post('/', authorize(['role:create']), createRole);
roleRouter.put('/:roleId', authorize(['role:update']), updateRole);
roleRouter.delete('/:roleId', authorize(['role:delete']), deleteRole);
roleRouter.post('/add/user', authorize(['role:user:add']), addUserToRole);
roleRouter.delete(
	'/remove/user',
	authorize(['role:user:remove']),
	removeUserFromRole
);
roleRouter.post(
	'/add/permission',
	authorize(['role:permission:add']),
	addPermissionToRole
);
roleRouter.delete(
	'/remove/permission',
	authorize(['role:permission:remove']),
	removePermissionFromRole
);

export default roleRouter;
