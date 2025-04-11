import { Router } from 'express';
import { getAllLogs } from '../controllers/logView.controller';

const logViewRouter = Router();

logViewRouter.get('/', getAllLogs);

export default logViewRouter;
