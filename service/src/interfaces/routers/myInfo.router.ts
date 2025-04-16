import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import { getMyInfo, updateMyInfo } from '../controllers/myInfo.controller';

const myInfoRouter = Router();

myInfoRouter
  .get('/me', requireAuth, getMyInfo)
  .patch('/me', requireAuth, updateMyInfo);

export default myInfoRouter;
