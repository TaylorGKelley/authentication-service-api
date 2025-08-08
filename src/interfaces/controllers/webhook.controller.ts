import {
  NewWebhookType,
  Webhook,
  type WebhookType,
} from '@/app/useCases/webhooks';
import { AppError } from '@/domain/entities/AppError';
import { RequestHandler } from 'express';
import { type UUID } from 'node:crypto';

export const getAllWebhooks: RequestHandler<
  unknown,
  { success: true; data: Omit<WebhookType, 'secret' | 'secretIv'>[] }
> = async (_req, res, next) => {
  try {
    const webhooks = await Webhook.getAll();

    res.status(200).json({
      success: true,
      data: webhooks,
    });
  } catch (error) {
    next(error);
  }
};

export const getWebhook: RequestHandler<
  { id: UUID },
  { success: true; data: Omit<WebhookType, 'secretIv'> | undefined }
> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const webhook = await Webhook.get(id);
    if (!webhook) throw new AppError('Webhook not found', 404);

    res.status(200).json({
      success: true,
      data: webhook,
    });
  } catch (error) {
    next(error);
  }
};

export const createWebhook: RequestHandler<
  unknown,
  { success: true; data: Omit<WebhookType, 'secretIv'> | undefined },
  Omit<NewWebhookType, 'id' | 'secret' | 'secretIv'>
> = async (req, res, next) => {
  try {
    const data = req.body;

    const webhook = await Webhook.create(data);

    res.status(201).json({
      success: true,
      data: webhook,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWebhook: RequestHandler<
  { id: UUID },
  { success: true; data: WebhookType | undefined },
  Partial<Omit<NewWebhookType, 'id'>>
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const webhook = await Webhook.update(id, data);

    res.status(200).json({
      success: true,
      data: webhook,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWebhook: RequestHandler<
  { id: UUID },
  { success: true }
> = async (req, res, next) => {
  try {
    const { id } = req.params;

    const success = await Webhook.delete(id);

    if (!success) throw new AppError('Webhook not found', 404);

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
