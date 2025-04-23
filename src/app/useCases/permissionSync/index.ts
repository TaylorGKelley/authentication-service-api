import { db } from '@/infrastructure/database';
import redisClient from '@/infrastructure/configurations/redis/client';
import {
	linkedServiceTable,
	permissionTable,
	rolePermissionTable,
	userRoleTable,
} from '@/infrastructure/database/schema';
import { eq } from 'drizzle-orm';
import { UUID } from 'node:crypto';

export const getPermissionsForUser: (userId: number) => Promise<{
	[linkedServiceId: UUID]: string[];
}> = async (userId) => {
	const permissions = await redisClient.get(`user-permissions:${userId}`);

	return permissions ? JSON.parse(permissions) : {};
};

export const getPermissionsForUserFromDB = async (userId: number) => {
	const permissionServices = await db
		.select({
			linkedServiceId: linkedServiceTable.id,
			name: permissionTable.name,
		})
		.from(permissionTable)
		.innerJoin(
			linkedServiceTable,
			eq(linkedServiceTable.id, permissionTable.linkedServiceId)
		)
		.innerJoin(
			rolePermissionTable,
			eq(rolePermissionTable.permissionId, permissionTable.id)
		)
		.innerJoin(
			userRoleTable,
			eq(userRoleTable.roleId, rolePermissionTable.roleId)
		)
		.where(eq(userRoleTable.userId, userId));

	const serviceMap = new Map<UUID, string[]>();

	permissionServices.forEach(({ linkedServiceId, name }) => {
		if (!serviceMap.has(linkedServiceId as UUID)) {
			serviceMap.set(linkedServiceId as UUID, []);
		}

		serviceMap.get(linkedServiceId as UUID)!.push(name);
	});

	const result: { [linkedServiceId: UUID]: string[] } = {};
	serviceMap.forEach((perms, linkedServiceId) => {
		result[linkedServiceId] = perms;
	});

	return result;
};

export const getAllUsersWithPermissions = async () => {
	const userPermissions = await db
		.select({
			userId: userRoleTable.userId,
			linkedServiceId: linkedServiceTable.id,
			name: permissionTable.name,
		})
		.from(permissionTable)
		.innerJoin(
			linkedServiceTable,
			eq(linkedServiceTable.id, permissionTable.linkedServiceId)
		)
		.innerJoin(
			rolePermissionTable,
			eq(rolePermissionTable.permissionId, permissionTable.id)
		)
		.innerJoin(
			userRoleTable,
			eq(userRoleTable.roleId, rolePermissionTable.roleId)
		);

	const userPermissionsMap = new Map<number, Map<UUID, string[]>>();

	userPermissions.forEach(({ userId, linkedServiceId, name }) => {
		if (!userPermissionsMap.has(userId)) {
			userPermissionsMap.set(userId, new Map());
		}

		const serviceMap = userPermissionsMap.get(userId)!;

		if (!serviceMap.has(linkedServiceId as UUID)) {
			serviceMap.set(linkedServiceId as UUID, []);
		}

		serviceMap.get(linkedServiceId as UUID)!.push(name);
	});

	const result: { [userId: number]: { [linkedServiceId: string]: string[] } } =
		{};
	userPermissionsMap.forEach((serviceMap, userId) => {
		result[userId] = {};
		serviceMap.forEach((perms, linkedServiceId) => {
			result[userId][linkedServiceId.toString()] = perms;
		});
	});

	return result;
};

export const getUsersInRole = async (roleId: number) => {
	const userIds = await db
		.select({ userId: userRoleTable.userId })
		.from(userRoleTable)
		.where(eq(userRoleTable.roleId, roleId));

	return userIds.map((user) => user.userId);
};
