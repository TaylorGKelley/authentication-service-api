import { db } from '@/infrastructure/database';
import { logTable } from '@/infrastructure/database/schema';

export const logRequest = (ip: string | undefined, requestBody: any) => {
  // Log to database
  db.insert(logTable).values({ ip, requestBody });
};
