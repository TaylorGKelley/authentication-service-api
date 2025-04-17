import { Router } from 'express';
<<<<<<< HEAD
import {
  createPermission,
  deletePermission,
  getAllPermissions,
  getPermission,
  importPermissions,
  updatePermission,
} from '../controllers/permission.controller';
=======
import { getAllPermissions } from '../controllers/permission.controller';
>>>>>>> ed027cf720449c3499a6e0a0f863b97a48a7b00b

const permissionRouter = Router();

permissionRouter.get('/', getAllPermissions);
<<<<<<< HEAD
permissionRouter.get('/:id', getPermission);
permissionRouter.post('/', createPermission);
permissionRouter.post('/import', importPermissions);
permissionRouter.put('/:permissionId', updatePermission);
permissionRouter.delete('/:permissionId', deletePermission);
=======
>>>>>>> ed027cf720449c3499a6e0a0f863b97a48a7b00b

export default permissionRouter;
