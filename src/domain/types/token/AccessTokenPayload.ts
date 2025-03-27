import { Role } from '@/domain/entities/Role';

export default class AccessTokenPayload {
  public id: number;
  public roles: Role[];

  constructor(payload: { id: number; roles: Role[] }) {
    this.id = payload.id;
    this.roles = payload.roles;
  }
}
