import { permissionLevelEnum } from '@/infrastructure/database/schema';

export class Role {
  id: number;
  permissionLevel: (typeof permissionLevelEnum.enumValues)[number];

  constructor(role: Role) {
    this.id = role.id;
    this.permissionLevel = role.permissionLevel;
  }
}
