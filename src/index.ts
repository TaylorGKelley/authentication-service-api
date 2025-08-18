if (process.env.NODE_ENV === 'development') import('dotenv/config');

import permissionSyncWorker from './app/workers/PermissionSyncWorker';
import './app/workers/UserCreatedWorker';

import app from './app';
import { AppError } from './domain/entities/AppError';

const port = process.env.PORT || 7001;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);

  if (process.env.NODE_ENV === 'development' && process.env.SHOW_ERROR_STACK)
    console.error(err.stack);

  if (err instanceof AppError && !err.isOperational) {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error, _promise) => {
  console.error(`Unhandled Rejection: ${error.message}`);
});

const server = app.listen(port, () => {
  console.log(`Application is running on port: ${port}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down server...');

  permissionSyncWorker.dispose();

  server.close(() => {
    console.log('Closed out remaining connections.');
    process.exit(0);
  });
});
