import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import { getMyInfo, updateMyInfo } from '../controllers/myInfo.controller';
import { role } from '@/domain/static/roleTypes';
import requireRole from '../middleware/requireRole';

const myInfoRouter = Router();

myInfoRouter
  .get('/me', requireAuth, requireRole(role.admin), getMyInfo)
  .patch('/me', requireAuth, updateMyInfo);

export default myInfoRouter;
