import {
	serial,
	pgTable,
	varchar,
	boolean,
	unique,
	uuid,
} from 'drizzle-orm/pg-core';
import { linkedServiceTable } from './linkedService.schema';

export const roleTable = pgTable(
	'role',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 128 }).notNull(),
		assignToNewUser: boolean('assign_to_new_user').default(false),
		linkedServiceId: uuid('linked_service_id')
			.references(() => linkedServiceTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(role) => [
		unique('roleNameLinkedServiceConstraint').on(
			role.name,
			role.linkedServiceId
		),
	]
);
