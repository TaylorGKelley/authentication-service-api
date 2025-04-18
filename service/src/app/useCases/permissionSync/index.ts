import { db } from '@/infrastructure/database';
import redisClient from '@/infrastructure/configurations/redis/client';
import {
	permissionTable,
	rolePermissionTable,
	userRoleTable,
} from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';

export const getPermissionsForUser = async (userId: number) => {
	const permissions = await redisClient.get(`user-permissions:${userId}`);

	return permissions ? JSON.parse(permissions) : [];
};

export const getPermissionsForUserFromDB = async (userId: number) => {
	return (
		await db
			.select({ name: permissionTable.name })
			.from(permissionTable)
			.innerJoin(
				rolePermissionTable,
				eq(rolePermissionTable.permissionId, permissionTable.id)
			)
			.innerJoin(
				userRoleTable,
				eq(userRoleTable.roleId, rolePermissionTable.roleId)
			)
			.where(eq(userRoleTable.userId, userId))
	).map((permission) => permission.name);
};

export const getAllUsersWithPermissions = async () => {
	const userPermissions = await db
		.select({
			userId: userRoleTable.userId,
			permissionName: permissionTable.name,
		})
		.from(userRoleTable)
		.innerJoin(permissionTable, eq(permissionTable.id, userRoleTable.roleId));

	const userPermissionsMap = new Map<number, string[]>();
	userPermissions.forEach(({ userId, permissionName }) => {
		if (!userPermissionsMap.has(userId)) {
			userPermissionsMap.set(userId, []);
		}
		userPermissionsMap.get(userId)!.push(permissionName);
	});

	return Array.from(userPermissionsMap.entries()).map(
		([userId, permissions]) => ({
			id: userId,
			permissions,
		})
	);
};

export const getUsersInRole = async (roleId: number) => {
	const userIds = await db
		.select({ userId: userRoleTable.userId })
		.from(userRoleTable)
		.where(eq(userRoleTable.roleId, roleId));

	return userIds.map((user) => user.userId);
};
