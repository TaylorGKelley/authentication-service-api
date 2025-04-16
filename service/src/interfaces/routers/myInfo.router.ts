import { Router } from 'express';
import { getMyInfo, updateMyInfo } from '../controllers/myInfo.controller';

const myInfoRouter = Router();

myInfoRouter.get('/me', getMyInfo).patch('/me', updateMyInfo);

export default myInfoRouter;
