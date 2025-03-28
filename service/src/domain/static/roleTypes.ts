import { permissionLevelEnum } from '@/infrastructure/database/schema';

export const role: Record<'owner' | 'admin' | 'reportUser' | 'user', roleType> =
  {
    owner: [permissionLevelEnum.enumValues[0]],
    admin: [
      permissionLevelEnum.enumValues[0],
      permissionLevelEnum.enumValues[1],
    ],
    reportUser: [
      permissionLevelEnum.enumValues[0],
      permissionLevelEnum.enumValues[1],
      permissionLevelEnum.enumValues[2],
    ],
    user: [
      permissionLevelEnum.enumValues[0],
      permissionLevelEnum.enumValues[1],
      permissionLevelEnum.enumValues[2],
      permissionLevelEnum.enumValues[3],
    ],
  } as const;

export type roleType = (typeof permissionLevelEnum.enumValues)[number][];
