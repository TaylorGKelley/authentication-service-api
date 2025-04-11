import {
	serial,
	pgTable,
	varchar,
	timestamp,
	text,
	pgEnum,
	json,
	integer,
} from 'drizzle-orm/pg-core';
import { userTable } from './user.schema';
import { relations } from 'drizzle-orm';
import { userActivityLogTable } from './userActivityLog.schema';

export const eventTypeEnum = pgEnum('eventType', ['request', 'error', 'login']);

export const eventStatusEnum = pgEnum('eventStatus', [
	'info',
	'success',
	'failure',
]);

export const activityLogTable = pgTable('activity_log', {
	id: serial('id').primaryKey(),
	// Device Tracking
	ip: varchar('ip', { length: 16 }).notNull(),
	userAgent: varchar('user_agent', { length: 256 }).notNull(),
	// Event Classification
	eventType: eventTypeEnum('event_type').notNull(),
	eventStatus: eventStatusEnum('event_status').default('info'),
	// Any Error?
	errorMessage: text('error_message'),
	// Request Info
	requestPath: varchar('request_path', { length: 255 }).notNull(),
	// Extra Data
	additionalMetadata: json('additional_metadata'),
	// Timestamp
	createdAt: timestamp('created_at').defaultNow(),
});

export const activityLogTableRelations = relations(
	activityLogTable,
	({ one }) => {
		return {
			user: one(userActivityLogTable),
		};
	}
);
