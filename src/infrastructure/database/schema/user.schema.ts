import { relations } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { profileInfoTable, userActivityLogTable, userRoleTable } from '.';

export const userTable = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  googleId: varchar('google_id', { length: 50 }).unique(),
  githubId: text('github_id'),
  email: varchar('email', { length: 256 }).notNull(),
  emailVerified: boolean('email_verified').notNull().default(false),
  password: varchar('password', { length: 256 }),
  accountActive: boolean('account_active').notNull().default(true),
  lastLoginAt: timestamp('last_login').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userRelations = relations(userTable, ({ one, many }) => {
  return {
    profileInfo: one(profileInfoTable),
    roles: many(userRoleTable),
    logs: many(userActivityLogTable),
  };
});
