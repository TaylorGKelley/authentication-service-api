import { RequestHandler } from 'express';
import { logRequest as logRequestUseCase } from '@/app/useCases/logging/logRequest';

export const logRequest: RequestHandler = async (req, _res, next) => {
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const body = req.body;

  if (Array.isArray(ip)) {
    ip = ip.join('.');
  } else if (ip === '::1') {
    ip = '127.0.0.1';
  }

  // logRequestUseCase(ip, body);

  next();
};
