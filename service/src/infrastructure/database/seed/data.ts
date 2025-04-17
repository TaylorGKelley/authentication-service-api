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
    id: 1,
    email: 'john.doe@example.com',
    password: 'Password123',
  },
];

export const profileInfoData: (typeof profileInfoTable.$inferInsert)[] = [
  {
    userId: 1,
    firstName: 'John',
    lastName: 'Doe',
  },
];

// * serivces
export const linkedServicesData: (typeof linkedServiceTable.$inferInsert)[] = [
  {
    id: 0,
    name: 'internal',
  },
];

// * permissions and roles
export const permissionsData: (typeof permissionTable.$inferInsert)[] = [
  {
    id: 0,
    name: 'user:read',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 1,
    name: 'admin:read:all',
    linkedServiceId: linkedServicesData[0].id!,
  },
  {
    id: 2,
    name: 'admin:write:all',
    linkedServiceId: linkedServicesData[0].id!,
  },
];

export const rolesData: (typeof roleTable.$inferInsert)[] = [
  {
    id: 0,
    name: 'Super Admin',
    linkedServiceId: linkedServicesData[0].id!,
  },
];

// * linking tables
export const userRolesData: (typeof userRoleTable.$inferInsert)[] = [
  {
    id: 0,
    userId: usersData[0].id!,
    roleId: rolesData[0].id!,
  },
];

export const rolePermissionsData: (typeof rolePermissionTable.$inferInsert)[] =
  [
    {
      id: 0,
      permissionId: permissionsData[0].id!,
      roleId: rolesData[0].id!,
    },
    {
      id: 1,
      permissionId: permissionsData[1].id!,
      roleId: rolesData[0].id!,
    },
    {
      id: 3,
      permissionId: permissionsData[2].id!,
      roleId: rolesData[0].id!,
    },
  ];
