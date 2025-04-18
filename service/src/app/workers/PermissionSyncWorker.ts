// workers/PermissionSyncWorker.ts

import EventEmitter from 'events';
import redisClient from '@/infrastructure/configurations/redis/client';
import {
	getPermissionsForUserFromDB,
	getAllUsersWithPermissions,
	getUsersInRole,
} from '@/app/useCases/permissionSync';

class PermissionSyncWorker extends EventEmitter {
	constructor() {
		super();
		this.fullSync(); // initial sync
		this.setupListeners();
		this.startIntervalSync(); // start the sync interval (15 minutes)
	}

	private setupListeners() {
		this.on('user-role-updated', async (userId: number) => {
			const permissions = await getPermissionsForUserFromDB(userId);
			this.syncUser(userId, permissions);
		});

		this.on('role-permission-updated', async (roleId: number) => {
			const userIds = await getUsersInRole(roleId);

			for (const userId of userIds) {
				const permissions = await getPermissionsForUserFromDB(userId);

				await this.syncUser(userId, permissions);
			}
		});
	}

	public async syncUser(userId: number, permissions: string[]) {
		await redisClient.set(
			`user-permissions:${userId}`,
			JSON.stringify(permissions),
			'EX',
			900 // 15 min TTL
		);
		console.log(`[Sync] Updated permissions for user ${userId}`);
	}

	public async fullSync() {
		console.log('[Sync] Performing full permission sync...');
		const users = await getAllUsersWithPermissions();
		for (const user of users) {
			await this.syncUser(user.id, user.permissions);
		}
		console.log('[Sync] Full permission sync complete.');
	}

	private startIntervalSync() {
		setInterval(() => {
			this.fullSync();
		}, 15 * 60 * 1000); // every 15 minutes
	}
}

export const permissionSyncWorker = new PermissionSyncWorker();
