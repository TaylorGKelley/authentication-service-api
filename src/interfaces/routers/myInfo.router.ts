import { Router } from 'express';
import { getMyInfo, updateMyInfo } from '../controllers/myInfo.controller';
import authorize from '../middleware/authorize';

const myInfoRouter = Router();

myInfoRouter
	.get('/me', authorize(['user:read']), getMyInfo)
	.patch('/me', updateMyInfo);

export default myInfoRouter;
