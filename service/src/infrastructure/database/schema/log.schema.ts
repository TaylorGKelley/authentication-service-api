import { serial, pgTable, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const logTable = pgTable('requestLog', {
  id: serial('id').primaryKey(),
  ip: varchar('ip', { length: 16 }),
  requestBody: text('request_body'),
  createdAt: timestamp('created_at').defaultNow(),
});
