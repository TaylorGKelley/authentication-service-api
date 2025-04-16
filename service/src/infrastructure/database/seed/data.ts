import {
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
    id: 1,
    userId: 1,
    roleId: 1,
  },
  {
    id: 2,
    userId: 1,
    roleId: 2,
  },
];

export const rolesData: (typeof roleTable.$inferInsert)[] = [
  {
    id: 0,
    name: 'Super Admin',
    description: 'Super admin account',
  },
];
