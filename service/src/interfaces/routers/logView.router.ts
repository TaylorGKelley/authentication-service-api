import { Router } from 'express';
import { getAllLogs } from '../controllers/logView.controller';
import authorize from '../middleware/authorize';

const logViewRouter = Router();

logViewRouter.get('/', authorize(['admin:read:all']), getAllLogs);

export default logViewRouter;
