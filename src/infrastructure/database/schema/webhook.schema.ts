import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const webhookEventTypeEnum = pgEnum('webhook_event_type', [
  'user.created',
]);

export const webhookTable = pgTable('webhook', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: varchar('url', { length: 2048 }).notNull(),
  eventType: webhookEventTypeEnum('event_type').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  secret: varchar('secret', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
