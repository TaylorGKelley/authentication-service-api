import {
  permissionTable,
  profileInfoTable,
  roleTable,
  userRoleTable,
  userTable,
} from '../schema';

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

export const userRolesData: (typeof userRoleTable.$inferInsert)[] = [
  {
    id: 0,
    userId: 1,
    roleId: 0,
  },
];

export const rolesData: (typeof roleTable.$inferInsert)[] = [
  {
    id: 0,
    name: 'Super Admin',
    description: 'Super admin account',
  },
];

export const permissionsData: (typeof permissionTable.$inferInsert)[] = [
  {
    id: 0,
    route: '/api/v1/logs',
    method: 'GET',
    name: 'Get All Logs',
    roleId: 0,
  },
];
