import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';
import bytea from './types/bytea';
import { userTable } from '.';
import phoneNumber from './types/phoneNumber';

export const profileInfoTable = pgTable('profile_info', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => userTable.id, {
    onDelete: 'cascade',
  }),
  firstName: varchar('first_name', { length: 256 }).notNull(),
  lastName: varchar('last_name', { length: 256 }).notNull(),
  phoneNumber: phoneNumber('phone_number', { length: 20 }),
  profileImage: bytea('profile_image'),
});
