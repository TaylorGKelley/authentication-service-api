import { Router } from 'express';
import {
  createPermission,
  deletePermission,
  getAllPermissions,
  getPermission,
  importPermissions,
  updatePermission,
} from '../controllers/permission.controller';

const permissionRouter = Router();

permissionRouter.get('/', getAllPermissions);
permissionRouter.get('/:id', getPermission);
permissionRouter.post('/', createPermission);
permissionRouter.post('/import', importPermissions);
permissionRouter.put('/:permissionId', updatePermission);
permissionRouter.delete('/:permissionId', deletePermission);

export default permissionRouter;
