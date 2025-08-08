import { type UUID } from 'node:crypto';
import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { webhookEventTypeEnum } from './webhook.schema';

export type UserCreatedPayload = {
  id: UUID;
};

export const webhookEventTable = pgTable('webhook_event', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: webhookEventTypeEnum('event_type').notNull(),
  payload: jsonb('payload').$type<UserCreatedPayload>().notNull(),
  status: varchar('status', { enum: ['pending', 'delivered', 'failed'] })
    .notNull()
    .default('pending'),
  retries: integer('retries').notNull().default(0),
  nextAttemptAt: timestamp('next_attempt_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
