import { pgTable, integer, serial, unique } from 'drizzle-orm/pg-core';
import { permissionTable } from './permission.schema';
import { roleTable } from './role.schema';

export const rolePermissionTable = pgTable(
	'role_permission',
	{
		id: serial('id').primaryKey(),
		roleId: integer('role_id')
			.references(() => roleTable.id, {
				onDelete: 'cascade',
			})
			.notNull(),
		permissionId: integer('permission_id')
			.references(() => permissionTable.id, {
				onDelete: 'cascade',
			})
			.notNull(),
	},
	(rolePermission) => [
		unique('rolePermissionConstraint').on(
			rolePermission.roleId,
			rolePermission.permissionId
		),
	]
);
