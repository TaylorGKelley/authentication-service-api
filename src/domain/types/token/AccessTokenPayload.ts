import { UUID } from 'node:crypto';

export default class AccessTokenPayload {
  public id: UUID;
  public roleIds: number[];

  constructor(payload: { id: UUID; roleIds: number[] }) {
    this.id = payload.id;
    this.roleIds = payload.roleIds;
  }
}
