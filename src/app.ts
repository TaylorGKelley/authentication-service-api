import './app/workers/PermissionSyncWorker';
import './app/workers/UserCreatedWorker';

import express from 'express';
import cors from 'cors';
import passport from '@/infrastructure/configurations/passport';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csrfProtected from './interfaces/middleware/csrfProtected';
import { generalLimiter } from './interfaces/middleware/rateLimiters';
import { errorHandler } from './interfaces/controllers/error.controller';
import authRouter from './interfaces/routers/auth.router';
import myInfoRouter from './interfaces/routers/myInfo.router';
import googleOAuthRouter from './interfaces/routers/googleOAuth.router';
import { logRequest } from './interfaces/middleware/logRequest';
import logViewRouter from './interfaces/routers/logView.router';
import authenticateRequest from './interfaces/middleware/authenticateRequest';
import permissionRouter from './interfaces/routers/permission.router';
import roleRouter from './interfaces/routers/role.router';
import linkedServiceRouter from './interfaces/routers/linkedServices.router';

const app = express();
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: process.env.CLIENT_URL!,
  credentials: true, // Allow cookies (refresh token) to be sent
} as const;
app.use(cors(corsOptions));

app.use(helmet());
app.use(generalLimiter);

app.use(
  csrfProtected({
    exemptRoutes: [
      '/api/v1/login',
      '/api/v1/register',
      '/api/v1/isauthenticated',
      '/api/v1/auth/google',
      '/api/v1/auth/google/callback',
    ],
  })
); // Protect the entire application (CSRF)

app.use(passport.initialize());

app.use(logRequest);
app.use(authenticateRequest);

app.use('/api/v1', authRouter);
app.use('/api/v1/auth/google', googleOAuthRouter);
app.use('/api/v1/users', myInfoRouter);
app.use('/api/v1/logs', logViewRouter);
app.use('/api/v1/linked-services', linkedServiceRouter);
app.use(
  '/api/v1/linked-services/:linkedServiceId/permissions',
  permissionRouter
);
app.use('/api/v1/linked-services/:linkedServiceId/roles', roleRouter);

app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

export default app;
