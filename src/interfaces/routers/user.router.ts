import { Router } from 'express';
import requireAuth from '../middleware/requireAuth';
import { getMyInfo, updateMyInfo } from '../controllers/user.controller';

const userRouter = Router();

userRouter
  .get('/me', requireAuth, getMyInfo)
  .patch('/me', requireAuth, updateMyInfo);

export default userRouter;
