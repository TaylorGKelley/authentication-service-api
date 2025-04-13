import { Router } from 'express';
import { getAllLogs } from '../controllers/logView.controller';
import requireAuth from '../middleware/requireAuth';
import { role } from '@/domain/static/roleTypes';
import requireRole from '../middleware/requireRole';

const logViewRouter = Router();

logViewRouter.get('/', requireAuth, requireRole(role.reportUser), getAllLogs);

export default logViewRouter;
