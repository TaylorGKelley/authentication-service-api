import {
	boolean,
	pgTable,
	serial,
	unique,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core';
import { linkedServiceTable } from './linkedService.schema';

export const permissionTable = pgTable(
	'permission',
	{
		id: serial('id').primaryKey(),
		name: varchar('name', { length: 128 }).notNull(),
		assignToNewRole: boolean('assign_to_new_role').default(false),
		linkedServiceId: uuid('linked_service_id')
			.references(() => linkedServiceTable.id, { onDelete: 'cascade' })
			.notNull(),
	},
	(permission) => [
		unique('permissionNameLinkedServiceConstraint').on(
			permission.name,
			permission.linkedServiceId
		),
	]
);
