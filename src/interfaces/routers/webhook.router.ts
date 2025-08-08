import { Router } from 'express';
import authorize from '../middleware/authorize';
import {
  createWebhook,
  deleteWebhook,
  getAllFailedEvents,
  getAllWebhooks,
  getWebhook,
  retryEvent,
  updateWebhook,
} from '../controllers/webhook.controller';

const webhookRouter = Router();

webhookRouter
  .get('/', authorize(['webhook:read', 'webhook:readWrite']), getAllWebhooks)
  .post('/', authorize(['webhook:write', 'webhook:readWrite']), createWebhook);

webhookRouter
  .get('/:id', authorize(['webhook:read', 'webhook:readWrite']), getWebhook)
  .put('/:id', authorize(['webhook:write', 'webhook:readWrite']), updateWebhook)
  .delete(
    '/:id',
    authorize(['webhook:write', 'webhook:readWrite']),
    deleteWebhook
  );

webhookRouter.get(
  '/events/failed',
  authorize(['webhookEvent:read']),
  getAllFailedEvents
);
webhookRouter.post(
  '/events/retry/:id',
  authorize(['webhookEvent:retry']),
  retryEvent
);

export default webhookRouter;
