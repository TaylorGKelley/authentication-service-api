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

const roleRouter = Router();

roleRouter.get('/', getAllRoles);
roleRouter.get('/:roleId', getRole);
roleRouter.post('/', createRole);
roleRouter.put('/:roleId', updateRole);
roleRouter.delete('/:roleId', deleteRole);
roleRouter.post('/add/user', addUserToRole);
roleRouter.delete('/remove/user', removeUserFromRole);
roleRouter.post('/add/permission', addPermissionToRole);
roleRouter.delete('/remove/permission', removePermissionFromRole);

export default roleRouter;
