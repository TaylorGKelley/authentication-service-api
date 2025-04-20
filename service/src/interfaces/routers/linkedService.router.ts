import { Router } from 'express';
import {
	createLinkedService,
	deleteLinkedService,
	getAllLinkedServices,
	getLinkedService,
	updateLinkedService,
} from '../controllers/linkedService.controller';
import authorize from '../middleware/authorize';

const linkedServiceRouter = Router();

linkedServiceRouter.get(
	'/',
	authorize(['linkedService:read:all']),
	getAllLinkedServices
);
linkedServiceRouter.get(
	'/:linkedServiceId',
	authorize(['linkedService:read']),
	getLinkedService
);
linkedServiceRouter.post(
	'/',
	authorize(['linkedService:create']),
	createLinkedService
);
linkedServiceRouter.put(
	'/:linkedServiceId',
	authorize(['linkedService:update']),
	updateLinkedService
);
linkedServiceRouter.delete(
	'/:linkedServiceId',
	authorize(['linkedService:delete']),
	deleteLinkedService
);

export default linkedServiceRouter;
