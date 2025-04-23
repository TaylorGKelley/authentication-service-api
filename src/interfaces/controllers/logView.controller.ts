import { RequestHandler } from 'express';
import { getAllLogs as getAllLogsUseCase } from '@/app/useCases/logging/getAllLogs';

export const getAllLogs: RequestHandler = async (_req, res) => {
  const logs = await getAllLogsUseCase();

  res.status(200).json({
    message: 'Successfully fetched all logs',
    logs,
  });
};
