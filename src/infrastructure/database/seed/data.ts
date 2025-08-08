import { UUID } from 'node:crypto';
import {
  linkedServiceTable,
  permissionTable,
  profileInfoTable,
  roleTable,
  userRoleTable,
  userTable,
} from '../schema';
import { rolePermissionTable } from '../schema/rolePermission.schema';

// * user info
export const usersData: (typeof userTable.$inferInsert)[] = [
  {
    id: 'e3d9287c-3eeb-4a67-b7a9-c0dba079a087' as UUID,
    email: 'john.doe@example.com',
    password: 'Password123',
  },
];

export const profileInfoData: (typeof profileInfoTable.$inferInsert)[] = [
  {
    userId: usersData[0].id,
    firstName: 'John',
    lastName: 'Doe',
  },
];

// * serivces
export const linkedServicesData: (typeof linkedServiceTable.$inferInsert)[] = [
  {
    id: '8d46d402-37e4-4b9c-82ef-ccf44acbb43f', // Same UUID as is in the .env file
    name: 'internal',
  },
];

// * permissions and roles
export const permissionsData: (typeof permissionTable.$inferInsert)[] = [
  {
    id: 0,
    name: 'log:read:all',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 1,
    name: 'user:read',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 2,
    name: 'permission:read:all',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 3,
    name: 'permission:read',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 4,
    name: 'permission:create',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 5,
    name: 'permission:delete',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 6,
    name: 'role:read:all',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 7,
    name: 'role:read',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 8,
    name: 'role:create',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 9,
    name: 'role:update',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 10,
    name: 'role:delete',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 11,
    name: 'role:user:add',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 12,
    name: 'role:user:remove',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 13,
    name: 'role:permission:add',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 14,
    name: 'role:permission:remove',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 15,
    name: 'linkedService:read:all',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 16,
    name: 'linkedService:read',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 17,
    name: 'linkedService:create',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 18,
    name: 'linkedService:update',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 19,
    name: 'linkedService:delete',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 20,
    name: 'webhook:read',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 21,
    name: 'webhook:write',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 22,
    name: 'webhook:readWrite',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 23,
    name: 'webhookEvent:read',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 24,
    name: 'webhookEvent:retry',
    linkedServiceId: linkedServicesData[0].id!,
  },
];

export const rolesData: (typeof roleTable.$inferInsert)[] = [
  {
    id: 0,
    name: 'Super Admin',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 1,
    name: 'User Default',
    assignToNewUser: true,
    linkedServiceId: linkedServicesData[0].id!,
  },
];

// * linking tables
export const userRolesData: (typeof userRoleTable.$inferInsert)[] = [
  {
    userId: usersData[0].id!,
    roleId: rolesData[0].id!,
  },
  {
    userId: usersData[0].id!,
    roleId: rolesData[1].id!,
  },
];

export const rolePermissionsData: (typeof rolePermissionTable.$inferInsert)[] =
  [
    {
      permissionId: permissionsData[0].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[1].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[2].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[3].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[4].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[5].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[6].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[7].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[8].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[9].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[10].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[11].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[12].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[13].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[14].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[15].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[16].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[17].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[18].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[19].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[20].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[21].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[22].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[23].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[24].id!,
      roleId: rolesData[0].id!,
    },
    {
      permissionId: permissionsData[1].id!,
      roleId: rolesData[1].id!,
    },
  ];
