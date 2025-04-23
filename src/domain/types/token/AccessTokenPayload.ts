export default class AccessTokenPayload {
  public id: number;
  public roleIds: number[];

  constructor(payload: { id: number; roleIds: number[] }) {
    this.id = payload.id;
    this.roleIds = payload.roleIds;
  }
}
