import { ErrorRequestHandler, RequestHandler } from 'express';
import { AppError } from '@/domain/entities/AppError';

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res
) => {
  if ((error as any)?.code === 'EBADCSRFTOKEN') {
    res.status(403).json({
      message: 'Invalid csrf token',
    });
  } else if (error instanceof Error || error instanceof AppError) {
    res.status((error as AppError).statusCode || 500).json({
      message: error.message,
      stack:
        process.env.NODE_ENV === 'development' && process.env.SHOW_ERROR_STACK
          ? error.stack
          : undefined,
    });
  } else {
    console.error('threw an error');
  }
};
