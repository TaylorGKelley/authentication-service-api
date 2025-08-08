// workers/PermissionSyncWorker.ts

import EventEmitter from 'node:events';
import redisClient from '@/infrastructure/configurations/redis/client';
import {
  getPermissionsForUserFromDB,
  getAllUsersWithPermissions,
  getUsersInRole,
} from '@/app/useCases/permissionSync';
import { UUID } from 'node:crypto';

class PermissionSyncWorker extends EventEmitter {
  constructor() {
    super();
    this.fullSync(); // initial sync
    this.setupListeners();
    this.startIntervalSync(); // start the sync interval (10 minutes)
  }

  private setupListeners() {
    this.on('user-role-updated', async (userId: UUID) => {
      const permissions = await getPermissionsForUserFromDB(userId);
      this.syncUser(userId, permissions);
    });

    this.on('role-permission-updated', async (roleId: number) => {
      const userIds = (await getUsersInRole(roleId)) as UUID[];

      for (const userId of userIds) {
        const permissions = await getPermissionsForUserFromDB(userId);

        await this.syncUser(userId, permissions);
      }
    });
  }

  public async syncUser(
    userId: UUID,
    permissions: { [linkedServiceId: string]: string[] }
  ) {
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
    for (const [userId, servicePermissions] of Object.entries(users)) {
      await this.syncUser(userId as UUID, servicePermissions);
    }
    console.log('[Sync] Full permission sync complete.');
  }

  private startIntervalSync() {
    setInterval(() => {
      this.fullSync();
    }, 10 * 60 * 1000); // every 10 minutes
  }

  public dispose() {
    this.removeAllListeners();
  }
}

const permissionSyncWorker = new PermissionSyncWorker();

export default permissionSyncWorker;
